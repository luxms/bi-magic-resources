const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const {createHash} = require('node:crypto');
const Confirm = require('prompt-confirm');
const Local = require('../platforms/Local');
const Server = require('../platforms/Server');
const auth = require('../lib/auth');
const config = require('../lib/config');
const synchronize = require('../lib/synchronize');

test('resource download and upload preserve JSON/YAML bytes without parsing or renaming', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'bi-resource-bytes-'));
  t.after(() => fs.rm(root, {recursive: true, force: true}));
  const files = new Map([
    ['data.json', Buffer.from([123, 0x80, 0, 125])],
    ['data.json5', Buffer.from('// opaque resource\n{broken')],
    ['data.yaml', Buffer.from('not: [valid yaml')],
    ['empty.txt', Buffer.alloc(0)],
    ['topic.notes/data.json5', Buffer.from('ordinary resource')],
    ['числа.json', Buffer.from('{"value": 1}')],
  ]);
  const names = [...files.keys()];
  const remoteReads = [];
  let includeHashes = true;
  const listener = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url);
    const json = value => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(value)); };
    if (url === '/api/db/adm.datasets') return json([{schema_name: 'ds_test'}]);
    if (url === '/api/db/ds_test.resources') return json(names.map((alt_id, i) => ({
      alt_id, id: i + 1,
      ...(includeHashes ? {content_hash: createHash('md5').update(files.get(alt_id)).digest('hex')} : {}),
    })));
    if (url.startsWith('/api/db/ds_test.resources/.filter')) {
      const name = /alt_id='([^']+)'/.exec(url)?.[1];
      return json([{id: names.indexOf(name) + 1}]);
    }
    if (req.method === 'PUT') {
      const chunks = [];
      req.on('data', chunk => chunks.push(chunk));
      req.on('end', () => {
        const id = /^\/srv\/resources\/ds_test\/(\d+)$/.exec(url)?.[1];
        if (id) files.set(names[Number(id) - 1], Buffer.concat(chunks));
        json({});
      });
      return;
    }
    const name = url.replace('/srv/resources/ds_test/', '');
    if (files.has(name)) {
      remoteReads.push(name);
      res.setHeader('Content-Type', 'application/json');
      return res.end(files.get(name));
    }
    res.statusCode = 404;
    res.end();
  });
  await new Promise(resolve => listener.listen(0, '127.0.0.1', resolve));
  const previous = {base: auth.BASE_URL, request: auth.REQUEST_OPTIONS, options: config.OPTIONS_CACHE};
  t.after(async () => {
    auth.BASE_URL = previous.base;
    auth.REQUEST_OPTIONS = previous.request;
    config.OPTIONS_CACHE = previous.options;
    listener.closeAllConnections();
    await new Promise(resolve => listener.close(resolve));
  });
  auth.BASE_URL = `http://127.0.0.1:${listener.address().port}`;
  auth.REQUEST_OPTIONS = {};
  config.OPTIONS_CACHE = {include: '^ds_test$', exclude: '', resources: true, dashboards: false, cubes: false, force: true, noRemove: false};
  const remote = new Server(), local = new Local(root);
  await synchronize(remote, local);
  for (const [name, bytes] of files) {
    assert.deepEqual(await fs.readFile(path.join(root, 'ds_test', name)), bytes);
    assert.deepEqual(await local.resources.getContent(`/ds_test/${name}`), bytes);
  }
  assert.deepEqual(await local.dashboards.enumerate('ds_test'), []);
  remoteReads.length = 0;
  await synchronize(remote, local);
  assert.deepEqual(remoteReads, [], 'pull should trust matching server hashes without downloading files');
  await synchronize(local, remote);
  assert.deepEqual(remoteReads, [], 'push should trust matching server hashes without downloading files');

  // Different invalid UTF-8 bytes stringify to the same replacement character.
  // Synchronization must compare buffers, not decoded strings or JSON objects.
  files.set('data.json', Buffer.from([123, 0x81, 0, 125]));
  await synchronize(remote, local);
  assert.deepEqual(remoteReads, ['data.json'], 'pull should download a resource with a changed hash');
  assert.deepEqual(await fs.readFile(path.join(root, 'ds_test/data.json')), files.get('data.json'));

  const changed = Buffer.from('// preserved verbatim\n{still not JSON}\n');
  await fs.writeFile(path.join(root, 'ds_test/data.json'), changed);
  remoteReads.length = 0;
  await synchronize(local, remote);
  assert.deepEqual(remoteReads, [], 'push should upload a changed resource without downloading it');
  assert.deepEqual(files.get('data.json'), changed);

  // Local CRLF can normalize to the exact server bytes without an upload or download.
  files.set('data.yaml', Buffer.from('line\nvalue'));
  await fs.writeFile(path.join(root, 'ds_test/data.yaml'), 'line\r\nvalue');
  remoteReads.length = 0;
  await synchronize(local, remote);
  assert.deepEqual(remoteReads, []);
  assert.deepEqual(files.get('data.yaml'), Buffer.from('line\nvalue'));

  // Pull still downloads on a hash mismatch so it can compare normalized content.
  files.set('data.yaml', Buffer.from('line\r\nvalue'));
  await fs.writeFile(path.join(root, 'ds_test/data.yaml'), 'line\nvalue');
  remoteReads.length = 0;
  await synchronize(remote, local);
  assert.deepEqual(remoteReads, ['data.yaml']);
  assert.deepEqual(await fs.readFile(path.join(root, 'ds_test/data.yaml')), Buffer.from('line\nvalue'));

  // Push overwrites server-side CRLF with local LF without fetching the old bytes.
  remoteReads.length = 0;
  await synchronize(local, remote);
  assert.deepEqual(remoteReads, []);
  assert.deepEqual(files.get('data.yaml'), Buffer.from('line\nvalue'));

  // This synchronization protocol requires the v12 content_hash metadata.
  includeHashes = false;
  remoteReads.length = 0;
  await assert.rejects(synchronize(remote, local), /content_hash/);
  assert.deepEqual(remoteReads, [], 'missing hashes must fail without downloading resources');

  // Declining pull must not download new or hash-changed server resources.
  includeHashes = true;
  files.set('data.json', Buffer.from('changed on server'));
  names.push('new.txt');
  files.set('new.txt', Buffer.from('new on server'));
  config.OPTIONS_CACHE.force = false;
  let allow = false;
  t.mock.method(Confirm.prototype, 'run', async () => {
    assert.deepEqual(remoteReads, [], 'resource downloads must happen after confirmation');
    return allow;
  });
  remoteReads.length = 0;
  assert.equal((await synchronize(remote, local)).status, 'cancelled');
  assert.deepEqual(remoteReads, []);
  await assert.rejects(fs.readFile(path.join(root, 'ds_test/new.txt')), {code: 'ENOENT'});

  allow = true;
  assert.equal((await synchronize(remote, local)).status, 'applied');
  assert.deepEqual(remoteReads.sort(), ['data.json', 'new.txt']);
  assert.deepEqual(await fs.readFile(path.join(root, 'ds_test/data.json')), files.get('data.json'));
  assert.deepEqual(await fs.readFile(path.join(root, 'ds_test/new.txt')), files.get('new.txt'));
});
