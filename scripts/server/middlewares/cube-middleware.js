const fs = require('fs').promises;
const path = require('path');
const SourceLocal = require('../../platforms/SourceLocal');
const Server = require('../../platforms/Server');
const auth = require('../../lib/auth');
const lpe = require('../../lib/lpe');
const { httpError, sendJson, sendError, readJsonBody, objectBody, route, mergePartial, selectRows, mutationQueue } = require('./local-api');

function identifier(value, name) {
  if (typeof value !== 'string' || !value || /[\/\\\0]/.test(value) || value === '.' || value === '..') throw httpError(400, `Invalid ${name}`);
  return value;
}
function stripDimension(value) {
  const result = { ...value };
  for (const key of ['id', 'cube_id', 'cube_name', 'source_ident', 'is_global', 'is_cube_global']) delete result[key];
  identifier(result.name, 'dimension name');
  return result;
}
function localCube(value) {
  const result = { ...value };
  for (const key of ['id', 'is_source_global', 'is_global', '_has_model']) delete result[key];
  identifier(result.source_ident, 'source_ident');
  identifier(result.name, 'cube name');
  if (!Array.isArray(result.dimensions)) throw httpError(400, 'Cube dimensions must be an array');
  result.dimensions = result.dimensions.map(dimension => stripDimension(objectBody(dimension)));
  if (new Set(result.dimensions.map(item => item.name)).size !== result.dimensions.length) throw httpError(409, 'Duplicate dimension name');
  return result;
}

function createCubeMiddlewares({ local = new SourceLocal('src'), server = new Server() } = {}) {
  const exclusive = mutationQueue();
  async function records(schema) {
    const result = [];
    for (const file of await local.cubes.enumerate(schema)) {
      const content = await local.cubes.getContent(file);
      const [cube, dimensions] = local.cubes.toServerFormat(content);
      result.push({ file, content, cube, dimensions });
    }
    return result;
  }
  function findCube(all, id) {
    const item = all.find(record => record.cube.id === id);
    if (!item) throw httpError(404, `Cube not found: ${id}`);
    return item;
  }
  async function saveCube(schema, all, body, id) {
    const old = id === undefined ? null : findCube(all, id);
    const content = localCube(old ? mergePartial(old.content, body) : { dimensions: [], ...body });
    const nextId = `${content.source_ident}.${content.name}`;
    if (all.some(item => item.cube.id === nextId && item !== old)) throw httpError(409, `Cube already exists: ${nextId}`);
    const targetFile = local.cubes.createPath(schema, nextId);
    if (!old) {
      const created = await local.cubes.createContent(targetFile, content);
      return local.cubes.toServerFormat(created)[0];
    }
    if (old.cube.id === nextId) await local.cubes.updateContent(old.file, content);
    else {
      const from = await local._resolve(old.file);
      const to = local._getFullPath(targetFile).replace(/\.json$/, path.extname(from));
      await local._assertNoSymlink(to);
      if (await local.checkFileExists(targetFile)) throw httpError(409, `Cube path already exists: ${nextId}`);
      await local.cubes.updateContent(old.file, content);
      await fs.mkdir(path.dirname(to), { recursive: true });
      await fs.rename(from, to);
    }
    return local.cubes.toServerFormat(content)[0];
  }
  async function hasLocalSchema(req) {
    const available = (await local.getSchemaNames()).includes(req.params.schema_name);
    if (!available && ((req.method !== 'GET' && req.method !== 'HEAD') || route(req).nextId)) throw httpError(404, `Schema is not available locally: ${req.params.schema_name}`);
    return available;
  }
  async function cubeMiddleware(req, res, next) {
    try {
      if (!await hasLocalSchema(req)) return next();
      const schema = req.params.schema_name;
      const { resource } = route(req);
      const execute = async () => {
        const all = await records(schema);
        if (req.method === 'GET') return sendJson(res, !resource || resource.startsWith('.') ? selectRows(all.map(item => item.cube), resource) : findCube(all, resource).cube);
        if (req.method === 'DELETE') {
          const item = findCube(all, resource);
          await local.cubes.deleteContent(item.file);
          await fs.mkdir(local._getFullPath('/' + schema), { recursive: true });
          return sendJson(res, item.cube);
        }
        if (!['POST', 'PUT'].includes(req.method)) throw httpError(405, `Method ${req.method} is not supported`);
        const body = await readJsonBody(req);
        const values = Array.isArray(body) ? body : [body];
        const results = [];
        for (const value of values) {
          objectBody(value);
          const current = await records(schema);
          const id = resource || value.id;
          if (req.method === 'PUT' && (typeof id !== 'string' || !id)) throw httpError(400, 'Cube ID is required for update');
          results.push(await saveCube(schema, current, value, req.method === 'POST' ? undefined : id));
        }
        return sendJson(res, Array.isArray(body) ? results : results[0]);
      };
      if (req.method === 'GET') return await execute();
      return await exclusive(schema, execute);
    } catch (error) { sendError(res, error); }
  }
  async function dimensionMiddleware(req, res, next) {
    try {
      if (!await hasLocalSchema(req)) return next();
      const schema = req.params.schema_name;
      const { resource } = route(req);
      const execute = async () => {
        const all = await records(schema);
        const dimensions = all.flatMap(item => item.dimensions);
        if (req.method === 'GET') {
          if (!resource || resource.startsWith('.')) return sendJson(res, selectRows(dimensions, resource));
          const found = dimensions.find(item => item.id === resource);
          if (!found) throw httpError(404, `Dimension not found: ${resource}`);
          return sendJson(res, found);
        }
        if (!['POST', 'PUT', 'DELETE'].includes(req.method)) throw httpError(405, `Method ${req.method} is not supported`);
        const body = req.method === 'DELETE' ? { id: resource } : await readJsonBody(req);
        const values = Array.isArray(body) ? body : [body];
        // Validate and plan all dimensional edits before changing any cube file.
        const pending = new Map();
        const results = [];
        for (const raw of values) {
          const value = objectBody(raw);
          let owner, original;
          if (req.method === 'POST') {
            const cubeId = value.cube_id || `${identifier(value.source_ident, 'source_ident')}.${identifier(value.cube_name, 'cube_name')}`;
            owner = findCube(all, cubeId);
          } else {
            const id = resource && !resource.startsWith('.') ? resource : value.id;
            owner = all.find(item => item.dimensions.some(dimension => dimension.id === id));
            if (!owner) throw httpError(404, `Dimension not found: ${id}`);
            original = owner.dimensions.find(dimension => dimension.id === id);
          }
          const content = pending.get(owner.file) || { ...owner.content, dimensions: [...(owner.content.dimensions || [])] };
          if (value.source_ident !== undefined && value.source_ident !== owner.content.source_ident || value.cube_name !== undefined && value.cube_name !== owner.content.name || value.cube_id !== undefined && value.cube_id !== owner.cube.id) throw httpError(400, 'Moving a dimension to another cube is not supported');
          if (req.method === 'DELETE') {
            content.dimensions = content.dimensions.filter(dimension => dimension.name !== original.name);
            results.push(original);
          } else {
            const index = original ? content.dimensions.findIndex(dimension => dimension.name === original.name) : -1;
            if (original && index < 0) throw httpError(409, `Dimension has already been changed: ${original.id}`);
            const dimension = stripDimension(original ? mergePartial(content.dimensions[index], value) : value);
            if (content.dimensions.some((existing, i) => existing.name === dimension.name && i !== index)) throw httpError(409, `Dimension already exists: ${dimension.name}`);
            if (index < 0) content.dimensions.push(dimension);
            else content.dimensions[index] = dimension;
            results.push(local.cubes.toServerFormat({ ...content, dimensions: [dimension] })[1][0]);
          }
          pending.set(owner.file, content);
        }
        for (const [file, content] of pending) await local.cubes.updateContent(file, content);
        return sendJson(res, Array.isArray(body) ? results : results[0]);
      };
      if (req.method === 'GET') return await execute();
      return await exclusive(schema, execute);
    } catch (error) { sendError(res, error); }
  }
  // Data inspection still queries the configured server; entity CRUD above never calls it.
  async function dataMiddleware(req, res, next) {
    try {
      // This POST reads data and must continue to the proxy for nonlocal atlases.
      if (!(await local.getSchemaNames()).includes(req.params.schema_name)) return next();
      if (req.url.endsWith('DatePickerMaxMin')) throw httpError(501, 'DatePickerMaxMin is unavailable locally');
      if (req.method !== 'POST') throw httpError(405, `Method ${req.method} is not supported`);
      const body = objectBody(await readJsonBody(req));
      const schema = req.params.schema_name;
      const item = findCube(await records(schema), body.with);
      const localSources = await server.cubes.getDataSources(schema);
      const globalSources = await server.cubes.getDataSources('adm');
      const source = [...localSources, ...globalSources].find(candidate => candidate.ident === item.content.source_ident);
      if (!source) throw httpError(404, `Data source not found: ${item.content.source_ident}`);
      const sql = lpe.generate_koob_sql(body, { _dimensions: item.dimensions, _cube: item.cube,
        _user_id: auth.USER_ID, _user_info: {}, _target_database: source.config._connection.flavor });
      const data = await server.cubes.getDataSourceData(schema, sql, item.content.source_ident, localSources.includes(source));
      const rows = data.rows.map(row => data.columns.reduce((result, column, i) => ({ ...result, [column.name]: row[i] }), {}));
      res.setHeader('Content-Type', 'application/x-ndjson;charset=utf-8');
      res.end(rows.map(JSON.stringify).join('\n'));
    } catch (error) { sendError(res, error); }
  }
  return { cubeMiddleware, dimensionMiddleware, dataMiddleware };
}
module.exports = { ...createCubeMiddlewares(), createCubeMiddlewares };
