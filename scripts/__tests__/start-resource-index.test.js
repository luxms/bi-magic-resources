const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const source = fs.readFileSync(path.join(__dirname, '../start.js'), 'utf8');

function start(resources = true) {
  let complete, getAssets;
  const events = [];
  const compiler = {hooks: {done: {tap(name, callback) {complete = callback;}}}, outputFileSystem: {}};
  class DevServer {
    constructor(value, options) {
      this.compiler = value;
      this.listeningApp = {on() {}};
      options.before({use() {}});
    }
    listen() {}
  }
  class RtMiddleware {
    constructor() {this._wsServer = {};}
    publishSchemaMessage(schema, messages) {events.push({schema, messages: JSON.parse(JSON.stringify(messages))});}
    addResources(schema, resources) {this.publishSchemaMessage(schema, resources.map(payload => ({type: 'ADD_RESOURCES', payload})));}
    modifyResources(schema, resources) {this.addResources(schema, resources);}
  }
  const modules = {
    webpack: () => compiler,
    'webpack-dev-server': DevServer,
    'http-proxy-middleware': {createProxyMiddleware: () => ({upgrade() {}})},
    'mime-types': {lookup: () => 'text/plain'},
    path, fs, crypto: require('crypto'),
    chokidar: {watch: () => ({on() {}})},
    '../webpack.config': () => ({output: {path: '/fixture/dist'}}),
    './lib/auth': {},
    './lib/config': {hasNoLogin: () => true, getServer: () => 'http://upstream', getPort: () => 39999,
      getOption: () => '', getJWT: () => '', hasCubes: () => false, hasResources: () => resources, hasDashboards: () => false},
    './lib/utils': {filterSchemaNames: names => names, decodePath: value => value},
    './platforms/SourceLocal': class {},
    './server/middlewares/resource-middleware': {createResourceMiddleware: options => {getAssets = options.getAssets; return () => {}; }},
    './server/middlewares/local-write-guard': {createLocalWriteGuard() { return () => {}; }},
    './lib/cube-watcher': {createCubeChangeTracker: () => ({}), parseCubePath: () => null},
    './server/middlewares': {RtMiddleware},
    './lib/dashboard-watcher': {parseDashboardPath: () => null},
    './lib/config-codec': require('../lib/config-codec'),
  };
  const mockedRequire = name => {
    if (!(name in modules)) throw new Error(`Unexpected dependency ${name}`);
    return modules[name];
  };
  mockedRequire.resolve = name => name;
  vm.runInNewContext(source, {require: mockedRequire, __dirname: '/fixture/scripts', console: {log() {}, error(error) {throw error;}}, process: {exitCode: 0}});
  const build = (files, hasErrors = false) => complete({
    hasErrors: () => hasErrors, endTime: Date.now(),
    compilation: {
      assets: Object.fromEntries(Object.entries(files).map(([name, text]) => [`srv/resources/${name}`, {buffer: () => Buffer.from(text), size: () => Buffer.byteLength(text)}])),
      emittedAssets: new Set(Object.keys(files).map(name => `srv/resources/${name}`)),
    },
  });
  return {build, events, getAssets};
}

test('resource compiler index uses public byte sizes and updates lengths on changes', () => {
  const app = start();
  app.build({'ds_test/a.txt': 'one'});
  assert.equal(app.getAssets()['ds_test/a.txt'].content_length, 3);
  app.build({'ds_test/a.txt': 'longer Привет'});
  assert.equal(app.getAssets()['ds_test/a.txt'].content_length, Buffer.byteLength('longer Привет'));
  assert.equal(app.events.at(-1).messages[0].payload.content_length, Buffer.byteLength('longer Привет'));
});

test('failed compilation preserves the last valid index and emits no resource deletion', () => {
  const app = start();
  app.build({'ds_test/a.txt': 'one'});
  const count = app.events.length;
  app.build({}, true);
  assert.equal(app.getAssets()['ds_test/a.txt'].content_length, 3);
  assert.equal(app.events.length, count);
  app.build({});
  assert.equal(app.getAssets()['ds_test/a.txt'], undefined);
  assert.equal(app.events.at(-1).messages[0].type, 'DELETE_RESOURCES');
});

test('disabled resource sync never publishes local resource index events', () => {
  const app = start(false);
  app.build({'ds_test/a.txt': 'one'});
  assert.deepEqual(app.events, []);
});
