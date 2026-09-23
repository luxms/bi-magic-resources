const path = require('path');
const fs = require('fs');
const { createRequire } = require('module');
const { validateRelativePath } = require('./artifact-manifest');

// css-loader embeds a JSON sourcemap as the fourth argument of its module
// array. Read only that JSON; never execute downloaded JavaScript.
function embeddedStyleMaps(content) {
  const maps = [];
  const start = /,\s*(\{"version"\s*:\s*3\s*,)/g;
  let match;
  while ((match = start.exec(content))) {
    const offset = match.index + match[0].indexOf('{');
    let depth = 0, quoted = false, escaped = false;
    for (let i = offset; i < content.length; i++) {
      const c = content[i];
      if (quoted) {
        if (escaped) escaped = false;
        else if (c === '\\') escaped = true;
        else if (c === '"') quoted = false;
      } else if (c === '"') quoted = true;
      else if (c === '{') depth++;
      else if (c === '}' && --depth === 0) {
        try { maps.push(JSON.parse(content.slice(offset, i + 1))); } catch (_) { /* unsupported loader output */ }
        break;
      }
    }
  }
  return maps;
}

function extractSources(relative, mapBytes, bundleBytes, options = {}) {
  try {
    const map = JSON.parse(mapBytes.toString('utf8'));
    const bundle = relative.slice(0, -4);
    const schema = relative.split('/')[0];
    if (map.sourceRoot || map.version !== 3 || !Array.isArray(map.sources) || !Array.isArray(map.sourcesContent)) return null;
    if (![bundle, bundle.slice(schema.length + 1), path.posix.basename(bundle)].includes(map.file)) return null;
    const reference = bundleBytes.toString('utf8').match(/\/\/[#@]\s*sourceMappingURL=([^\s]+)\s*$/);
    if (!reference || reference[1] !== path.posix.basename(relative)) return null;
    const sources = new Map(), required = new Set();
    function sourcePath(url) {
      if (typeof url !== 'string') throw new Error('Invalid source URL');
      // Runtime and third-party modules are supplied by the build toolchain.
      if (/(?:^|\/)node_modules\//.test(url)) {
        const packagePath = url.split('node_modules/').pop();
        const parts = packagePath.split('/');
        const packageName = parts[0].startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
        if (options.rootDir) {
          const resolve = createRequire(path.join(options.rootDir, 'package.json')).resolve;
          // Bundled files may be private paths, and some packages expose only
          // subpaths. Package installation does not require a public root export.
          const installed = resolve.paths(packageName)?.some(directory => fs.existsSync(path.join(directory, packageName, 'package.json')));
          if (!installed) resolve(packageName);
        }
        return null;
      }
      if (!url.includes('/src/') && (/\/webpack\//.test(url) || /\/external /.test(url))) return null;
      if (url.includes('!')) throw new Error('Unsupported loader path');
      let name = url.replace(/^webpack:\/\/.*?\/(?:\.\/)?(?=src\/)/, '');
      if (name.startsWith('./src/')) name = name.slice(2);
      if (name.startsWith('src/')) name = name.slice(4);
      else {
        // Older standalone vizel builds used ./index.tsx, with no atlas prefix.
        const standalone = url.match(/^webpack:\/\/.*?\/\.\/([^?#]+)$/);
        if (!standalone) return null;
        name = `${path.posix.dirname(bundle)}/${standalone[1]}`;
      }
      name = name.replace(/\?[a-f0-9]+$/, '');
      validateRelativePath(name);
      if (!name.startsWith(`${schema}/`)) throw new Error('Source belongs to another atlas');
      return name;
    }
    function collect(input, stylesOnly = false) {
      if (input.version !== 3 || input.sourceRoot || !Array.isArray(input.sources) || !Array.isArray(input.sourcesContent)) throw new Error('Incomplete map');
      input.sources.forEach((url, index) => {
        const name = sourcePath(url);
        if (!name) return;
        if (!stylesOnly && options.available?.has(name) && !/\.(?:tsx?|jsx?|s[ac]ss|css)$/.test(name)) return;
        if (!/\.(?:tsx?|jsx?|s[ac]ss|css)$/.test(name) || (stylesOnly && !/\.(?:s[ac]ss|css)$/.test(name))) throw new Error('Unsupported source type');
        required.add(name);
        const content = input.sourcesContent[index];
        if (typeof content !== 'string') return;
        const style = /\.(?:s[ac]ss|css)$/.test(name);
        if (style && /___CSS_LOADER_|style-loader\/dist\/runtime/.test(content)) {
          for (const nested of embeddedStyleMaps(content)) collect(nested, true);
          return;
        }
        if (/__webpack_require__|__WEBPACK_EXTERNAL_MODULE__/.test(content)) throw new Error('Transformed source');
        if (sources.has(name) && sources.get(name) !== content) throw new Error(`Conflicting source versions: ${name}`);
        sources.set(name, content);
      });
    }
    collect(map);
    if ([...required].some(name => !sources.has(name))) return null;
    // A map can omit an imported project module entirely. Do not replace a
    // working bundle with sources that cannot resolve their local imports.
    for (const [name, content] of sources) {
      if (/\.s[ac]ss$/.test(name)) {
        const styles = /@(use|forward|import)\s+['"]([^'"]+)['"]/g;
        let style;
        while ((style = styles.exec(content))) {
          if (/^(?:sass:|https?:|url\()/.test(style[2]) || (style[1] === 'import' && style[2].endsWith('.css'))) continue;
          const dependency = path.posix.normalize(path.posix.join(path.posix.dirname(name), style[2]));
          validateRelativePath(dependency);
          if (!dependency.startsWith(`${schema}/`)) return null;
          const partial = path.posix.join(path.posix.dirname(dependency), '_' + path.posix.basename(dependency));
          const candidates = [dependency, partial, ...['.scss', '.sass', '/index.scss', '/_index.scss', '/index.sass', '/_index.sass'].flatMap(ext => [dependency + ext, partial + ext])];
          if (!candidates.some(candidate => sources.has(candidate) || options.available?.has(candidate))) return null;
        }
        continue;
      }
      if (!/\.[jt]sx?$/.test(name)) continue;
      const imports = /(?:\b(?:import|export)\s+(?:[^;'"\n]*?\s+from\s*)?|\b(?:require|import)\s*\(\s*)['"](\.[^'"]+)['"]/g;
      let imported;
      while ((imported = imports.exec(content))) {
        const dependency = path.posix.normalize(path.posix.join(path.posix.dirname(name), imported[1]));
        validateRelativePath(dependency);
        if (!dependency.startsWith(`${schema}/`)) return null;
        const candidates = [dependency, ...['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx', '/index.js', '/index.jsx'].map(ext => dependency + ext)];
        // TypeScript also permits importing ./module.js when the original is .ts.
        if (dependency.endsWith('.js')) candidates.push(dependency.slice(0, -3) + '.ts', dependency.slice(0, -3) + '.tsx');
        if (!candidates.some(candidate => sources.has(candidate) || options.available?.has(candidate))) return null;
      }
    }
    const entries = [...sources.keys()].filter(name => name.replace(/\.(?:tsx?|jsx?)$/, '.js') === bundle);
    if (entries.length !== 1) return null;
    return { sources: [...sources].map(([path, content]) => ({ path, content })), entries };
  } catch (_) { return null; }
}
module.exports = { extractSources };
