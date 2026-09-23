const fs = require('fs');
const path = require('path');
const {isConfigPath, toLogicalPath, parseConfig} = require('../lib/config-codec');
const {SOURCE_PACKAGE, BUILD_METADATA, VERSION, validateRelativePath} = require('../lib/artifact-manifest');

function filesIn(root, prefix = '') {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, {withFileTypes: true}).flatMap(item => {
    const relative = prefix + item.name;
    if (item.isSymbolicLink()) throw new Error(`Source symlinks are not supported: ${relative}`);
    if (item.name === '.git' || item.name === 'node_modules') return [];
    return item.isDirectory() ? filesIn(path.join(root, item.name), relative + '/') : [relative];
  });
}
function metadata(root) {
  const file = path.join(root, BUILD_METADATA);
  if (!fs.existsSync(file)) return {entries: [], bundledSources: []};
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (data.version !== VERSION || !Array.isArray(data.entries) || !Array.isArray(data.bundledSources)) {
    throw new Error(`Invalid build metadata: ${file}`);
  }
  data.entries.forEach(validateRelativePath);
  data.bundledSources.forEach(validateRelativePath);
  for (const entry of data.entries) {
    if (!data.bundledSources.includes(entry)) throw new Error(`Entry is not a bundled source: ${entry}`);
    if (!fs.existsSync(path.join(root, entry))) throw new Error(`Missing declared entry: ${entry}`);
  }
  return data;
}
function inventory(src, schemas, production) {
  const result = [];
  for (const schema of schemas()) {
    validateRelativePath(schema);
    const root = path.join(src, schema);
    if (fs.lstatSync(root).isSymbolicLink()) throw new Error(`Source symlinks are not supported: ${root}`);
    const files = filesIn(root);
    const meta = metadata(root);
    const entries = [...new Set([...meta.entries, ...files.filter(f => /\.[jt]sx$/.test(f) && !meta.bundledSources.includes(f))])];
    entries.forEach(validateRelativePath);
    result.push({schema, root, files, meta, entries, prefix: `${production ? '' : 'srv/resources/'}${schema}/`});
  }
  return result;
}

class SourceArtifactsPlugin {
  constructor({src, schemas, production}) {
    if (fs.lstatSync(src).isSymbolicLink()) throw new Error(`Source symlinks are not supported: ${src}`);
    Object.assign(this, {src: fs.realpathSync(src), schemas, production});
  }
  inventory() { return inventory(this.src, this.schemas, this.production); }
  entries() {
    const result = {};
    for (const item of this.inventory()) for (const entry of item.entries) {
      const name = item.prefix + entry.replace(/\.[^.]+$/, '');
      if (result[name]) throw new Error(`Duplicate bundle output: ${name}.js`);
      result[name] = path.join(item.root, entry);
    }
    return result;
  }
  apply(compiler) {
    const name = 'SourceArtifactsPlugin';
    compiler.hooks.thisCompilation.tap(name, compilation => {
      compilation.contextDependencies.add(this.src);
      compilation.hooks.processAssets.tap({name, stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT}, () => {
        const {RawSource} = compiler.webpack.sources;
        const inventories = this.inventory();
        for (const asset of compilation.getAssets()) {
          if (!inventories.some(item => asset.name.startsWith(item.prefix))) {
            throw new Error(`Bundle output must belong to a schema (shared/dynamic chunks are unsupported): ${asset.name}`);
          }
        }
        const filesByEntry = new Map();
        const filesBySchema = new Map(inventories.map(item => [item.schema, new Set()]));
        for (const [entryName, entry] of compilation.entries) {
          const owner = inventories.find(item => entryName.startsWith(item.prefix));
          if (!owner) throw new Error(`Entry does not belong to a schema: ${entryName}`);
          const seen = new Set();
          const entryFiles = new Set();
          filesByEntry.set(entryName, entryFiles);
          const addFile = file => {
            if (!file || file.split(path.sep).includes('node_modules')) return;
            const relative = path.relative(owner.root, file);
            if (relative.startsWith('..' + path.sep) || path.isAbsolute(relative)) {
              throw new Error(`Cross-schema or external local source cannot be packaged: ${file}`);
            }
            filesBySchema.get(owner.schema).add(file);
            entryFiles.add(file);
          };
          const visit = module => {
            if (!module || seen.has(module)) return;
            seen.add(module);
            if (module.resource && module.resource.split(path.sep).includes('node_modules')) return;
            if (module.resource) addFile(module.resource.split('?')[0]);
            for (const file of module.buildInfo?.snapshot?.getFileIterable() || module.buildInfo?.fileDependencies || []) {
              if (/\.s[ac]ss$/i.test(file)) addFile(file);
            }
            for (const connection of compilation.moduleGraph.getOutgoingConnections(module)) visit(connection.module);
          };
          for (const dependency of entry.dependencies) visit(compilation.moduleGraph.getModule(dependency));
        }
        // Optimizers can disconnect loader-generated modules from the entry graph.
        // Their registered Sass dependencies still belong to the original resource.
        for (const module of compilation.modules) {
          if (!module.resource) continue;
          const resource = module.resource.split('?')[0];
          const owner = inventories.find(item => resource.startsWith(item.root + path.sep));
          if (!owner) continue;
          filesBySchema.get(owner.schema).add(resource);
          for (const file of module.buildInfo?.snapshot?.getFileIterable() || module.buildInfo?.fileDependencies || []) {
            if (!/\.s[ac]ss$/i.test(file) || file.split(path.sep).includes('node_modules')) continue;
            if (!file.startsWith(owner.root + path.sep)) throw new Error(`Cross-schema or external local source cannot be packaged: ${file}`);
            filesBySchema.get(owner.schema).add(file);
          }
        }
        for (const item of inventories) {
          compilation.contextDependencies.add(item.root);
          const metaPath = path.join(item.root, BUILD_METADATA);
          if (fs.existsSync(metaPath)) compilation.fileDependencies.add(metaPath);
          else compilation.missingDependencies.add(metaPath);

          const owned = new Set(item.meta.bundledSources);
          const originals = new Map();
          for (const file of filesBySchema.get(item.schema)) {
            const relative = path.relative(item.root, file).split(path.sep).join('/');
            if (relative.startsWith('../') || path.isAbsolute(relative) || !relative || !fs.existsSync(file) || !fs.statSync(file).isFile()) continue;
            if (!/\.(?:[cm]?[jt]sx?|s[ac]ss|css|json)$/i.test(relative) || isConfigPath(relative) || relative === BUILD_METADATA) continue;
            validateRelativePath(relative);
            if (fs.realpathSync(file) !== path.join(fs.realpathSync(item.root), relative)) throw new Error(`Source symlinks are not supported: ${file}`);
            originals.set(relative, fs.readFileSync(file, 'utf8'));
            owned.add(relative);
          }
          for (const entry of item.entries) {
            originals.set(entry, fs.readFileSync(path.join(item.root, entry), 'utf8'));
            owned.add(entry);
          }
          // Keep mapped sources untouched: loader-generated CSS modules are JavaScript,
          // not the original stylesheet. Unmapped source entries retain the original
          // files (including Sass partials) using the standard source-map format.
          for (const asset of compilation.getAssets()) {
            if (!asset.name.startsWith(item.prefix) || !asset.name.endsWith('.js.map')) continue;
            const map = JSON.parse(asset.source.source().toString());
            map.sourcesContent ||= map.sources.map(() => null);
            const entryFiles = filesByEntry.get(asset.name.slice(0, -7));
            for (const [relative, content] of originals) {
              if (!entryFiles?.has(path.join(item.root, relative))) continue;
              if (map.sourcesContent.some((text, index) => text === content &&
                  map.sources[index].split('?')[0].endsWith('/' + relative))) continue;
              map.sources.push(`webpack:///./src/${item.schema}/${relative}`);
              map.sourcesContent.push(content);
            }
            compilation.updateAsset(asset.name, new RawSource(JSON.stringify(map)));
          }
          const emitted = new Set();
          for (const file of item.files) {
            if (file === SOURCE_PACKAGE || file === BUILD_METADATA || file === '.gitkeep' || /(^|\/)\.gitkeep$/.test(file)) continue;
            validateRelativePath(file);
            const absolute = path.join(item.root, file);
            if (isConfigPath(file)) {
              const output = toLogicalPath(file);
              validateRelativePath(output);
              const content = fs.readFileSync(absolute, 'utf8');
              const value = parseConfig(content, file);
              const target = item.prefix + output;
              if (emitted.has(target) || compilation.getAsset(target)) throw new Error(`Duplicate resource output: ${target}`);
              emitted.add(target);
              compilation.fileDependencies.add(absolute);
              // Development configs are served through SourceLocal, never stale static copies.
              if (this.production || !/(^|\/)topic\./.test(file)) compilation.emitAsset(target, new RawSource(JSON.stringify(value, null, 2)));
              continue;
            }
            if (owned.has(file) || /\.(?:tsx|jsx|scss)$/.test(file)) continue;
            const target = item.prefix + file;
            if (compilation.getAsset(target)) {
              const existing = compilation.getAsset(target).source.buffer();
              const incoming = fs.readFileSync(absolute);
              // File-loader assets may already exist at the exact original resource path.
              if (!/\.(?:js|map|css)$/.test(file) && existing.equals(incoming)) continue;
              throw new Error(`Resource collides with compiled output: ${target}`);
            }
            compilation.fileDependencies.add(absolute);
            compilation.emitAsset(target, new RawSource(fs.readFileSync(absolute)));
          }
        }
      });
    });
  }
}
module.exports = SourceArtifactsPlugin;
