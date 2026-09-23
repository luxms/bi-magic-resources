const fs = require('fs').promises;
const path = require('path');
const { isConfigPath, toLogicalPath, parseConfig, stringifyConfig } = require('./config-codec');
const { SOURCE_PACKAGE, BUILD_METADATA, sha256, hashConfig } = require('./artifact-manifest');

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

const { extractSources } = require('./sourcemap-sources');

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
  function addConfig(logical, content) {
    const physical = logicalConfigs.get(logical) || logical;
    // Preserve the existing project's filename and format convention.
    const text = stringifyConfig(content, physical);
    add(physical, text, true);
  }
  function registerBundle(schema, sources, entries) {
    const item = metadata.get(schema) || { version: 1, entries: [], bundledSources: [] };
    item.entries.push(...entries);
    item.bundledSources.push(...sources);
    metadata.set(schema, item);
  }
  // Legacy source packages are intentionally ignored, even if stale or malformed.
  for (const relative of available.keys()) {
    if (path.posix.basename(relative) === SOURCE_PACKAGE) consumed.add(relative);
  }
  for (const [relative, bytes] of available) {
    if (consumed.has(relative) || !relative.endsWith('.js.map')) continue;
    const bundlePath = relative.slice(0, -4);
    const bundle = available.get(bundlePath);
    const extracted = bundle && extractSources(relative, bytes, bundle, { rootDir, available });
    if (extracted) {
      for (const source of extracted.sources) add(source.path, source.content);
      const schema = relative.split('/')[0];
      registerBundle(schema, extracted.sources.map(s => s.path.slice(schema.length + 1)), extracted.entries.map(s => s.slice(schema.length + 1)));
      consumed.add(relative);
      consumed.add(bundlePath);
      superseded.set(relative, bytes);
      superseded.set(bundlePath, bundle);
      notices.push(`${relative}: restored sources from sourcemap`);
    } else notices.push(`${relative}: keeping ready JS/map; no complete supported sourcemap`);
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
    if (!/\.(tsx|jsx|ts)$/.test(relative) || desired.has(relative) || deletes.includes(relative)) continue;
    const output = relative.replace(/\.(tsx|jsx|ts)$/, '.js');
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

module.exports = { restore, safePath, assertNoSymlinks };
