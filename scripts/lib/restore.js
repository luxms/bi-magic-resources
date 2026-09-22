const fs = require('fs').promises;
const path = require('path');
const { isConfigPath, toLogicalPath, parseConfig, stringifyConfig } = require('./config-codec');
const { SOURCE_PACKAGE, BUILD_METADATA, FORMAT, VERSION, sha256, hashConfig, validateRelativePath } = require('./artifact-manifest');

function safePath(relative) {
  if (typeof relative !== 'string' || !relative || relative.includes('\\') || relative.includes('\0') || relative.startsWith('/') || /^[A-Za-z]:/.test(relative) || relative.split('/').some(p => !p || p === '.' || p === '..')) {
    throw new Error(`Unsafe path: ${relative}`);
  }
  return relative;
}

async function assertNoSymlinks(root, relative = '') {
  let current = path.resolve(root);
  for (const segment of ['', ...relative.split('/').filter(Boolean)]) {
    if (segment) current = path.join(current, segment);
    try {
      if ((await fs.lstat(current)).isSymbolicLink()) throw new Error(`Symlinks are not supported: ${current}`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
}

async function readMaybe(file) {
  try { return await fs.readFile(file); } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

async function listFiles(root, prefix = '') {
  await assertNoSymlinks(root, prefix);
  let entries;
  try { entries = await fs.readdir(path.join(root, prefix), { withFileTypes: true }); } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
  const files = [];
  for (const entry of entries) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    safePath(relative);
    if (entry.isSymbolicLink()) throw new Error(`Symlinks are not supported: ${relative}`);
    if (entry.isDirectory()) files.push(...await listFiles(root, relative));
    else if (entry.isFile()) files.push(relative);
  }
  return files;
}

function contentType(relative) {
  const file = relative.split('/').slice(1).join('/');
  if (/^topic\.\d+\//.test(file)) return 'dashboards';
  if (file.startsWith('.cubes/')) return 'cubes';
  return 'resources';
}

function fingerprint(content, relative, config = isConfigPath(relative)) {
  return config ? hashConfig(parseConfig(content.toString('utf8'), relative)) : sha256(content);
}

// Deliberately restricted to one self-contained source. General webpack maps can
// contain loader output and modules whose dependencies are not reconstructible.
function extractLegacy(relative, mapBytes, bundleBytes) {
  try {
    const map = JSON.parse(mapBytes.toString('utf8'));
    const bundlePath = relative.slice(0, -4);
    const schema = relative.split('/')[0];
    if (map.sourceRoot || map.version !== 3 || map.sources?.length !== 1 || map.sourcesContent?.length !== 1 || typeof map.sourcesContent[0] !== 'string') return null;
    if (map.file !== path.posix.basename(bundlePath) && map.file !== bundlePath.slice(schema.length + 1)) return null;
    const source = map.sources[0];
    const sourcePath = source.startsWith(`webpack://`) ? source.replace(/^webpack:\/\/[^/]*\/(?:\.\/)?src\//, '') : source.replace(/^\.\/src\//, '');
    safePath(sourcePath);
    if (!sourcePath.startsWith(`${schema}/`) || !/\.(jsx|tsx)$/.test(sourcePath) || sourcePath.replace(/\.(jsx|tsx)$/, '.js') !== bundlePath) return null;
    const content = map.sourcesContent[0];
    if (/\b(?:import|require)\b|\bexport\s+[^;\n]*\bfrom\b|__webpack|sourceMappingURL/.test(content)) return null;
    const reference = bundleBytes.toString('utf8').match(/\/\/[#@]\s*sourceMappingURL=([^\s]+)\s*$/);
    if (!reference || reference[1] !== path.posix.basename(relative)) return null;
    return { path: sourcePath, content };
  } catch (_) { return null; }
}

async function restore(options = {}) {
  const rootDir = path.resolve(options.rootDir || path.join(__dirname, '../..'));
  const srcDir = path.join(rootDir, 'src');
  const distDir = path.join(rootDir, 'dist');
  const log = options.log || console.log;
  const include = new RegExp(options.include || '^ds_\\w+$');
  const exclude = options.exclude ? new RegExp(options.exclude) : null;
  const enabled = { resources: options.resources !== false, dashboards: options.dashboards !== false, cubes: options.cubes !== false };
  const selected = relative => {
    const schema = relative.split('/')[0];
    return include.test(schema) && (!exclude || !exclude.test(schema)) && enabled[contentType(relative)];
  };
  // The synchronizer supplies the current remote inventory, so leftovers from an
  // earlier build or disabled content category can never be mistaken for a pull.
  let files = options.paths ? options.paths.map(p => safePath(p.replace(/^\//, '').split('/').map(decodeURIComponent).join('/'))) : await listFiles(distDir);
  files = [...new Set(files)].filter(selected).sort();
  const available = new Map();
  for (const relative of files) {
    await assertNoSymlinks(distDir, relative);
    const bytes = await readMaybe(path.join(distDir, relative));
    if (bytes === null) throw new Error(`Downloaded file missing: ${relative}`);
    available.set(relative, bytes);
  }
  const schemas = new Set(files.map(p => p.split('/')[0]));
  const existingFiles = [];
  for (const schema of schemas) existingFiles.push(...await listFiles(srcDir, schema));
  const logicalConfigs = new Map();
  for (const relative of existingFiles) {
    if (!isConfigPath(relative)) continue;
    const logical = toLogicalPath(relative);
    if (logicalConfigs.has(logical)) throw new Error(`Config output collision: ${logicalConfigs.get(logical)} and ${relative}`);
    logicalConfigs.set(logical, relative);
  }
  const desired = new Map();
  const consumed = new Set();
  const superseded = new Map();
  const metadata = new Map();
  const notices = [];
  function add(relative, content, config = isConfigPath(relative)) {
    safePath(relative);
    const bytes = Buffer.isBuffer(content) ? content : Buffer.from(content);
    if (desired.has(relative) && !desired.get(relative).bytes.equals(bytes)) throw new Error(`Restored source collision: ${relative}`);
    desired.set(relative, { bytes, config });
  }
  function addConfig(logical, content, preferredPath, originalText) {
    const physical = logicalConfigs.get(logical) || preferredPath || logical;
    // Existing YAML/JSON5 convention wins over a remote package's filename.
    const text = physical === preferredPath && originalText !== undefined ? originalText : stringifyConfig(content, physical);
    add(physical, text, true);
  }
  function registerBundle(schema, sources, entries) {
    const item = metadata.get(schema) || { version: 1, entries: [], bundledSources: [] };
    item.entries.push(...entries);
    item.bundledSources.push(...sources);
    metadata.set(schema, item);
  }
  for (const [relative, bytes] of available) {
    if (path.posix.basename(relative) !== SOURCE_PACKAGE) continue;
    if (relative.split('/').length !== 2) throw new Error(`Reserved source package path: ${relative}`);
    consumed.add(relative);
    const schema = relative.split('/')[0];
    const manifest = JSON.parse(bytes.toString('utf8'));
    if (manifest.format !== FORMAT || manifest.version !== VERSION || !Array.isArray(manifest.artifacts)) throw new Error(`Unsupported source package: ${relative}`);
    const ownedOutputs = new Set();
    for (const artifact of manifest.artifacts) {
      if (!['config', 'bundle'].includes(artifact.kind) || !Array.isArray(artifact.outputs) || !artifact.outputs.length || !Array.isArray(artifact.sources) || !artifact.sources.length || !Array.isArray(artifact.entries)) throw new Error(`Invalid artifact in ${relative}`);
      for (const output of artifact.outputs) {
        validateRelativePath(output.path);
        if (!/^[a-f0-9]{64}$/.test(output.hash)) throw new Error(`Invalid output hash in ${relative}`);
        if (ownedOutputs.has(output.path)) throw new Error(`Duplicate artifact output: ${schema}/${output.path}`);
        ownedOutputs.add(output.path);
      }
      const sourceNames = new Set();
      for (const source of artifact.sources) {
        validateRelativePath(source.path);
        if (typeof source.content !== 'string' || sourceNames.has(source.path)) throw new Error(`Invalid or duplicate artifact source in ${relative}`);
        sourceNames.add(source.path);
      }
      for (const entry of artifact.entries) {
        validateRelativePath(entry);
        if (!sourceNames.has(entry) || !/\.(jsx|tsx|js|ts)$/.test(entry)) throw new Error(`Invalid bundle entry: ${entry}`);
      }
      if (artifact.kind === 'config' && (artifact.outputs.length !== 1 || artifact.sources.length !== 1 || artifact.entries.length)) throw new Error(`Invalid config artifact in ${relative}`);
      if (artifact.kind === 'bundle' && !artifact.entries.length) throw new Error(`Bundle without entries in ${relative}`);
      // Older packages treated resource JSON5/YAML as configs. Only entity
      // configs are convertible now; leave those resource outputs untouched.
      if (artifact.kind === 'config' && (!isConfigPath(`${schema}/${artifact.outputs[0].path}`) || !isConfigPath(`${schema}/${artifact.sources[0].path}`))) {
        notices.push(`${relative}: ignored config artifact outside entity config scope: ${artifact.outputs[0].path}`);
        continue;
      }
      // Disabled categories are never imported indirectly through _sources.json.
      if (!artifact.outputs.every(output => selected(`${schema}/${output.path}`)) || !artifact.sources.every(source => selected(`${schema}/${source.path}`))) continue;
      const matching = artifact.outputs.every(output => {
        const downloaded = available.get(`${schema}/${output.path}`);
        return downloaded && fingerprint(downloaded, output.path, artifact.kind === 'config') === output.hash;
      });
      if (!matching) {
        notices.push(`${relative}: stale ${artifact.kind} package; keeping current server output`);
        // A stale entity config package must never replace current server values.
        if (artifact.kind === 'config') {
          const output = `${schema}/${artifact.outputs[0].path}`;
          if (available.has(output)) {
            addConfig(output, parseConfig(available.get(output).toString('utf8'), output));
            consumed.add(output);
          }
        }
        continue;
      }
      if (artifact.kind === 'config') {
        const source = artifact.sources[0];
        const output = `${schema}/${artifact.outputs[0].path}`;
        if (toLogicalPath(source.path) !== artifact.outputs[0].path || !isConfigPath(source.path)) throw new Error(`Invalid config mapping in ${relative}`);
        const value = parseConfig(source.content, source.path);
        if (hashConfig(value) !== artifact.outputs[0].hash) throw new Error(`Packaged config does not match output: ${output}`);
        addConfig(output, value, `${schema}/${source.path}`, source.content);
      } else {
        for (const source of artifact.sources) add(`${schema}/${source.path}`, source.content);
        registerBundle(schema, artifact.sources.map(s => s.path), artifact.entries);
      }
      for (const output of artifact.outputs) {
        const name = `${schema}/${output.path}`;
        consumed.add(name);
        if (artifact.kind === 'bundle') superseded.set(name, available.get(name));
      }
    }
  }
  for (const [relative, bytes] of available) {
    if (consumed.has(relative) || !relative.endsWith('.js.map')) continue;
    const bundlePath = relative.slice(0, -4);
    const bundle = available.get(bundlePath);
    const extracted = bundle && extractLegacy(relative, bytes, bundle);
    if (extracted) {
      add(extracted.path, extracted.content);
      const schema = relative.split('/')[0];
      const sourcePath = extracted.path.slice(schema.length + 1);
      registerBundle(schema, [sourcePath], [sourcePath]);
      consumed.add(relative);
      consumed.add(bundlePath);
      superseded.set(relative, bytes);
      superseded.set(bundlePath, bundle);
      notices.push(`${relative}: restored one self-contained source`);
    } else notices.push(`${relative}: keeping ready JS/map; no complete supported source package`);
  }
  for (const [relative, bytes] of available) {
    if (consumed.has(relative)) continue;
    if (path.posix.basename(relative) === BUILD_METADATA) throw new Error(`Server contains reserved build metadata: ${relative}`);
    if (isConfigPath(relative)) addConfig(toLogicalPath(relative), parseConfig(bytes.toString('utf8'), relative));
    else add(relative, bytes, false);
  }
  for (const [schema, item] of metadata) {
    item.entries = [...new Set(item.entries)].sort();
    item.bundledSources = [...new Set(item.bundledSources)].sort();
    add(`${schema}/${BUILD_METADATA}`, JSON.stringify(item, null, 2) + '\n', false);
  }
  const logicalDesired = new Map();
  for (const [relative, item] of desired) {
    const logical = item.config ? toLogicalPath(relative) : relative;
    if (logicalDesired.has(logical)) throw new Error(`Restored output collision: ${relative} and ${logicalDesired.get(logical)}`);
    logicalDesired.set(logical, relative);
    await assertNoSymlinks(srcDir, relative);
  }
  const server = String(options.server || 'local').replace(/\/+$/, '');
  const stateDir = path.join(rootDir, '.bi-sync');
  const statePath = `${sha256(server)}.json`;
  await assertNoSymlinks(stateDir, statePath);
  const previousBytes = await readMaybe(path.join(stateDir, statePath));
  const previous = previousBytes ? JSON.parse(previousBytes.toString('utf8')) : { version: 1, server, files: {} };
  if (previous.version !== 1 || previous.server !== server || !previous.files || typeof previous.files !== 'object' || Array.isArray(previous.files)) throw new Error('Invalid restore state');
  const next = { version: 1, server, files: { ...previous.files } };
  const writes = [], deletes = [], conflicts = [];
  for (const [relative, item] of desired) {
    const current = await readMaybe(path.join(srcDir, relative));
    const incomingHash = fingerprint(item.bytes, relative, item.config);
    const base = previous.files[relative];
    let equal = current?.equals(item.bytes);
    if (current && item.config && !equal) {
      try { equal = fingerprint(current, relative, true) === incomingHash; } catch (_) { /* invalid local config is a local edit */ }
    }
    if (equal) {
      next.files[relative] = { incomingHash, localHash: sha256(current) };
    } else if (base && incomingHash === base.incomingHash) {
      // Upstream has not changed: preserve local edits, including local deletion.
      next.files[relative] = base;
    } else if (!current || (base && sha256(current) === base.localHash)) {
      if (!current && base) conflicts.push(`${relative} (deleted locally, changed remotely)`);
      else {
        writes.push({ relative, bytes: item.bytes });
        next.files[relative] = { incomingHash, localHash: sha256(item.bytes) };
      }
    } else conflicts.push(`${relative} (local content differs)`);
  }
  for (const [relative, base] of Object.entries(previous.files)) {
    safePath(relative);
    if (options.noRemove || !selected(relative) || desired.has(relative)) continue;
    await assertNoSymlinks(srcDir, relative);
    const current = await readMaybe(path.join(srcDir, relative));
    if (current && sha256(current) !== base.localHash) conflicts.push(`${relative} (edited locally, removed remotely)`);
    else {
      if (current) deletes.push(relative);
      delete next.files[relative];
    }
  }
  for (const [relative, expected] of superseded) {
    if (desired.has(relative) || deletes.includes(relative)) continue;
    await assertNoSymlinks(srcDir, relative);
    const current = await readMaybe(path.join(srcDir, relative));
    if (!current) continue;
    if (current.equals(expected)) deletes.push(relative);
    else conflicts.push(`${relative} (compiled file has local changes)`);
  }
  for (const relative of existingFiles) {
    if (!/\.(tsx|jsx)$/.test(relative) || desired.has(relative) || deletes.includes(relative)) continue;
    const output = relative.replace(/\.(tsx|jsx)$/, '.js');
    if (desired.has(output)) conflicts.push(`${relative} (existing source collides with downloaded ${output})`);
  }
  // Check all file/directory collisions before the first mutation, not midway.
  for (const relative of desired.keys()) {
    const parts = relative.split('/');
    for (let i = 1; i < parts.length; i++) {
      const parent = parts.slice(0, i).join('/');
      if (desired.has(parent)) throw new Error(`File/directory collision: ${parent}`);
      const stat = await fs.stat(path.join(srcDir, parent)).catch(error => { if (error.code === 'ENOENT') return null; throw error; });
      if (stat && !stat.isDirectory()) throw new Error(`File/directory collision: ${parent}`);
    }
  }
  if (conflicts.length) throw new Error(`Restore conflicts; src was not changed:\n${conflicts.map(p => `  ${p}`).join('\n')}`);
  for (const { relative, bytes } of writes) {
    await fs.mkdir(path.dirname(path.join(srcDir, relative)), { recursive: true });
    await fs.writeFile(path.join(srcDir, relative), bytes);
  }
  for (const relative of deletes) await fs.unlink(path.join(srcDir, relative));
  await fs.mkdir(stateDir, { recursive: true });
  const temporaryState = path.join(stateDir, `${statePath}.${process.pid}.tmp`);
  await fs.writeFile(temporaryState, JSON.stringify(next, null, 2) + '\n', { flag: 'wx' });
  await fs.rename(temporaryState, path.join(stateDir, statePath));
  for (const notice of notices) log(notice);
  log(`Restored ${writes.length} files; removed ${deletes.length}; preserved ${desired.size - writes.length}.`);
  return { written: writes.map(w => w.relative), removed: deletes, notices };
}

module.exports = { restore, extractLegacy, safePath, assertNoSymlinks };
