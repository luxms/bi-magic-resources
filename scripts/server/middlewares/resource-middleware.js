const fs = require('fs').promises;
const path = require('path');
const mime = require('mime-types');
const {mutationQueue} = require('./local-api');
const {assertNoSymlinks} = require('../../lib/restore');
const {validateRelativePath, BUILD_METADATA} = require('../../lib/artifact-manifest');

const failure = (status, message) => Object.assign(new Error(message), {status});
async function body(req) {
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string') return Buffer.from(req.body);
  const parts = [];
  let size = 0;
  for await (const part of req) {
    size += part.length;
    if (size > 32 * 1024 * 1024) throw failure(413, 'Resource exceeds 32 MiB');
    parts.push(Buffer.from(part));
  }
  return Buffer.concat(parts);
}
function resourceName(value) {
  validateRelativePath(value);
  if (/^(?:topic\.\d+|\.cubes)(?:\/|$)/.test(value)) throw failure(400, 'Configuration files use the configuration API');
  return value;
}
const localPath = (schema, name) => '/' + [schema, ...name.split('/')].map(encodeURIComponent).join('/');

function createResourceMiddleware({local, getAssets, allocateId, onChange = () => {}}) {
  let nextId = 1;
  const exclusive = mutationQueue();
  const projectRoot = path.dirname(local.BASE_DIR);
  const metadataRelative = '.bi-sync/resource-metadata.json';
  const storePath = path.join(projectRoot, metadataRelative);
  let persisted;
  async function hydrate() {
    if (!persisted) {
      await assertNoSymlinks(projectRoot, metadataRelative);
      try {
        const saved = JSON.parse(await fs.readFile(storePath, 'utf8'));
        if (saved.version !== 1 || !saved.resources || typeof saved.resources !== 'object' || Array.isArray(saved.resources)) throw new Error('Invalid local resource metadata');
        persisted = saved.resources;
      } catch (error) { if (error.code !== 'ENOENT') throw error; persisted = {}; }
    }
    for (const [key, resource] of Object.entries(getAssets())) {
      if (Object.prototype.hasOwnProperty.call(persisted, key)) {
        const {id, alt_id, hash, content_length, updated} = resource;
        Object.assign(resource, persisted[key], {id, alt_id, hash, content_length, updated});
      }
    }
  }
  async function notify(type, schema, resource) {
    const key = `${schema}/${resource.alt_id}`;
    if (type === 'DELETE_RESOURCES') delete persisted[key];
    else {
      const {id, alt_id, hash, content_length, ...metadata} = resource;
      persisted[key] = metadata;
    }
    await assertNoSymlinks(projectRoot, metadataRelative);
    await fs.mkdir(path.dirname(storePath), {recursive: true});
    const temporary = storePath + '.tmp';
    await assertNoSymlinks(projectRoot, metadataRelative + '.tmp');
    await fs.writeFile(temporary, JSON.stringify({version: 1, resources: persisted}, null, 2));
    await fs.rename(temporary, storePath);
    await onChange({type, schema, resource});
  }
  const newId = () => allocateId ? allocateId() : (nextId = Math.max(nextId, ...Object.values(getAssets()).map(a => Number(a.id) + 1 || 1)), nextId++);
  async function generated(schema, name) {
    const files = await local.getFiles(schema);
    const metadataPath = path.join(local.BASE_DIR, schema, BUILD_METADATA);
    await local._assertNoSymlink(metadataPath);
    let meta = {entries: [], bundledSources: []};
    try { meta = JSON.parse(await fs.readFile(metadataPath, 'utf8')); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    const entries = [...meta.entries, ...files.filter(f => /\.[jt]sx$/.test(f) && !meta.bundledSources.includes(f))];
    return entries.some(entry => {
      const output = entry.replace(/\.[^.]+$/, '.js');
      return name === output || name === output + '.map';
    });
  }
  async function handle(req, res, next) {
    const rawPath = (req.originalUrl || req.url).split('?')[0];
    const metaRoute = /^\/api\/db\/([^/]+)\.resources(?:\/(.*))?$/.exec(rawPath);
    const contentRoute = /^\/srv\/resources\/([^/]+)\/(.*)$/.exec(rawPath);
    if (!metaRoute && !contentRoute) return next();
    const send = (status, data) => {
      res.statusCode = status;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    };
    try {
      const route = metaRoute || contentRoute;
      const schema = decodeURIComponent(route[1]);
      validateRelativePath(schema);
      if (schema.includes('/')) throw failure(400, 'Invalid schema');
      const selected = (await local.getSchemaNames()).includes(schema);
      if (!selected) {
        if (req.method === 'GET' || req.method === 'HEAD') return next();
        throw failure(403, 'Writes are permitted only to selected local schemas');
      }
      await hydrate();
      const assets = getAssets();
      const records = () => Object.entries(assets).filter(([key, value]) => key.startsWith(schema + '/') && !/^(?:topic\.\d+|\.cubes)(?:\/|$)/.test(value.alt_id));
      const token = decodeURIComponent(route[2] || '').replace(/\/$/, '');
      let found = /^\d+$/.test(token) ? records().find(([, value]) => String(value.id) === token) : records().find(([, value]) => value.alt_id === token);
      const jsonBody = async () => {
        if (req.body && !Buffer.isBuffer(req.body) && typeof req.body === 'object') return req.body;
        try { return JSON.parse((await body(req)).toString('utf8')); }
        catch (error) { if (error.status) throw error; throw failure(400, 'Invalid JSON metadata'); }
      };
      if (metaRoute && req.method === 'GET') {
        if (!token) return send(200, records().map(([, value]) => value));
        const filter = /^\.filter\(alt_id='(.*)'\)$/.exec(token);
        if (filter) return send(200, records().filter(([, value]) => value.alt_id === filter[1].replace(/''/g, "'")).map(([, value]) => value));
        if (!found) throw failure(404, 'Resource not found');
        return send(200, found[1]);
      }
      if (metaRoute && req.method === 'POST' && !token) {
        const data = await jsonBody();
        if (!data || Array.isArray(data) || typeof data !== 'object') throw failure(400, 'Metadata must be a JSON object');
        const name = resourceName(data.alt_id);
        const target = localPath(schema, name);
        if (assets[`${schema}/${name}`] || await local.checkFileExists(target) || await generated(schema, name)) throw failure(409, 'Resource already exists');
        await local.writeFile(target, Buffer.alloc(0));
        const now = new Date().toISOString();
        const record = {...data, id: newId(), alt_id: name, content_length: 0, content_type: data.content_type || mime.lookup(name) || 'application/octet-stream', created: now, updated: now};
        assets[`${schema}/${name}`] = record;
        await notify('ADD_RESOURCES', schema, record);
        return send(200, record);
      }
      const name = resourceName(found ? found[1].alt_id : token);
      const target = localPath(schema, name);
      const isGenerated = await generated(schema, name);
      if (contentRoute && (req.method === 'GET' || req.method === 'HEAD')) {
        if (isGenerated) {
          req.url = '/srv/resources/' + [schema, ...name.split('/')].map(encodeURIComponent).join('/');
          return next();
        }
        const bytes = await local.readFile(target);
        if (bytes === null) throw failure(404, 'Resource not found');
        res.setHeader('Content-Type', found?.[1].content_type || mime.lookup(name) || 'application/octet-stream');
        res.setHeader('Content-Length', bytes.length);
        return res.end(req.method === 'HEAD' ? undefined : bytes);
      }
      if (isGenerated && !(metaRoute && req.method === 'PUT')) throw failure(409, 'Generated resource: edit its local source file instead');
      if (req.method === 'DELETE') {
        if (!found && !await local.checkFileExists(target)) throw failure(404, 'Resource not found');
        await local.deleteFile(target);
        delete assets[`${schema}/${name}`];
        await notify('DELETE_RESOURCES', schema, found?.[1] || {alt_id: name});
        return send(200, found?.[1] || {alt_id: name});
      }
      if (metaRoute && req.method === 'PUT') {
        if (!found) throw failure(404, 'Resource not found');
        const data = await jsonBody();
        if (!data || Array.isArray(data) || typeof data !== 'object') throw failure(400, 'Metadata must be a JSON object');
        const renamed = resourceName(data.alt_id === undefined ? name : data.alt_id);
        if (renamed !== name) {
          if (isGenerated) throw failure(409, 'Generated resource: rename its local source file instead');
          if (assets[`${schema}/${renamed}`] || await local.checkFileExists(localPath(schema, renamed)) || await generated(schema, renamed)) throw failure(409, 'Resource already exists');
          const bytes = await local.readFile(target);
          if (bytes === null) throw failure(404, 'Resource not found');
          await local.writeFile(localPath(schema, renamed), bytes);
          await local.deleteFile(target);
          delete assets[`${schema}/${name}`];
          delete persisted[`${schema}/${name}`];
        }
        const record = {...found[1], ...data, id: found[1].id, alt_id: renamed, updated: new Date().toISOString()};
        assets[`${schema}/${renamed}`] = record;
        await notify('ADD_RESOURCES', schema, record);
        return send(200, record);
      }
      if (contentRoute && req.method === 'PUT') {
        if (/^multipart\//i.test(req.headers['content-type'] || '')) throw failure(415, 'Send raw resource bytes, not multipart');
        if (/^\d+$/.test(token) && !found) throw failure(404, 'Resource id not found');
        const bytes = await body(req);
        await local.writeFile(target, bytes);
        const now = new Date().toISOString();
        const record = {...(found?.[1] || {id: newId(), alt_id: name, created: now}), content_length: bytes.length, updated: now};
        record.content_type = req.headers['content-type'] || record.content_type || mime.lookup(name) || 'application/octet-stream';
        assets[`${schema}/${name}`] = record;
        await notify('ADD_RESOURCES', schema, record);
        return send(200, record);
      }
      throw failure(405, 'Unsupported local resource operation');
    } catch (error) {
      send(error.status || (error instanceof URIError || /Unsafe|Invalid|Symlink|symlink/.test(error.message) ? 400 : 500), {error: error.message});
    }
  }
  return (req, res, next) => exclusive('resources', () => handle(req, res, next));
}
module.exports = {createResourceMiddleware};
