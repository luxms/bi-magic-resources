const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs').promises;
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const SourceLocal = require('../platforms/SourceLocal');
const {createResourceMiddleware} = require('../server/middlewares/resource-middleware');

async function fixture(t) {
  const project = await fs.mkdtemp(path.join(os.tmpdir(), 'resource-http-'));
  const root = path.join(project, 'src');
  await fs.mkdir(path.join(root, 'ds_test'), {recursive: true});
  const local = new SourceLocal(root);
  local.getSchemaNames = async () => ['ds_test'];
  const assets = {'ds_test/old.json': {id: 7, alt_id: 'old.json', content_type: 'application/json'}};
  await fs.writeFile(path.join(root, 'ds_test/old.json'), '{ malformed legacy');
  let id = 8;
  const events = [];
  let handler = createResourceMiddleware({local, getAssets: () => assets, allocateId: () => id++, onChange: (...args) => events.push(args)});
  const server = http.createServer((req, res) => handler(req, res, () => {res.statusCode = 299; res.end(req.url);}));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {await new Promise(resolve => server.close(resolve)); await fs.rm(project, {recursive: true, force: true});});
  const request = (url, method = 'GET', bytes, type = 'application/json') => new Promise((resolve, reject) => {
    const req = http.request({hostname: '127.0.0.1', port: server.address().port, path: url, method, headers: {'Content-Type': type}}, res => {
      const chunks = [];
      res.on('data', data => chunks.push(data));
      res.on('end', () => resolve({status: res.statusCode, bytes: Buffer.concat(chunks), json: () => JSON.parse(Buffer.concat(chunks))}));
    });
    req.on('error', reject);
    if (bytes) {const content = Buffer.from(bytes); req.write(content.subarray(0, 2)); req.write(content.subarray(2));}
    req.end();
  });
  const restart = () => {
    for (const value of Object.values(assets)) {delete value.config; delete value.title; value.content_type = 'application/octet-stream';}
    handler = createResourceMiddleware({local, getAssets: () => assets, allocateId: () => id++, onChange: (...args) => events.push(args)});
  };
  return {root, project, request, assets, events, restart};
}
test('browser resource metadata POST + raw content PUT/read/rename/delete stays local and keeps stable ids', async t => {
  const f = await fixture(t);
  assert.equal((await f.request('/srv/resources/ds_test/7')).bytes.toString(), '{ malformed legacy');
  const created = await f.request('/api/db/ds_test.resources/', 'POST', JSON.stringify({alt_id: 'folder/русский.yaml', content_type: 'application/octet-stream'}));
  assert.equal(created.status, 200);
  const id = created.json().id;
  const payload = Buffer.from([0, 255, 3, 128, 4]);
  const written = await f.request(`/srv/resources/ds_test/${id}`, 'PUT', payload, 'application/octet-stream');
  assert.equal(written.status, 200);
  assert.equal(written.json().id, id);
  assert.deepEqual((await f.request('/srv/resources/ds_test/folder/' + encodeURIComponent('русский.yaml'))).bytes, payload);
  assert.deepEqual(await fs.readFile(path.join(f.root, 'ds_test/folder/русский.yaml')), payload);
  const changed = await f.request(`/api/db/ds_test.resources/${id}`, 'PUT', JSON.stringify({alt_id: 'renamed.json5', config: {editor: true}}));
  assert.equal(changed.status, 200);
  assert.equal(changed.json().id, id);
  assert.equal((await f.request('/api/db/ds_test.resources/')).json().length, 2);
  assert.deepEqual((await f.request(`/srv/resources/ds_test/${id}`)).bytes, payload);
  assert.equal((await f.request(`/api/db/ds_test.resources/${id}`, 'DELETE')).status, 200);
  await assert.rejects(fs.readFile(path.join(f.root, 'ds_test/renamed.json5')), {code: 'ENOENT'});
  assert.equal((await f.request(`/srv/resources/ds_test/${id}`)).status, 404);
  assert.deepEqual(f.events.map(event => event[0].type), ['ADD_RESOURCES', 'ADD_RESOURCES', 'ADD_RESOURCES', 'DELETE_RESOURCES']);
});
test('generated resources reject browser writes and numeric GET resolves to webpack name', async t => {
  const f = await fixture(t);
  await fs.writeFile(path.join(f.root, 'ds_test/widget.tsx'), 'export default 1;');
  f.assets['ds_test/widget.js'] = {id: 9, alt_id: 'widget.js'};
  assert.equal((await f.request('/srv/resources/ds_test/9', 'PUT', 'replacement')).status, 409);
  assert.equal((await f.request('/api/db/ds_test.resources/9', 'DELETE')).status, 409);
  const get = await f.request('/srv/resources/ds_test/9');
  assert.equal(get.status, 299);
  assert.equal(get.bytes.toString(), '/srv/resources/ds_test/widget.js');
  assert.equal(await fs.readFile(path.join(f.root, 'ds_test/widget.tsx'), 'utf8'), 'export default 1;');
  await assert.rejects(fs.readFile(path.join(f.root, 'ds_test/widget.js')), {code: 'ENOENT'});
});
test('unsafe, reserved, symlink and unknown-schema writes never fall through', async t => {
  const f = await fixture(t);
  for (const name of ['../escape', '.env', '_sources.json', '.bi-build.json', 'topic.1/index.json', '.cubes/test.json']) {
    assert.equal((await f.request('/api/db/ds_test.resources/', 'POST', JSON.stringify({alt_id: name}))).status, 400, name);
  }
  assert.equal((await f.request('/srv/resources/ds_other/x', 'PUT', 'x')).status, 403);
  assert.equal((await f.request('/srv/resources/ds_test/999', 'PUT', 'x')).status, 404);
  await fs.symlink(path.join(f.root, 'ds_test/old.json'), path.join(f.root, 'ds_test/link'));
  assert.equal((await f.request('/srv/resources/ds_test/link', 'PUT', 'x')).status, 400);
  assert.equal(await fs.readFile(path.join(f.root, 'ds_test/old.json'), 'utf8'), '{ malformed legacy');
});

test('resource metadata survives middleware restart without replacing runtime ids', async t => {
  const f = await fixture(t);
  const changed = await f.request('/api/db/ds_test.resources/7', 'PUT', JSON.stringify({title: 'Local title', config: {editor: 'raw'}, content_type: 'text/plain'}));
  assert.equal(changed.status, 200);
  f.assets['ds_test/old.json'].id = 42;
  f.restart();
  const metadata = await f.request('/api/db/ds_test.resources/42');
  assert.equal(metadata.status, 200);
  assert.equal(metadata.json().title, 'Local title');
  assert.deepEqual(metadata.json().config, {editor: 'raw'});
  assert.equal(metadata.json().content_type, 'text/plain');
  assert.equal(metadata.json().id, 42);
  assert.equal(await fs.readFile(path.join(f.root, 'ds_test/old.json'), 'utf8'), '{ malformed legacy');
  const store = JSON.parse(await fs.readFile(path.join(f.project, '.bi-sync/resource-metadata.json')));
  assert.equal(store.resources['ds_test/old.json'].id, undefined);
});
test('concurrent metadata creates reject duplicate names and generated metadata edits are local', async t => {
  const f = await fixture(t);
  const results = await Promise.all([1, 2].map(() => f.request('/api/db/ds_test.resources/', 'POST', JSON.stringify({alt_id: 'same.json5'}))));
  assert.deepEqual(results.map(r => r.status).sort(), [200, 409]);
  await fs.writeFile(path.join(f.root, 'ds_test/widget.tsx'), 'export default 1;');
  f.assets['ds_test/widget.js'] = {id: 20, alt_id: 'widget.js'};
  assert.equal((await f.request('/api/db/ds_test.resources/20', 'PUT', '{"title":"Generated widget"}')).status, 200);
  assert.equal((await f.request('/api/db/ds_test.resources/20', 'PUT', '{"alt_id":"other.js"}')).status, 409);
  assert.equal((await f.request('/srv/resources/ds_test/20', 'PUT', 'replacement')).status, 409);
});
