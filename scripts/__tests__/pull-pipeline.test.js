const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const source = fs.readFileSync(path.join(__dirname, '../pull.js'), 'utf8');

function runPull(synchronize) {
  const actions = [];
  let completion;
  class Local { constructor(dir) { actions.push(`local:${dir}`); this.BASE_DIR = '/fixture/dist'; } }
  const modules = {
    fs: {promises: {mkdir: async () => { actions.push('mkdir'); }}},
    path,
    './platforms/Server': class {},
    './platforms/Local': Local,
    './lib/synchronize': async (...args) => { actions.push('sync'); return synchronize(...args); },
    './lib/auth': {init: callback => { completion = callback(); }},
    './lib/config': {
      getServer: () => 'http://test', getInclude: () => '^ds_test$', getExclude: () => '',
      hasResources: () => true, hasDashboards: () => false, hasCubes: () => false, hasNoRemove: () => true,
    },
    './lib/restore': {assertNoSymlinks: async () => {}, restore: async options => { actions.push(options); }},
  };
  vm.runInNewContext(source, {require: name => modules[name], __dirname: '/fixture/scripts'});
  return {actions, completion};
}

test('pull cancellation and failed download never start restore', async () => {
  const cancelled = runPull(async () => ({status: 'cancelled', paths: []}));
  await cancelled.completion;
  assert.deepEqual(cancelled.actions, ['local:dist', 'mkdir', 'sync']);
  const failure = runPull(async () => { throw new Error('download failed'); });
  await assert.rejects(failure.completion, /download failed/);
  assert.deepEqual(failure.actions, ['local:dist', 'mkdir', 'sync']);
});

test('successful and unchanged downloads pass exact inventory and options to restore', async () => {
  for (const status of ['applied', 'nochanges']) {
    const run = runPull(async () => ({status, paths: ['/ds_test/a.js']}));
    await run.completion;
    const options = run.actions[3];
    assert.equal(options.rootDir, '/fixture');
    assert.equal(options.noRemove, true);
    assert.equal(options.dashboards, false);
    assert.equal(options.server, 'http://test');
    assert.deepEqual(options.paths, ['/ds_test/a.js']);
  }
});
