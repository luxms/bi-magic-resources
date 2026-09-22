const fs = require('fs').promises;
const path = require('path');
const SourceLocal = require('../../platforms/SourceLocal');
const { parseDashboardPath } = require('../../lib/dashboard-watcher');
const { httpError, sendJson, sendError, readJsonBody, objectBody, route, integerId, mergePartial, selectRows, mutationQueue } = require('./local-api');

function createDashboardMiddlewares({ local = new SourceLocal('src') } = {}) {
  const exclusive = mutationQueue();
  const counters = new Map();

  async function records(schema) {
    const result = [];
    for (const file of await local.dashboards.enumerate(schema)) {
      const parsed = parseDashboardPath(file.replace(/^\//, ''));
      if (!parsed) continue;
      const content = await local.dashboards.getContent(file);
      result.push({ ...parsed, file, raw: content, content: { ...content, id: parsed.id,
        ...(parsed.topic_id === undefined ? {} : { topic_id: parsed.topic_id }),
        ...(parsed.dashboard_id === undefined ? {} : { dashboard_id: parsed.dashboard_id }) } });
    }
    return result;
  }
  function nextId(schema, kind, all) {
    const key = `${schema}:${kind}`;
    const max = Math.max(0, ...all.filter(item => item.kind === kind).map(item => item.id), counters.get(key) || 0);
    const id = max + 1;
    if (!Number.isSafeInteger(id)) throw httpError(409, 'Local ID range exhausted');
    counters.set(key, id);
    return id;
  }
  function getRecord(all, kind, id) {
    const found = all.find(item => item.kind === kind && item.id === id);
    if (!found) throw httpError(404, `${kind} ${id} not found`);
    return found;
  }
  async function newTopic(schema, all, topicId) {
    const id = topicId ?? nextId(schema, 'topic', all);
    const content = await local.dashboards.createTopic({ schemaName: schema, id });
    const record = { kind: 'topic', schema, id, file: `/${schema}/topic.${id}/index.json`, content };
    all.push(record);
    return record;
  }
  async function create(schema, kind, body, all) {
    const id = body.id == null ? nextId(schema, kind, all) : integerId(body.id);
    if (all.some(item => item.kind === kind && item.id === id)) throw httpError(409, `${kind} ${id} already exists`);
    const content = { ...body };
    delete content.id;
    if (content.parent_id != null) {
      content.parent_id = integerId(content.parent_id, 'parent_id');
      getRecord(all, kind, content.parent_id);
    }
    if (kind === 'topic') return local.dashboards.createTopic({ schemaName: schema, id, content });
    if (kind === 'dashboard') {
      let topic = body.topic_id == null ? all.find(item => item.kind === 'topic') : all.find(item => item.kind === 'topic' && item.id === integerId(body.topic_id, 'topic_id'));
      if (!topic) topic = await newTopic(schema, all, body.topic_id == null ? undefined : integerId(body.topic_id, 'topic_id'));
      return local.dashboards.createDashboard({ schemaName: schema, topicId: topic.id, id, content });
    }
    let dashboard = body.dashboard_id == null ? all.find(item => item.kind === 'dashboard') : getRecord(all, 'dashboard', integerId(body.dashboard_id, 'dashboard_id'));
    if (!dashboard) {
      const topic = all.find(item => item.kind === 'topic') || await newTopic(schema, all);
      const dashboardId = nextId(schema, 'dashboard', all);
      const dashboardContent = await local.dashboards.createDashboard({ schemaName: schema, topicId: topic.id, id: dashboardId });
      dashboard = { kind: 'dashboard', id: dashboardId, topic_id: topic.id, content: dashboardContent };
      all.push(dashboard);
    }
    if (content.parent_id != null && getRecord(all, 'dashlet', content.parent_id).dashboard_id !== dashboard.id) throw httpError(400, 'Dashlet parent must belong to the same dashboard');
    return local.dashboards.createDashlet({ schemaName: schema, topicId: dashboard.topic_id, dashboardId: dashboard.id, id, content });
  }
  async function update(schema, kind, id, patch, all) {
    const item = getRecord(all, kind, id);
    const content = { ...mergePartial(item.content, patch), id };
    if (content.parent_id != null) {
      content.parent_id = integerId(content.parent_id, 'parent_id');
      let parent = getRecord(all, kind, content.parent_id);
      const visited = new Set([id]);
      while (parent) {
        if (visited.has(parent.id)) throw httpError(400, 'Parent cycle is not allowed');
        visited.add(parent.id);
        parent = parent.content.parent_id == null ? null : getRecord(all, kind, integerId(parent.content.parent_id));
      }
    }
    let targetFile = item.file;
    let moveDirectory = false;
    if (kind === 'dashboard') {
      content.topic_id = integerId(content.topic_id, 'topic_id');
      getRecord(all, 'topic', content.topic_id);
      targetFile = `/${schema}/topic.${content.topic_id}/dashboard.${id}/index.json`;
      moveDirectory = targetFile !== item.file;
    }
    if (kind === 'dashlet') {
      content.dashboard_id = integerId(content.dashboard_id, 'dashboard_id');
      const dashboard = getRecord(all, 'dashboard', content.dashboard_id);
      if (content.parent_id != null && getRecord(all, 'dashlet', content.parent_id).dashboard_id !== dashboard.id) throw httpError(400, 'Dashlet parent must belong to the same dashboard');
      if (dashboard.id !== item.dashboard_id && all.some(child => child.kind === 'dashlet' && child.content.parent_id === id)) throw httpError(409, 'Move child dashlets before moving their parent to another dashboard');
      targetFile = `/${schema}/topic.${dashboard.topic_id}/dashboard.${dashboard.id}/${id}.json`;
    }
    const stored = { ...content };
    if (!Object.prototype.hasOwnProperty.call(item.raw, 'id')) delete stored.id;
    if (targetFile === item.file) await local.dashboards.updateContent(item.file, stored);
    else {
      // Move the original file/directory, retaining JSON5/YAML filenames for every child.
      if (await local.checkFileExists(targetFile)) throw httpError(409, 'Destination config already exists');
      const fromFile = await local._resolve(item.file);
      const targetBase = local._getFullPath(targetFile);
      const from = moveDirectory ? path.dirname(fromFile) : fromFile;
      const to = moveDirectory ? path.dirname(targetBase) : targetBase.replace(/\.json$/, path.extname(fromFile));
      await local._assertNoSymlink(to);
      try { await fs.lstat(to); throw httpError(409, 'Destination already exists'); }
      catch (error) { if (error.code !== 'ENOENT') throw error; }
      await local.dashboards.updateContent(item.file, stored);
      await fs.mkdir(path.dirname(to), { recursive: true });
      await fs.rename(from, to);
    }
    return content;
  }
  async function remove(kind, id, all) {
    const item = getRecord(all, kind, id);
    const ids = new Set([id]);
    if (kind === 'topic' || kind === 'dashlet') {
      let changed;
      do {
        changed = false;
        for (const candidate of all) if (candidate.kind === kind && ids.has(candidate.content.parent_id) && !ids.has(candidate.id)) {
          ids.add(candidate.id); changed = true;
        }
      } while (changed);
    }
    const dashboards = new Set(kind === 'topic' ? all.filter(x => x.kind === 'dashboard' && ids.has(x.topic_id)).map(x => x.id) : kind === 'dashboard' ? [id] : []);
    const doomed = all.filter(candidate => kind === 'topic'
      ? candidate.kind === 'topic' && ids.has(candidate.id) || candidate.kind === 'dashboard' && dashboards.has(candidate.id) || candidate.kind === 'dashlet' && dashboards.has(candidate.dashboard_id)
      : kind === 'dashboard' ? candidate.kind === 'dashboard' && candidate.id === id || candidate.kind === 'dashlet' && candidate.dashboard_id === id
        : candidate.kind === 'dashlet' && ids.has(candidate.id));
    doomed.sort((a, b) => b.file.split('/').length - a.file.split('/').length);
    for (const candidate of doomed) await local.dashboards.deleteContent(candidate.file);
    // Local.deleteFile prunes empty directories; retain the atlas as an empty local table.
    await fs.mkdir(local._getFullPath('/' + item.schema), { recursive: true });
    return item.content;
  }
  function handler(kind) {
    return async (req, res, next) => {
      try {
        const schema = req.params.schema_name;
        const { resource, nextId: reserveId } = route(req);
        if (!(await local.getSchemaNames()).includes(schema)) {
          if ((req.method === 'GET' || req.method === 'HEAD') && !reserveId) return next();
          throw httpError(404, `Schema is not available locally: ${schema}`);
        }
        const execute = async () => {
          const all = await records(schema);
          if (req.method === 'GET') {
            if (reserveId) return sendJson(res, { id: nextId(schema, kind, all) });
            const result = !resource || resource.startsWith('.')
              ? selectRows(all.filter(item => item.kind === kind).map(item => item.content), resource)
              : getRecord(all, kind, integerId(resource)).content;
            return sendJson(res, result);
          }
          if (!['POST', 'PUT', 'DELETE'].includes(req.method)) throw httpError(405, `Method ${req.method} is not supported`);
          if (req.method === 'DELETE') return sendJson(res, await remove(kind, integerId(resource), all));
          const body = await readJsonBody(req);
          if (Array.isArray(body)) {
            const results = [];
            for (const value of body) {
              objectBody(value);
              const current = await records(schema);
              results.push(req.method === 'POST' ? await create(schema, kind, value, current) : await update(schema, kind, integerId(value.id), value, current));
            }
            return sendJson(res, results);
          }
          objectBody(body);
          return sendJson(res, req.method === 'POST' ? await create(schema, kind, body, all) : await update(schema, kind, integerId(resource || body.id), body, all));
        };
        // Reserve IDs and mutations are serialized per atlas; ordinary reads stay independent.
        if (req.method !== 'GET' || reserveId) return await exclusive(schema, execute);
        return await execute();
      } catch (error) { sendError(res, error); }
    };
  }
  return { topicMiddleware: handler('topic'), dashboardMiddleware: handler('dashboard'), dashletMiddleware: handler('dashlet') };
}
module.exports = { ...createDashboardMiddlewares(), createDashboardMiddlewares };
