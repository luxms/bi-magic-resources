const assert = require('node:assert/strict');
const test = require('node:test');
const config = require('../lib/config');
const synchronize = require('../lib/synchronize');
const {Spinner} = require('cli-spinner');
const {SingleBar} = require('cli-progress');

function quietSync(t) {
  t.mock.method(config, 'hasOption', name => name === 'resources');
  t.mock.method(config, 'hasNoRemove', () => true);
  t.mock.method(config, 'getForce', () => true);
  t.mock.method(console, 'log', () => {});
  for (const method of ['start', 'stop']) t.mock.method(Spinner.prototype, method, () => {});
  for (const method of ['start', 'stop', 'increment']) t.mock.method(SingleBar.prototype, method, () => {});
}

function platform(type, files, writes = []) {
  return {type, resources: {
    enumerate: async () => Object.keys(files),
    getContent: async name => files[name],
    createContent: async (name, content) => { files[name] = content; writes.push({kind: 'create', name, content}); },
    updateContent: async (name, content) => { files[name] = content; writes.push({kind: 'update', name, content}); },
  }};
}

for (const [sourceType, targetType] of [['local', 'server'], ['server', 'local']]) {
  test(`${sourceType} to ${targetType}: EOL differences are ignored and changed text is written as LF`, async t => {
    quietSync(t);
    const makeMap = eol => Buffer.from(JSON.stringify({version: 3, sources: ['a.ts'], names: [], mappings: 'AAAA', sourcesContent: ['a' + eol + 'b']}));
    const sourceFiles = {
      '/ds_res/same.js': Buffer.from('a\r\nb\r\n'),
      '/ds_res/old.txt': Buffer.from('a\nb\n'),
      '/ds_res/same.js.map': makeMap('\r\n'),
      '/ds_res/same.json': {code: 'literal\r\nvalue'},
      '/ds_res/change.css': Buffer.from('new\r\nvalue\r'),
      '/ds_res/new.txt': Buffer.from('new\r\nfile'),
      '/ds_res/change.bin': Buffer.from([0x81, 13, 10]),
      '/ds_res/data.json': {code: 'new\r\nvalue'},
    };
    const targetFiles = {
      '/ds_res/same.js': Buffer.from('a\nb\n'),
      '/ds_res/old.txt': Buffer.from('a\r\nb\r\n'),
      '/ds_res/same.js.map': makeMap('\n'),
      '/ds_res/same.json': {code: 'literal\r\nvalue'},
      '/ds_res/change.css': Buffer.from('old\nvalue\n'),
      '/ds_res/change.bin': Buffer.from([0x80, 13, 10]),
      '/ds_res/data.json': {code: 'new\nvalue'},
    };
    const writes = [];
    const source = platform(sourceType, sourceFiles);
    const target = platform(targetType, targetFiles, writes);
    if (targetType === 'local') target.BASE_DIR = require('node:os').tmpdir();
    await synchronize(source, target);
    assert.deepEqual(writes.map(item => item.name).sort(), ['/ds_res/change.bin', '/ds_res/change.css', '/ds_res/data.json', '/ds_res/new.txt']);
    assert.equal(targetFiles['/ds_res/change.css'].toString(), 'new\nvalue\n');
    assert.equal(targetFiles['/ds_res/new.txt'].toString(), 'new\nfile');
    assert.equal(targetFiles['/ds_res/old.txt'].toString(), 'a\r\nb\r\n', 'EOL-only differences must not rewrite existing files');
    assert.deepEqual(targetFiles['/ds_res/change.bin'], sourceFiles['/ds_res/change.bin']);
    assert.deepEqual(targetFiles['/ds_res/data.json'], sourceFiles['/ds_res/data.json']);
    writes.length = 0;
    await synchronize(source, target);
    assert.equal(writes.length, 0, 'repeated synchronization should have no changes');
  });
}
