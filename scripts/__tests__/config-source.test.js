const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { isConfigPath, toLogicalPath, parseConfig, stringifyConfig, canonicalJson } = require('../lib/config-codec');
const SourceLocal = require('../platforms/SourceLocal');
const { parseDashboardPath, makeDashboardRtMessage } = require('../lib/dashboard-watcher');

async function fixture(t) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'bi-source-config-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const local = new SourceLocal(directory);
  const write = async (name, text) => {
    const file = path.join(directory, name);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, text);
  };
  return { directory, local, write };
}

test('config scope is limited to numbered topics and cubes for every supported extension', () => {
  assert.equal(isConfigPath('ds_a/package.json'), false);
  assert.equal(isConfigPath('ds_a/topic.3/index.json'), true);
  assert.equal(isConfigPath('ds_a/.cubes/source.name.json'), true);
  for (const extension of ['json', 'json5', 'yaml', 'yml']) {
    assert.equal(isConfigPath(`ds_a/theme.${extension}`), false);
    assert.equal(isConfigPath(`ds_a/topic.custom/index.${extension}`), false);
    assert.equal(isConfigPath(`ds_a/topic.3/index.${extension}`), true);
    assert.equal(isConfigPath(`ds_a/.cubes/source.sales.${extension}`), true);
    assert.equal(toLogicalPath(`ds_a/theme.${extension}`), `ds_a/theme.${extension}`);
  }
  assert.equal(toLogicalPath('ds_a\\topic.3\\index.json5'), 'ds_a/topic.3/index.json');
  assert.equal(toLogicalPath('ds_a/package.json'), 'ds_a/package.json');
});

test('JSON5 and YAML compile to the same canonical JSON, retaining JSON types', () => {
  const a = parseConfig("{ // note\n label: 'hello', count: 2, values: [true, null,], }", 'test.json5');
  const b = parseConfig('values: [true, null]\ncount: 2\nlabel: hello\n', 'test.yaml');
  assert.equal(canonicalJson(a), canonicalJson(b));
  for (const extension of ['json', 'json5', 'yaml', 'yml']) {
    assert.deepEqual(parseConfig(stringifyConfig(a, 'test.' + extension), 'test.' + extension), a);
  }
  assert.equal(parseConfig('date: 2025-01-01\n', 'test.yaml').date, '2025-01-01');
});

test('only entity .json serialization uses JSON5', () => {
  const value = { title: 'Hello', enabled: true };
  for (const name of ['ds_test/topic.1/index.json', 'ds_test/.cubes/source.sales.json']) {
    const text = stringifyConfig(value, name);
    assert.match(text, /title: 'Hello'/);
    assert.deepEqual(parseConfig(text, name), value);
    assert.throws(() => JSON.parse(text));
  }
  for (const name of ['ds_test/data.json', 'ds_test/topic.notes/index.json']) {
    assert.deepEqual(JSON.parse(stringifyConfig(value, name)), value);
  }
});

test('new topic and cube .json files use JSON5 and preserve exact comments on no-op writes', async t => {
  const { local, directory, write } = await fixture(t);
  for (const name of ['ds_test/topic.1/index.json', 'ds_test/.cubes/source.sales.json']) {
    await local.writeFile(name, { title: 'Hello' });
    assert.match(await fs.readFile(path.join(directory, name), 'utf8'), /title: 'Hello'/);
    await assert.rejects(fs.stat(path.join(directory, name + '5')), { code: 'ENOENT' });
    const original = '// handwritten\n{ title: "Hello", }\n';
    await write(name, original);
    await local.writeFile(name, { title: 'Hello' });
    assert.equal(await fs.readFile(path.join(directory, name), 'utf8'), original);
  }
});

test('explicit new JSON5 and YAML config paths retain their extensions', async t => {
  const { local, directory } = await fixture(t);
  for (const extension of ['json5', 'yaml', 'yml']) {
    const name = `ds_test/topic.1/${extension}.${extension}`;
    await local.writeFile(name, { title: 'Hello' });
    assert.deepEqual(parseConfig(await fs.readFile(path.join(directory, name), 'utf8'), name), { title: 'Hello' });
  }
});

test('rejects lossy JSON values, YAML non-string keys, duplicate keys, aliases cycles and unknown tags', () => {
  for (const text of ['{n: NaN}', '{n: Infinity}']) assert.throws(() => parseConfig(text, 'bad.json5'));
  for (const text of ['n: .nan\n', '1: value\n', 'n: 1\nn: 2\n', 'a: &a [*a]\n', 'a: !custom value\n']) {
    assert.throws(() => parseConfig(text, 'bad.yaml'), /Invalid config/);
  }
  for (const value of [undefined, { x: undefined }, { x: 1n }, new Date(), [ , 1]]) {
    assert.throws(() => canonicalJson(value));
  }
  const cycle = {}; cycle.self = cycle;
  assert.throws(() => stringifyConfig(cycle, 'bad.json5'), /cyclic/);
  assert.equal(canonicalJson(parseConfig('{__proto__: {x: 1}}', 'prototype.json5')), '{"__proto__":{"x":1}}');
});

test('manager canonical paths create/read/update/delete JSON5 configs with .json filenames in src', async t => {
  const { local, directory } = await fixture(t);
  await local.dashboards.createTopic({ schemaName: 'ds_clowns', id: 7, content: { title: 'Topic' } });
  await local.dashboards.createDashboard({ schemaName: 'ds_clowns', topicId: 7, id: 8, content: { title: 'Dashboard' } });
  await local.dashboards.createDashlet({ schemaName: 'ds_clowns', topicId: 7, dashboardId: 8, id: 9, content: { title: 'Widget' } });
  const logical = '/ds_clowns/topic.7/dashboard.8/9.json';
  assert.equal(await local.checkFileExists(logical), true);
  assert.equal(await local.checkFileExists(logical.slice(1)), true);
  assert.match(await fs.readFile(path.join(directory, logical.slice(1)), 'utf8'), /title:/);
  assert.equal((await local.dashboards.getDashboards('ds_clowns'))[0].content.title, 'Dashboard');
  assert.equal((await local.dashboards.getDashlets('ds_clowns'))[0].content.title, 'Widget');
  await local.dashboards.updateContent(logical, { title: 'Updated' });
  assert.deepEqual(await local.readFile(logical), { title: 'Updated' });
  await local.dashboards.deleteContent(logical);
  assert.equal(await local.checkFileExists(logical), false);
  assert.equal(await local.readFile(logical), null);
});

test('cube canonical paths preserve existing YAML and semantic no-op preserves exact comments', async t => {
  const { local, directory, write } = await fixture(t);
  const physical = 'ds_clowns/.cubes/source.sales.yaml';
  const original = '# handwritten\nsource_ident: source\nname: sales\ndimensions: []\n';
  await write(physical, original);
  const logical = local.cubes.createPath('ds_clowns', 'source.sales');
  assert.deepEqual(await local.cubes.enumerate('ds_clowns'), [logical]);
  const content = await local.cubes.getContent(logical);
  await local.cubes.updateContent(logical, content);
  assert.equal(await fs.readFile(path.join(directory, physical), 'utf8'), original);
  await local.cubes.updateContent(logical, { ...content, title: 'Sales' });
  assert.equal((await local.cubes.getContent(logical)).title, 'Sales');
  assert.equal(await local.checkFileExists('ds_clowns/.cubes/source.sales.json5'), true);
  assert.equal(await fs.stat(path.join(directory, physical)).then(() => true), true);
  await assert.rejects(fs.stat(path.join(directory, 'ds_clowns/.cubes/source.sales.json5')), { code: 'ENOENT' });
  await local.cubes.deleteContent(logical);
  assert.equal(await local.checkFileExists(logical), false);
});

test('resource JSON/JSON5/YAML keep their names and exact bytes independently, while metadata stays private', async t => {
  const { local, directory, write } = await fixture(t);
  const originals = {
    'theme.json': '{ "raw": true }\r\n',
    'theme.json5': '// untouched\n{ raw: true, }\n',
    'theme.yaml': '# untouched\nraw: true\n',
    'theme.yml': 'not even valid: [yaml',
    'package.json': '{"name":"widget"}',
    'topic.custom/index.json5': 'not a config: leave bytes alone',
  };
  for (const [relative, original] of Object.entries(originals)) {
    await local.writeFile('/ds_clowns/' + relative, Buffer.from(original));
    const read = await local.readFile('/ds_clowns/' + relative);
    assert.ok(Buffer.isBuffer(read));
    assert.equal(read.toString(), original);
    assert.equal(await fs.readFile(path.join(directory, 'ds_clowns', relative), 'utf8'), original);
  }
  await write('ds_clowns/.bi-build.json', '{}');
  await write('ds_clowns/_sources.json', '{}');
  assert.deepEqual((await local.getFiles('ds_clowns')).sort(), Object.keys(originals).sort());
  // The resource manager receives byte content too, so object serialization cannot leak here.
  assert.equal((await local.resources.getContent('/ds_clowns/theme.json5')).toString(), originals['theme.json5']);
  await local.resources.updateContent('/ds_clowns/theme.yaml', '# changed\nraw: false\n');
  assert.equal((await local.readFile('/ds_clowns/theme.yaml')).toString(), '# changed\nraw: false\n');
  await local.deleteFile('/ds_clowns/theme.json');
  assert.equal(await local.checkFileExists('/ds_clowns/theme.json'), false);
  assert.equal(await local.checkFileExists('/ds_clowns/theme.json5'), true);
});

test('duplicate output configs fail enumeration and every canonical operation', async t => {
  const { local, write } = await fixture(t);
  await write('ds_clowns/topic.1/index.json5', '{a:1}');
  await write('ds_clowns/topic.1/index.yaml', 'a: 1\n');
  const logical = '/ds_clowns/topic.1/index.json';
  for (const action of [() => local.getFiles('ds_clowns'), () => local.readFile(logical),
    () => local.writeFile(logical, {}), () => local.checkFileExists(logical), () => local.deleteFile(logical)]) {
    await assert.rejects(action, /Multiple sources/);
  }
});

test('invalid existing config errors rather than appearing absent or being overwritten', async t => {
  const { local, directory, write } = await fixture(t);
  await write('ds_clowns/topic.1/index.json5', '{invalid');
  await assert.rejects(local.readFile('/ds_clowns/topic.1/index.json'), /Invalid config/);
  await assert.rejects(local.writeFile('/ds_clowns/topic.1/index.json', {}), /Invalid config/);
  assert.equal(await fs.readFile(path.join(directory, 'ds_clowns/topic.1/index.json5'), 'utf8'), '{invalid');
  await assert.rejects(local.writeFile('../escape.txt', 'bad'), /Invalid source path/);
});

test('dev watcher emits the same entity messages for each physical config format', () => {
  for (const extension of ['json', 'json5', 'yaml', 'yml']) {
    assert.deepEqual(parseDashboardPath(`ds_clowns/topic.2/index.${extension}`), { kind: 'topic', schema: 'ds_clowns', id: 2 });
    const parsed = parseDashboardPath(`ds_clowns/topic.2/dashboard.3/4.${extension}`);
    assert.deepEqual(parsed, { kind: 'dashlet', schema: 'ds_clowns', id: 4, dashboard_id: 3 });
    assert.equal(makeDashboardRtMessage('change', parsed, { title: 'hello' })[0].payload.config.title, 'hello');
    assert.deepEqual(makeDashboardRtMessage('unlink', parsed)[0].payload, { id: 4, dashboard_id: 3 });
  }
});

test('source operations reject ancestor symlinks without touching the outside file', async t => {
  const { local, directory, write } = await fixture(t);
  await write('outside/index.json5', '{safe: true}');
  await fs.mkdir(path.join(directory, 'ds_clowns'));
  await fs.symlink(path.join(directory, 'outside'), path.join(directory, 'ds_clowns/topic.1'));
  const logical = '/ds_clowns/topic.1/index.json';
  for (const action of [() => local.readFile(logical), () => local.writeFile(logical, {}),
    () => local.deleteFile(logical), () => local.checkFileExists(logical),
    () => local.getFiles('ds_clowns/topic.1')]) {
    await assert.rejects(action, /Symlinks/);
  }
  assert.equal(await fs.readFile(path.join(directory, 'outside/index.json5'), 'utf8'), '{safe: true}');
});

test('existing JSON5 comments survive semantic no-op and mixed-case extensions resolve', async t => {
  const { local, directory, write } = await fixture(t);
  const source = '// retained comment\n{title: \'Hello\', config: {},}\n';
  await write('ds_clowns/topic.1/index.JSON5', source);
  const logical = '/ds_clowns/topic.1/index.json';
  await local.writeFile(logical, { config: {}, title: 'Hello' });
  assert.equal(await fs.readFile(path.join(directory, 'ds_clowns/topic.1/index.JSON5'), 'utf8'), source);
  assert.deepEqual(await local.getFiles('ds_clowns'), ['topic.1/index.json']);
});

test('an explicitly symlinked source root is rejected', async t => {
  const { directory, write } = await fixture(t);
  await write('real/ds_clowns/topic.1/index.json5', '{title: "unchanged"}');
  const alias = path.join(directory, 'linked-src');
  await fs.symlink(path.join(directory, 'real'), alias);
  const local = new SourceLocal(alias);
  await assert.rejects(local.readFile('/ds_clowns/topic.1/index.json'), /Symlinks/);
  await assert.rejects(local.getFiles('ds_clowns'), /Symlinks/);
});
