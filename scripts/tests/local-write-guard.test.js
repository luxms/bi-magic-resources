const test = require('node:test');
const assert = require('node:assert/strict');
const { localWriteGuard, isProtectedWrite } = require('../server/middlewares/local-write-guard');

for (const table of ['dashboard_topics', 'dashboards', 'dashlets', 'cubes', 'dimensions', 'resources']) {
  test(`blocks escaped writes to ${table} for any schema and mutation method`, () => {
    for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) {
      for (const schema of ['ds_test', 'ds_unselected', 'missing', 'koob']) {
        for (const suffix of ['', '/', '/123', "/.filter(id='123')"]) assert.equal(isProtectedWrite({method, url: `/api/db/${schema}.${table}${suffix}`}), true);
      }
    }
  });
}

test('resource bodies and encoded aliases cannot fall through to the upstream', () => {
  for (const url of ['/srv/resources/ds_test/a.js', '/srv/resources', '/api/db/ds_test%2Ecubes/one', '/api/db/ds_test%252Ecubes/one', '//api//db//ds_test.cubes/one', '/other/../api/db/ds_test.cubes/one', '/api/db/ds_test.resources/%broken']) {
    assert.equal(isProtectedWrite({method: 'PUT', url}), true, url);
  }
  assert.equal(isProtectedWrite({method: 'GET', url: '/api/db/ds_test.cubes', headers: {'x-http-method-override': 'DELETE'}}), true);
  assert.equal(isProtectedWrite({method: 'POST', url: '/api/db/ds_test.cubes', headers: {'x-http-method-override': 'GET'}}), true);
  assert.equal(isProtectedWrite({method: 'PUT', originalUrl: '/api/db/ds_test.cubes/one', url: '/one'}), true);
});

test('normal reads, login, data-query POSTs and unrelated tables keep working', () => {
  for (const method of ['GET', 'HEAD', 'OPTIONS']) assert.equal(isProtectedWrite({method, url: '/api/db/ds_test.cubes/one'}), false);
  for (const url of ['/api/auth/login', '/api/auth/logout', '/api/v3/ds_test/data/', '/api/ipc/service', '/api/db/ds_test.query_log', '/api/db/ds_test.resources_usage', '/srv/resource-info', '/api/all/cubes']) {
    assert.equal(isProtectedWrite({method: 'POST', url}), false, url);
  }
});

test('last-chance middleware rejects locally with explanatory JSON instead of invoking proxy', () => {
  let next = 0, body;
  const headers = {};
  const res = {setHeader(name, value) {headers[name] = value;}, end(value) {body = JSON.parse(value);}};
  localWriteGuard({method: 'DELETE', url: '/api/db/disabled.dashboards/1'}, res, () => next++);
  assert.equal(next, 0);
  assert.equal(res.statusCode, 403);
  assert.equal(body.error, 'LOCAL_WRITE_NOT_HANDLED');
  assert.match(body.message, /blocked.*upstream/);
  assert.match(headers['Content-Type'], /application\/json/);
  localWriteGuard({method: 'POST', url: '/api/v3/ds_test/data/'}, res, () => next++);
  assert.equal(next, 1);
});

test('unhandled GET next_id stays local for enabled blocks', () => {
  for (const table of ['dashboard_topics', 'dashboards', 'dashlets', 'cubes', 'dimensions', 'resources']) {
    assert.equal(isProtectedWrite({method: 'GET', url: `/api/db/unselected.${table}/?next_id`}), true);
    assert.equal(isProtectedWrite({method: 'GET', url: `/api/db/unselected.${table}/?%6eext_id=1`}), true);
    assert.equal(isProtectedWrite({method: 'GET', url: `/api/db/unselected.${table}/?order_by=id`}), false);
  }
  assert.equal(isProtectedWrite({method: 'GET', url: '/api/auth/check?next_id'}), false);
  assert.equal(isProtectedWrite({method: 'GET', url: '/api/db/ds_test.unrelated?next_id'}), false);
  let response, proxied = false;
  const res = {setHeader() {}, end(value) {response = JSON.parse(value);}};
  localWriteGuard({method: 'GET', url: '/api/db/ds_test.dashboard_topics/?next_id'}, res, () => {proxied = true;});
  assert.equal(proxied, false);
  assert.equal(res.statusCode, 403);
  assert.equal(response.error, 'LOCAL_WRITE_NOT_HANDLED');
});

test('disabled blocks proxy mutations and next_id to an upstream HTTP server independently', async () => {
  const http = require('node:http');
  const express = require('express');
  const {createProxyMiddleware} = require('http-proxy-middleware');
  const {createLocalWriteGuard} = require('../server/middlewares/local-write-guard');
  const listen = server => new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const close = server => new Promise(resolve => server.close(resolve));
  const received = [];
  const upstream = http.createServer((req, res) => {
    received.push({method: req.method, url: req.url});
    res.end('upstream');
  });
  await listen(upstream);
  try {
    for (let mask = 0; mask < 8; mask++) {
      const enabled = {dashboards: !!(mask & 1), cubes: !!(mask & 2), resources: !!(mask & 4)};
      const app = express();
      app.use(createLocalWriteGuard(enabled));
      app.use(createProxyMiddleware({target: `http://127.0.0.1:${upstream.address().port}`}));
      const local = http.createServer(app);
      await listen(local);
      try {
        for (const [block, tables] of Object.entries({dashboards: ['dashboard_topics', 'dashboards', 'dashlets'], cubes: ['cubes', 'dimensions'], resources: ['resources']})) {
          for (const table of tables) {
            for (const method of ['POST', 'PUT', 'PATCH', 'DELETE', 'GET']) {
              const url = `/api/db/ds_test.${table}/${method === 'GET' ? '?next_id' : '1'}`;
              const count = received.length;
              const response = await fetch(`http://127.0.0.1:${local.address().port}${url}`, {method});
              await response.text();
              assert.equal(response.status, enabled[block] ? 403 : 200, `${JSON.stringify(enabled)} ${method} ${table}`);
              assert.equal(received.length, count + (enabled[block] ? 0 : 1));
              if (!enabled[block]) assert.deepEqual(received.at(-1), {method, url});
            }
          }
        }
      } finally { await close(local); }
    }
  } finally { await close(upstream); }
});
