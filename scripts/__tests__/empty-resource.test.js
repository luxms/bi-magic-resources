const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const Server = require('../platforms/Server');
const auth = require('../lib/auth');

test('empty resources create without raw upload and truncate in place on legacy server', async t => {
  const records = new Map();
  const requests = [];
  let nextId = 1;
  let denyTruncate = false;
  const listener = http.createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const bytes = Buffer.concat(chunks);
    requests.push({method: req.method, url: req.url});
    const json = (value, status = 200) => { res.statusCode = status; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(value)); };
    if (req.method === 'POST' && req.url === '/api/db/ds_test.resources/') {
      const metadata = JSON.parse(bytes);
      const row = {...metadata, id: nextId++, config: {preserve: true}, created: 'original', content: Buffer.alloc(0)};
      records.set(row.id, row);
      return json(row);
    }
    if (req.method === 'GET' && req.url.includes('.filter')) {
      const name = /alt_id='([^']+)'/.exec(decodeURIComponent(req.url))[1];
      return json([...records.values()].filter(r => r.alt_id === name));
    }
    const id = Number(req.url.split('/').at(-1));
    const row = records.get(id);
    if (req.method === 'PUT' && req.url.startsWith('/api/db/ds_test._resources/')) {
      if (denyTruncate) return json({error: 'forbidden'}, 403);
      assert.match(req.headers['content-type'], /application\/json/);
      assert.deepEqual(JSON.parse(bytes), {content: ''});
      row.content = Buffer.alloc(0);
      return json({id});
    }
    if (req.method === 'PUT' && req.url.startsWith('/srv/resources/')) {
      if (!bytes.length) return json({key: 'HTTP_REQUEST_BODY_READ_ERROR'}, 500);
      row.content = bytes;
      return json({id});
    }
    return json({error: 'unexpected request'}, 500);
  });
  await new Promise(resolve => listener.listen(0, '127.0.0.1', resolve));
  const previous = {base: auth.BASE_URL, options: auth.REQUEST_OPTIONS};
  t.after(async () => {
    auth.BASE_URL = previous.base; auth.REQUEST_OPTIONS = previous.options;
    listener.closeAllConnections();
    await new Promise(resolve => listener.close(resolve));
  });
  auth.BASE_URL = `http://127.0.0.1:${listener.address().port}`;
  auth.REQUEST_OPTIONS = {};
  const manager = new Server().resources;
  for (const [name, content] of [['empty.txt', Buffer.alloc(0)], ['empty-string.txt', '']]) {
    const start = requests.length;
    await manager.createContent(`/ds_test/${name}`, content);
    assert.equal(requests.length, start + 1);
    assert.equal(requests.at(-1).method, 'POST');
  }
  await manager.createContent('/ds_test/existing.txt', Buffer.from('nonempty'));
  const row = [...records.values()].find(r => r.alt_id === 'existing.txt');
  assert.equal(row.content.toString(), 'nonempty');
  const metadata = {...row}; delete metadata.content;
  await manager.updateContent('/ds_test/existing.txt', Buffer.alloc(0));
  assert.equal(row.content.length, 0);
  const after = {...row}; delete after.content;
  assert.deepEqual(after, metadata);
  assert.equal(requests.at(-1).url, `/api/db/ds_test._resources/${row.id}`);
  await manager.updateContent('/ds_test/existing.txt', Buffer.from('again'));
  assert.equal(row.content.toString(), 'again');
  denyTruncate = true;
  await assert.rejects(manager.updateContent('/ds_test/existing.txt', Buffer.alloc(0)), /403/);
  assert.equal(row.content.toString(), 'again');
  assert.equal(requests.some(r => r.method === 'DELETE'), false);
});
