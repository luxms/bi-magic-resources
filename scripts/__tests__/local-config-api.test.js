const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const SourceLocal = require('../platforms/SourceLocal');
const { Readable } = require('node:stream');
const { createDashboardMiddlewares } = require('../server/middlewares/dashboard-middleware');
const { createCubeMiddlewares } = require('../server/middlewares/cube-middleware');

async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'local-config-api-'));
  await fs.mkdir(path.join(root, 'ds_clowns'));
  const local = new SourceLocal(root);
  let upstreamCalls = 0;
  const forbidden = new Proxy({}, { get() { return () => { upstreamCalls++; throw new Error('Unexpected remote call'); }; } });
  const dashboards = createDashboardMiddlewares({ local });
  const cubes = createCubeMiddlewares({ local, server: { cubes: forbidden, dashboards: forbidden } });
  const routes = { dashboard_topics: dashboards.topicMiddleware, dashboards: dashboards.dashboardMiddleware,
    dashlets: dashboards.dashletMiddleware, cubes: cubes.cubeMiddleware, dimensions: cubes.dimensionMiddleware };
  let fallthrough = 0;
  const server = http.createServer((req, res) => {
    const match = req.url.match(/^\/api\/db\/(\w+)\.(dashboard_topics|dashboards|dashlets|cubes|dimensions)(?=\/|\?|$)(.*)$/);
    if (!match) { res.statusCode = 404; res.end(); return; }
    req.params = { schema_name: match[1] };
    req.url = match[3] || '/';
    routes[match[2]](req, res, () => { fallthrough++; res.statusCode = 418; res.end('upstream'); });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => { await new Promise(resolve => server.close(resolve)); await fs.rm(root, { recursive: true, force: true }); });
  const request = (table, method = 'GET', body, suffix = '', schema = 'ds_clowns', split = true) => new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port: server.address().port, path: `/api/db/${schema}.${table}/${suffix}`, method,
      headers: body === undefined ? {} : { 'Content-Type': 'application/json' } }, res => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString();
        let json;
        try { json = JSON.parse(text); } catch (_) { json = text; }
        resolve({ status: res.statusCode, body: json });
      });
    });
    req.on('error', reject);
    if (body === undefined) req.end();
    else {
      const bytes = Buffer.from(typeof body === 'string' ? body : JSON.stringify(body));
      if (split && bytes.length > 1) {
        const midpoint = Math.floor(bytes.length / 2);
        req.write(bytes.subarray(0, midpoint));
        setImmediate(() => req.end(bytes.subarray(midpoint)));
      } else req.end(bytes);
    }
  });
  const write = async (relative, content) => { const file = path.join(root, relative); await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, content); };
  return { local, root, request, write, upstreamCalls: () => upstreamCalls, fallthrough: () => fallthrough };
}

test('empty lists, locally reserved IDs, chunked creates and partial config edits never contact upstream', async t => {
  const f = await fixture(t);
  assert.deepEqual((await f.request('dashboards')).body, []);
  const reserved = await f.request('dashboard_topics', 'GET', undefined, '?next_id');
  assert.equal(reserved.status, 200);
  const topic = await f.request('dashboard_topics', 'POST', { id: reserved.body.id, title: 'Тема', config: { a: 1 } });
  assert.equal(topic.status, 200);
  const dashboard = await f.request('dashboards', 'POST', { topic_id: topic.body.id, title: 'Dashboard', config: { x: 1, nested: { left: 1, right: 2 } } });
  const dashlet = await f.request('dashlets', 'POST', { dashboard_id: dashboard.body.id, title: 'Widget', config: { saved: true } });
  assert.equal(dashlet.status, 200);
  const edited = await f.request('dashboards', 'PUT', { title: 'Edited', config: { nested: { left: 7 } } }, dashboard.body.id);
  assert.equal(edited.status, 200);
  assert.deepEqual(edited.body.config, { x: 1, nested: { left: 7, right: 2 } });
  assert.equal(edited.body.topic_id, topic.body.id);
  assert.equal((await f.request('dashboards', 'GET', undefined, dashboard.body.id)).body.title, 'Edited');
  assert.equal((await f.request('dashlets', 'PUT', { title: 'Renamed' }, dashlet.body.id)).body.config.saved, true);
  assert.equal(f.upstreamCalls(), 0);
  assert.equal(f.fallthrough(), 0);
  assert.equal(await f.local.checkFileExists(`/ds_clowns/topic.${topic.body.id}/dashboard.${dashboard.body.id}/${dashlet.body.id}.json`), true);
});

test('malformed chunked JSON and unknown entities return errors without mutation or proxy fallback', async t => {
  const f = await fixture(t);
  assert.equal((await f.request('dashboard_topics', 'POST', '{"title":')).status, 400);
  assert.deepEqual((await f.request('dashboard_topics')).body, []);
  assert.equal((await f.request('dashboards', 'PUT', { title: 'lost' }, 999)).status, 404);
  assert.equal((await f.request('dashlets', 'DELETE', undefined, 999)).status, 404);
  assert.equal((await f.request('dashboard_topics', 'POST', { title: 'bad' }, '', 'ds_unknown')).status, 404);
  assert.equal((await f.request('dashboard_topics', 'GET', undefined, '?next_id', 'ds_unknown')).status, 404);
  assert.equal((await f.request('cubes', 'POST', { source_ident: 's', name: 'c' }, '', 'ds_unknown')).status, 404);
  assert.equal(f.fallthrough(), 0);
});

test('concurrent local creations allocate unique IDs without any sequence request', async t => {
  const f = await fixture(t);
  const created = await Promise.all(Array.from({ length: 6 }, (_, i) => f.request('dashboard_topics', 'POST', { title: String(i) })));
  assert.ok(created.every(result => result.status === 200));
  assert.equal(new Set(created.map(result => result.body.id)).size, 6);
  assert.equal(f.upstreamCalls(), 0);
});

test('deleting dashboard or topic cascades children; deleting a dashlet cascades nested dashlets', async t => {
  const f = await fixture(t);
  await f.request('dashboard_topics', 'POST', { id: 1, title: 'Parent' });
  await f.request('dashboard_topics', 'POST', { id: 2, parent_id: 1, title: 'Child' });
  await f.request('dashboards', 'POST', { id: 3, topic_id: 2 });
  await f.request('dashlets', 'POST', { id: 4, dashboard_id: 3 });
  await f.request('dashlets', 'POST', { id: 5, dashboard_id: 3, parent_id: 4 });
  await f.request('dashlets', 'POST', { id: 6, dashboard_id: 3 });
  assert.equal((await f.request('dashlets', 'DELETE', undefined, 4)).status, 200);
  assert.deepEqual((await f.request('dashlets')).body.map(x => x.id), [6]);
  assert.equal((await f.request('dashboards', 'DELETE', undefined, 3)).status, 200);
  assert.deepEqual((await f.request('dashlets')).body, []);
  await f.request('dashboards', 'POST', { id: 7, topic_id: 2 });
  await f.request('dashlets', 'POST', { id: 8, dashboard_id: 7 });
  assert.equal((await f.request('dashboard_topics', 'DELETE', undefined, 1)).status, 200);
  assert.deepEqual((await f.request('dashboard_topics')).body, []);
  assert.deepEqual((await f.request('dashboards')).body, []);
  assert.deepEqual((await f.request('dashlets')).body, []);
});

test('YAML format and no-op comments survive UI updates; dashboard move retains child source filenames', async t => {
  const f = await fixture(t);
  await f.write('ds_clowns/topic.1/index.json5', '{title:"one"}');
  await f.write('ds_clowns/topic.2/index.json5', '{title:"two"}');
  const original = '# keep on no-op\ntitle: Before\ntopic_id: 1\nconfig: {a: 1}\n';
  await f.write('ds_clowns/topic.1/dashboard.3/index.yaml', original);
  await f.write('ds_clowns/topic.1/dashboard.3/4.json5', '{title:"child", dashboard_id:3}');
  const unchanged = await f.request('dashboards', 'PUT', { title: 'Before' }, 3);
  assert.equal(unchanged.status, 200);
  // API-only ID must not be added to persisted document on a semantic no-op.
  assert.equal(await fs.readFile(path.join(f.root, 'ds_clowns/topic.1/dashboard.3/index.yaml'), 'utf8'), original);
  const moved = await f.request('dashboards', 'PUT', { topic_id: 2 }, 3);
  assert.equal(moved.status, 200);
  assert.equal(await f.local.checkFileExists('/ds_clowns/topic.1/dashboard.3/index.json'), false);
  assert.equal(await f.local.checkFileExists('/ds_clowns/topic.2/dashboard.3/index.yaml'), true);
  assert.equal(await f.local.checkFileExists('/ds_clowns/topic.2/dashboard.3/4.json5'), true);
});

test('cube and dimension CRUD work locally with chunked bodies, filtering and partial edits', async t => {
  const f = await fixture(t);
  const created = await f.request('cubes', 'POST', { source_ident: 'sales', name: 'facts.daily', title: 'Cube', config: { a: 1 }, dimensions: [] });
  assert.equal(created.status, 200);
  assert.equal(created.body.id, 'sales.facts.daily');
  const dimension = await f.request('dimensions', 'POST', { source_ident: 'sales', cube_name: 'facts.daily', name: 'revenue.total', expression: 'sum(x)', config: { a: 1, b: 2 } });
  assert.equal(dimension.status, 200);
  assert.equal(dimension.body.id, 'sales.facts.daily.revenue.total');
  const changed = await f.request('dimensions', 'PUT', { config: { a: 3 } }, dimension.body.id);
  assert.equal(changed.status, 200);
  assert.equal(changed.body.expression, 'sum(x)');
  assert.deepEqual(changed.body.config, { a: 3, b: 2 });
  const filtered = await f.request('dimensions', 'GET', undefined, ".filter(source_ident='sales'%26%26cube_name='facts.daily'%26%26is_global=0)");
  assert.equal(filtered.status, 200);
  assert.equal(filtered.body.length, 1);
  const renamed = await f.request('cubes', 'PUT', { name: 'renamed' }, created.body.id);
  assert.equal(renamed.status, 200);
  const dimensions = (await f.request('dimensions')).body;
  assert.equal(dimensions[0].id, 'sales.renamed.revenue.total');
  assert.equal((await f.request('dimensions', 'DELETE', undefined, dimensions[0].id)).status, 200);
  assert.deepEqual((await f.request('dimensions')).body, []);
  assert.equal((await f.request('cubes', 'DELETE', undefined, 'sales.renamed')).status, 200);
  assert.deepEqual((await f.request('cubes')).body, []);
  assert.equal(f.upstreamCalls(), 0);
});

test('dimensions batch is checked before writes and cube update requires an ID', async t => {
  const f = await fixture(t);
  await f.request('cubes', 'POST', { source_ident: 's', name: 'c' });
  const failed = await f.request('dimensions', 'POST', [{ source_ident: 's', cube_name: 'c', name: 'a' }, { source_ident: 's', cube_name: 'missing', name: 'b' }]);
  assert.equal(failed.status, 404);
  assert.deepEqual((await f.request('dimensions')).body, []);
  assert.equal((await f.request('cubes', 'PUT', { title: 'missing id' })).status, 400);
  assert.equal((await f.request('cubes', 'POST', { source_ident: 's', name: 'c' })).status, 409);
  assert.equal((await f.request('dimensions', 'PUT', '{broken', 's.c.a')).status, 400);
});

test('local collection queries order and filter correctly, and parent cycles are rejected', async t => {
  const f = await fixture(t);
  await f.request('dashboard_topics', 'POST', { id: 1, title: 'B', srt: 2 });
  await f.request('dashboard_topics', 'POST', { id: 2, title: 'A', srt: 1, parent_id: 1 });
  const ordered = await f.request('dashboard_topics', 'GET', undefined, '.order_by(srt,title)');
  assert.deepEqual(ordered.body.map(row => row.id), [2, 1]);
  const filtered = await f.request('dashboard_topics', 'GET', undefined, '.filter(parent_id=1).order_by(id)');
  assert.deepEqual(filtered.body.map(row => row.id), [2]);
  assert.equal((await f.request('dashboard_topics', 'PUT', { parent_id: 2 }, 1)).status, 400);
  assert.equal((await f.request('dashboard_topics', 'GET', undefined, 1)).body.parent_id, undefined);
});

test('cube YAML no-op preserves comments and source fields while UI updates remain in YAML', async t => {
  const f = await fixture(t);
  const original = '# no-op comment\nsource_ident: s\nname: c\ntitle: Original\ndimensions: []\n';
  await f.write('ds_clowns/.cubes/s.c.yaml', original);
  const unchanged = await f.request('cubes', 'PUT', { title: 'Original' }, 's.c');
  assert.equal(unchanged.status, 200);
  assert.equal(await fs.readFile(path.join(f.root, 'ds_clowns/.cubes/s.c.yaml'), 'utf8'), original);
  const changed = await f.request('cubes', 'PUT', { title: 'Changed' }, 's.c');
  assert.equal(changed.status, 200);
  assert.equal((await f.local.cubes.getContent('/ds_clowns/.cubes/s.c.json')).title, 'Changed');
  assert.equal((await fs.readdir(path.join(f.root, 'ds_clowns/.cubes'))).includes('s.c.json5'), false);
});

test('nonlocal data POST passes to read-only proxy while malformed local data requests are caught', async t => {
  const f = await fixture(t);
  const handlers = createCubeMiddlewares({ local: f.local, server: { cubes: new Proxy({}, { get() { throw new Error('No remote data expected'); } }) } });
  let nextCalls = 0;
  const response = { statusCode: 200, setHeader() {}, end(body) { this.body = JSON.parse(body); this.writableEnded = true; } };
  const nonlocal = Readable.from(['{}']);
  Object.assign(nonlocal, { method: 'POST', url: '/', params: { schema_name: 'ds_unknown' } });
  await handlers.dataMiddleware(nonlocal, response, () => { nextCalls++; });
  assert.equal(nextCalls, 1);
  const malformed = Readable.from(['{"with":', 'bad}']);
  Object.assign(malformed, { method: 'POST', url: '/', params: { schema_name: 'ds_clowns' } });
  await handlers.dataMiddleware(malformed, response, () => { throw new Error('Local data must not fall through'); });
  assert.equal(response.statusCode, 400);
});
