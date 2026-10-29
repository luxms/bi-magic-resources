const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const transferSource = fs.readFileSync(path.join(__dirname, '../lib/transfer-dist.js'), 'utf8');

function transferFixture() {
  const calls = [];
  class Local {
    constructor(dir) { this.type = 'local'; this.BASE_DIR = '/fixture/dist'; calls.push(`local:${dir}`); }
  }
  class Server {
    constructor() { this.type = 'server'; calls.push('server'); }
  }
  const modules = {
    fs: {promises: {mkdir: async dir => { calls.push(`mkdir:${dir}`); }}},
    '../platforms/Server': Server,
    '../platforms/Local': Local,
    './synchronize': async (source, target) => { calls.push(`sync:${source.type}->${target.type}`); return {status: 'applied'}; },
    './restore': {assertNoSymlinks: async dir => { calls.push(`check:${dir}`); }},
  };
  const module = {exports: {}};
  vm.runInNewContext(transferSource, {require: name => modules[name], module});
  return {transfer: module.exports, calls};
}

test('_push and _pull transfer the same dist in opposite directions', async () => {
  const push = transferFixture();
  await push.transfer('push');
  assert.deepEqual(push.calls, ['local:dist', 'server', 'sync:local->server']);

  const pull = transferFixture();
  await pull.transfer('pull');
  assert.deepEqual(pull.calls, ['local:dist', 'server', 'check:/fixture/dist', 'mkdir:/fixture/dist', 'sync:server->local']);
});

test('_pull command transfers dist without restoring src', async () => {
  const source = fs.readFileSync(path.join(__dirname, '../_pull.js'), 'utf8');
  const calls = [];
  const modules = {
    './lib/auth': {init: callback => callback()},
    './lib/transfer-dist': direction => { calls.push(direction); },
  };
  vm.runInNewContext(source, {require: name => modules[name]});
  assert.deepEqual(calls, ['pull']);
});
