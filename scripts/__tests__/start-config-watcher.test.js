const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const SourceLocal = require('../platforms/SourceLocal');
const source = fs.readFileSync(path.join(__dirname, '../start.js'), 'utf8');

async function fixture(t) {
  const root = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'bi-watcher-'));
  t.after(() => fs.promises.rm(root, {recursive: true, force: true}));
  const src = path.join(root, 'src');
  const put = async (relative, value) => {
    const full = path.join(src, relative);
    await fs.promises.mkdir(path.dirname(full), {recursive: true});
    await fs.promises.writeFile(full, JSON.stringify(value));
    return full;
  };
  const cube = {source_ident: 'source', name: 'sales', title: 'Before', dimensions: [{name: 'amount'}]};
  await put('ds_clowns/.cubes/source.sales.json5', cube);
  await put('ds_clowns/topic.1/index.json5', {title: 'Before'});
  const listeners = {};
  const events = [];
  let ready;
  const started = new Promise(resolve => {ready = resolve;});
  const compiler = {hooks: {done: {tap() {}}}};
  class DevServer {
    constructor(value) {this.compiler = value; this.listeningApp = {on() {}};}
    listen() {}
  }
  class RtMiddleware {
    constructor() {this._wsServer = {};}
    publishSchemaMessage(schema, messages) {events.push(...messages);}
  }
  const modules = {
    webpack: () => compiler, 'webpack-dev-server': DevServer,
    'http-proxy-middleware': {createProxyMiddleware: () => ({upgrade() {}})},
    'mime-types': {}, path, fs, crypto: require('crypto'),
    chokidar: {watch: () => ({on(event, callback) {listeners[event] = callback; if (event === 'unlink') ready();}})},
    '../webpack.config': () => ({output: {path: path.join(root, 'dist')}}),
    './lib/auth': {},
    './lib/config': {hasNoLogin: () => true, getServer: () => 'http://upstream', getPort: () => 39999,
      getOption: () => '', getJWT: () => '', hasCubes: () => true, hasResources: () => false, hasDashboards: () => true},
    './lib/utils': {filterSchemaNames: names => names, decodePath: decodeURIComponent},
    './platforms/SourceLocal': class extends SourceLocal {constructor() {super(src);}},
    './server/middlewares/resource-middleware': {},
    './server/middlewares/local-write-guard': {},
    './lib/cube-watcher': require('../lib/cube-watcher'),
    './server/middlewares': {RtMiddleware},
    './lib/dashboard-watcher': require('../lib/dashboard-watcher'),
    './lib/config-codec': require('../lib/config-codec'),
  };
  const mockedRequire = name => {
    if (!(name in modules)) throw new Error(`Unexpected dependency ${name}`);
    return modules[name];
  };
  mockedRequire.resolve = name => name;
  vm.runInNewContext(source, {require: mockedRequire, __dirname: path.join(root, 'scripts'), console: {log() {}, warn(...args) {throw new Error(args.join(' '));}, error(error) {throw error;}}, process: {exitCode: 0}});
  await started;
  return {src, put, listeners, events, cube};
}

test('format rename add-before-unlink preserves dashboard and cube browser entities', async t => {
  const f = await fixture(t);
  for (const relative of ['ds_clowns/topic.1/index', 'ds_clowns/.cubes/source.sales']) {
    const oldPath = path.join(f.src, relative + '.json5');
    const nextPath = path.join(f.src, relative + '.yaml');
    await fs.promises.rename(oldPath, nextPath);
    const value = relative.includes('.cubes') ? {...f.cube, title: 'After'} : {title: 'After'};
    await f.put(relative + '.yaml', value);
    await f.listeners.add(nextPath);
    await f.listeners.unlink(oldPath);
  }
  assert.equal(f.events.some(event => event.type.startsWith('DELETE_')), false);
  assert.equal(f.events.find(event => event.type === 'ADD_CUBES').payload.title, 'After');
  assert.equal(f.events.find(event => event.type === 'ADD_DASHBOARD_TOPICS').payload.title, 'After');
  f.events.length = 0;
  const actualCube = path.join(f.src, 'ds_clowns/.cubes/source.sales.yaml');
  await fs.promises.unlink(actualCube);
  await f.listeners.unlink(actualCube);
  assert.deepEqual(f.events.map(event => [event.type, event.payload.id]), [
    ['DELETE_DIMENSIONS', 'source.sales.amount'], ['DELETE_CUBES', 'source.sales'],
  ]);
});
