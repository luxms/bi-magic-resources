const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const http = require('http');
const express = require('express');
const {createProxyMiddleware} = require('http-proxy-middleware');
const {createLocalWriteGuard} = require('../server/middlewares/local-write-guard');
const source = fs.readFileSync(path.join(__dirname, '../start.js'), 'utf8');

async function listen(server) {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return `http://127.0.0.1:${server.address().port}`;
}
async function close(server) {
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
}

async function fixture(t, jwt = '') {
  const upstreamRequests = [];
  const upstream = http.createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const request = {method: req.method, url: req.url, authorization: req.headers.authorization || '', cookie: req.headers.cookie || '', body: Buffer.concat(chunks).toString('hex')};
    upstreamRequests.push(request);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({source: 'upstream', ...request}));
  });
  const upstreamUrl = await listen(upstream);
  const app = express();
  const server = http.createServer(app);
  t.after(async () => {await close(server); await close(upstream);});
  let localBuildHits = 0;
  const compiler = {hooks: {done: {tap() {}}}};
  class DevServer {
    constructor(value, options) {
      this.compiler = value;
      this.listeningApp = server;
      // Use the real registered `before` chain, then model webpack's local file
      // serving and the normal fallback proxy in exactly that order.
      options.before(app);
      app.use('/srv/resources', (req, res) => {localBuildHits++; res.end('stale local webpack asset');});
      app.use(createProxyMiddleware({target: upstreamUrl, changeOrigin: true}));
    }
    listen() {}
  }
  const modules = {
    webpack: () => compiler, 'webpack-dev-server': DevServer,
    'http-proxy-middleware': {createProxyMiddleware},
    'mime-types': {}, path, fs, crypto: require('crypto'),
    chokidar: {watch: () => ({on() {}})},
    '../webpack.config': () => ({output: {path: '/fixture/dist'}}),
    './lib/auth': {},
    './lib/config': {hasNoLogin: () => true, getServer: () => upstreamUrl, getPort: () => 39999,
      getOption: () => '', getJWT: () => jwt, hasCubes: () => false, hasResources: () => false, hasDashboards: () => false},
    './lib/utils': {filterSchemaNames: names => names, decodePath: value => value},
    './platforms/SourceLocal': class {},
    './server/middlewares/resource-middleware': {},
    './server/middlewares/local-write-guard': {createLocalWriteGuard},
    './lib/cube-watcher': {createCubeChangeTracker: () => ({})},
    './server/middlewares': {authMiddleware: (req, res, next) => {req.headers.cookie = 'fixture-session=local'; next();}, RtMiddleware: class {constructor() {this._wsServer = {};}}},
    './lib/dashboard-watcher': {},
    './lib/config-codec': require('../lib/config-codec'),
  };
  const mockedRequire = name => {
    if (!(name in modules)) throw new Error(`Unexpected dependency ${name}`);
    return modules[name];
  };
  mockedRequire.resolve = name => name;
  vm.runInNewContext(source, {require: mockedRequire, __dirname: '/fixture/scripts', console, process: {exitCode: 0}});
  const url = await listen(server);
  return {url, upstreamRequests, localBuildHits: () => localBuildHits};
}

test('resources OFF proxies alt_id and numeric URLs before webpack for every HTTP method', async t => {
  const app = await fixture(t);
  for (const name of ['nested/raw%20file.json5', '42']) {
    for (const method of ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS']) {
      const body = ['PUT', 'POST', 'PATCH'].includes(method) ? Buffer.from([0xff, 0, 0x7b, 0x7d]) : undefined;
      const url = `/srv/resources/ds_test/${name}?v=remote`;
      const response = await fetch(app.url + url, {method, body});
      assert.equal(response.status, 200);
      const result = await response.json();
      assert.equal(result.source, 'upstream');
      assert.equal(result.url, url);
      assert.equal(result.method, method);
      assert.equal(result.body, body?.toString('hex') || '');
      assert.equal(result.cookie, 'fixture-session=local');
    }
  }
  const response = await fetch(app.url + '/srv/resources/ds_test/a.css', {method: 'HEAD'});
  assert.equal(response.status, 200);
  assert.equal(app.upstreamRequests.at(-1).method, 'HEAD');
  assert.equal(app.localBuildHits(), 0);
});

test('disabled resource bypass forwards JWT; disabled entity APIs still reach their API proxy', async t => {
  const app = await fixture(t, 'fixture-token');
  const resource = await (await fetch(app.url + '/srv/resources/ds_test/a.css')).json();
  assert.equal(resource.authorization, 'Bearer fixture-token');
  for (const table of ['dashboard_topics', 'dashboards', 'dashlets', 'cubes', 'dimensions', 'resources']) {
    const url = `/api/db/ds_test.${table}/?next_id`;
    const response = await (await fetch(app.url + url)).json();
    assert.equal(response.source, 'upstream');
    assert.equal(response.url, url);
    assert.equal(response.authorization, 'Bearer fixture-token');
    const changed = await (await fetch(app.url + `/api/db/ds_test.${table}/1`, {method: 'PUT', body: '{}'})).json();
    assert.equal(changed.source, 'upstream');
    assert.equal(changed.method, 'PUT');
  }
  assert.equal(app.localBuildHits(), 0);
});
