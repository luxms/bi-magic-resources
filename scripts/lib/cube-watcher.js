const { toLogicalPath, canonicalJson } = require('./config-codec');
const CubeManager = require('../managers/CubeManager');

function parseCubePath(relativePath) {
  const parts = toLogicalPath(relativePath).split('/');
  if (parts.length !== 3 || !parts[0] || parts[0] === '.' || parts[0] === '..' || parts[1] !== '.cubes' || !parts[2].endsWith('.json')) return null;
  const id = parts[2].slice(0, -5);
  return id ? { schema: parts[0], id } : null;
}

function serverSnapshot(content) {
  if (!content || typeof content !== 'object' || Array.isArray(content) || typeof content.source_ident !== 'string' || !content.source_ident || typeof content.name !== 'string' || !content.name) {
    throw new Error('Cube watcher requires a source_ident and cube name');
  }
  if (content.dimensions !== undefined && !Array.isArray(content.dimensions)) throw new Error('Cube dimensions must be an array');
  const names = new Set();
  for (const dimension of content.dimensions || []) {
    if (!dimension || typeof dimension.name !== 'string' || !dimension.name || names.has(dimension.name)) throw new Error('Cube dimensions must have unique nonempty names');
    names.add(dimension.name);
  }
  // Use exactly the same composite identifiers and local/global flags as GET APIs.
  const [cube, dimensions] = CubeManager.prototype.toServerFormat(content);
  return { cube, dimensions };
}

function makeCubeRtMessages(event, parsed, current, previous) {
  if (!parsed || !['add', 'change', 'unlink'].includes(event)) return [];
  const before = previous ? serverSnapshot(previous) : null;
  const after = event === 'unlink' ? null : serverSnapshot(current);
  const messages = [];
  const add = (type, payload) => messages.push({type, payload});
  const renamed = before && after && before.cube.id !== after.cube.id;
  const afterDimensions = new Map((after?.dimensions || []).map(dimension => [dimension.id, dimension]));
  for (const dimension of before?.dimensions || []) {
    if (!afterDimensions.has(dimension.id)) add('DELETE_DIMENSIONS', {id: dimension.id});
  }
  if (event === 'unlink' || renamed) add('DELETE_CUBES', {id: before ? before.cube.id : parsed.id});
  if (!after) return messages;
  if (!before || canonicalJson(before.cube) !== canonicalJson(after.cube)) add('ADD_CUBES', after.cube);
  const beforeDimensions = new Map((before?.dimensions || []).map(dimension => [dimension.id, dimension]));
  for (const dimension of after.dimensions) {
    const prior = beforeDimensions.get(dimension.id);
    if (!prior || canonicalJson(prior) !== canonicalJson(dimension)) add('ADD_DIMENSIONS', dimension);
  }
  return messages;
}

function createCubeChangeTracker() {
  const snapshots = new Map();
  const key = relative => toLogicalPath(relative);
  const copy = content => JSON.parse(canonicalJson(content));
  return {
    seed(relative, content) {
      if (!parseCubePath(relative)) return false;
      serverSnapshot(content);
      snapshots.set(key(relative), copy(content));
      return true;
    },
    update(event, relative, content) {
      const parsed = parseCubePath(relative);
      if (!parsed || !['add', 'change', 'unlink'].includes(event)) return null;
      const previous = snapshots.get(key(relative));
      const messages = makeCubeRtMessages(event, parsed, content, previous);
      // A malformed intermediate editor write must not destroy the last valid
      // snapshot; retain it until a subsequent valid change or unlink arrives.
      if (event === 'unlink') snapshots.delete(key(relative));
      else snapshots.set(key(relative), copy(content));
      return {schema: parsed.schema, messages};
    },
  };
}

module.exports = { parseCubePath, makeCubeRtMessages, createCubeChangeTracker };
