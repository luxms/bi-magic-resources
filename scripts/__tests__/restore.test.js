const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs').promises;
const os = require('os');
const path = require('path');
const { restore } = require('../lib/restore');
const { sha256, hashConfig, FORMAT } = require('../lib/artifact-manifest');

async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'bi-restore-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await fs.symlink(path.resolve(__dirname, '../../node_modules'), path.join(root, 'node_modules'));
  const put = async (name, content) => {
    await fs.mkdir(path.dirname(path.join(root, name)), { recursive: true });
    await fs.writeFile(path.join(root, name), content);
  };
  const read = name => fs.readFile(path.join(root, name), 'utf8');
  const run = opts => restore({ rootDir: root, server: 'http://test', log() {}, ...opts });
  const pack = artifacts => put('dist/ds_test/_sources.json', JSON.stringify({ format: FORMAT, version: 1, artifacts }));
  return { root, put, read, run, pack };
}
const configArtifact = (value, content = '{title: "one"}') => ({ kind: 'config', outputs: [{path: 'topic.1/index.json', hash: hashConfig(value)}], sources: [{path: 'topic.1/index.json5', content}], entries: [] });
const bundleArtifact = content => ({ kind: 'bundle', outputs: [{path: 'widget.js', hash: sha256(content)}], sources: [{path: 'widget.tsx', content: 'export default function Widget() { return null; }'}], entries: ['widget.tsx'] });

test('new server configs become JSON5 in .json files; semantic no-op preserves comments', async t => {
  const f = await fixture(t);
  await f.put('dist/ds_test/topic.1/index.json', '{"title":"one"}');
  await f.put('dist/ds_test/.cubes/source.sales.json', '{"title":"Sales"}');
  await f.run();
  assert.match(await f.read('src/ds_test/topic.1/index.json'), /title: 'one'/);
  assert.match(await f.read('src/ds_test/.cubes/source.sales.json'), /title: 'Sales'/);
  await assert.rejects(f.read('src/ds_test/.cubes/source.sales.json5'), { code: 'ENOENT' });
  assert.equal(await f.read('dist/ds_test/topic.1/index.json'), '{"title":"one"}');
  assert.equal(await f.read('dist/ds_test/.cubes/source.sales.json'), '{"title":"Sales"}');
  const edited = '// useful local comment\n{ title: "one", }\n';
  await f.put('src/ds_test/topic.1/index.json', edited);
  await f.run();
  assert.equal(await f.read('src/ds_test/topic.1/index.json'), edited);
});

test('unchanged upstream preserves edits, changed upstream conflicts before any writes', async t => {
  const f = await fixture(t);
  await f.put('dist/ds_test/a.txt', 'base');
  await f.run();
  await f.put('src/ds_test/a.txt', 'local');
  await f.run();
  assert.equal(await f.read('src/ds_test/a.txt'), 'local');
  await f.put('dist/ds_test/a.txt', 'remote');
  await f.put('dist/ds_test/new.txt', 'new');
  await assert.rejects(f.run(), /Restore conflicts/);
  assert.equal(await f.read('src/ds_test/a.txt'), 'local');
  await assert.rejects(f.read('src/ds_test/new.txt'), { code: 'ENOENT' });
});

test('legacy source packages are ignored, even malformed; configs use current server values', async t => {
  const f = await fixture(t);
  await f.put('dist/ds_test/_sources.json', 'not JSON');
  await f.put('dist/ds_test/topic.1/index.json', '{"title":"current"}');
  await f.run();
  assert.match(await f.read('src/ds_test/topic.1/index.json'), /current/);
  await assert.rejects(f.read('src/ds_test/_sources.json'), {code: 'ENOENT'});
});

test('stale bundle and unsupported maps survive as ready files', async t => {
  const f = await fixture(t);
  await f.put('dist/ds_test/widget.js', 'changed');
  await f.put('dist/ds_test/widget.js.map', JSON.stringify({version: 3, sources: ['loader!file.scss'], sourcesContent: ['generated JS']}));
  await f.pack([bundleArtifact('compiled')]);
  await f.run();
  assert.equal(await f.read('src/ds_test/widget.js'), 'changed');
  await assert.rejects(f.read('src/ds_test/widget.tsx'), {code: 'ENOENT'});
  assert.match(await f.read('src/ds_test/widget.js.map'), /loader/);
});

test('legacy single-source dependency-free map restores a declared entry', async t => {
  const f = await fixture(t);
  await f.put('dist/ds_test/widget.js', 'compiled\n//# sourceMappingURL=widget.js.map');
  await f.put('dist/ds_test/widget.js.map', JSON.stringify({version: 3, file: 'widget.js', sources: ['webpack://widget/./src/ds_test/widget.tsx'], sourcesContent: ['export default () => null;']}));
  await f.run();
  assert.equal(await f.read('src/ds_test/widget.tsx'), 'export default () => null;');
  await assert.rejects(f.read('src/ds_test/widget.js'), {code: 'ENOENT'});
});

test('remote inventory and content flags exclude stale dist and disabled sidecar configs', async t => {
  const f = await fixture(t);
  await f.put('dist/ds_test/topic.1/index.json', '{"title":"one"}');
  await f.put('dist/ds_test/stale.txt', 'stale');
  await f.put('dist/ds_other/other.txt', 'other');
  await f.pack([configArtifact({title: 'one'})]);
  await f.run({paths: ['/ds_test/_sources.json'], dashboards: false});
  await assert.rejects(f.read('src/ds_test/topic.1/index.json'), {code: 'ENOENT'});
  await assert.rejects(f.read('src/ds_test/topic.1/index.json5'), {code: 'ENOENT'});
  await assert.rejects(f.read('src/ds_test/stale.txt'), {code: 'ENOENT'});
  await assert.rejects(f.read('src/ds_other/other.txt'), {code: 'ENOENT'});
});

test('rejects symlink destinations before touching src', async t => {
  const f = await fixture(t);
  await f.put('dist/ds_test/widget.js', 'compiled');
  await fs.mkdir(path.join(f.root, 'outside'));
  await fs.mkdir(path.join(f.root, 'src'));
  await fs.symlink(path.join(f.root, 'outside'), path.join(f.root, 'src/ds_test'));
  await assert.rejects(f.run(), /Symlinks/);
  await assert.rejects(f.read('outside/widget.js'), {code: 'ENOENT'});
});

test('existing YAML remains YAML and source format collisions fail', async t => {
  const f = await fixture(t);
  const original = '# local\ntitle: one\n';
  await f.put('src/ds_test/topic.1/index.yaml', original);
  await f.put('dist/ds_test/topic.1/index.json', '{"title":"one"}');
  await f.run();
  assert.equal(await f.read('src/ds_test/topic.1/index.yaml'), original);
  await f.put('src/ds_test/topic.1/index.json5', '{title:"one"}');
  await assert.rejects(f.run(), /Config output collision/);
});

test('state is outside dist and scoped to server; deletions respect local edits', async t => {
  const f = await fixture(t);
  await f.put('dist/ds_test/a.txt', 'one');
  await f.run();
  await f.put('dist/ds_test/a.txt', 'two');
  await assert.rejects(f.run({server: 'http://other'}), /Restore conflicts/);
  await f.run();
  assert.equal(await f.read('src/ds_test/a.txt'), 'two');
  await fs.rm(path.join(f.root, 'dist'), {recursive: true});
  await f.run({paths: []});
  await assert.rejects(f.read('src/ds_test/a.txt'), {code: 'ENOENT'});
  assert.equal((await fs.readdir(path.join(f.root, '.bi-sync'))).length, 1);
});

test('incoming ready JS cannot silently shadow existing TSX', async t => {
  const f = await fixture(t);
  await f.put('dist/ds_test/widget.js', 'compiled');
  await f.put('src/ds_test/widget.tsx', 'export default () => null;');
  await assert.rejects(f.run(), /existing source collides/);
  await assert.rejects(f.read('src/ds_test/widget.js'), {code: 'ENOENT'});
});

test('noRemove preserves tracked sources absent from the current remote inventory', async t => {
  const f = await fixture(t);
  await f.put('dist/ds_test/a.txt', 'one');
  await f.run();
  await f.run({paths: [], noRemove: true});
  assert.equal(await f.read('src/ds_test/a.txt'), 'one');
  await f.run({paths: []});
  await assert.rejects(f.read('src/ds_test/a.txt'), {code: 'ENOENT'});
});

test('sourceRoot legacy maps remain ready files', async t => {
  const f = await fixture(t);
  await f.put('dist/ds_test/widget.js', 'compiled\n//# sourceMappingURL=widget.js.map');
  await f.put('dist/ds_test/widget.js.map', JSON.stringify({version: 3, file: 'widget.js', sourceRoot: 'somewhere-else', sources: ['webpack://widget/./src/ds_test/widget.tsx'], sourcesContent: ['export default () => null;']}));
  await f.run();
  assert.match(await f.read('src/ds_test/widget.js'), /compiled/);
  await assert.rejects(f.read('src/ds_test/widget.tsx'), {code: 'ENOENT'});
});

for (const matching of [true, false]) {
  test(`legacy ${matching ? 'matching' : 'stale'} resource config package is ignored and server bytes survive`, async t => {
    const f = await fixture(t);
    const current = matching ? '{\n "color" : "red"\n}\n' : '{\n "color" : "blue"\n}\n';
    await f.put('dist/ds_test/theme.json', current);
    await f.pack([{
      kind: 'config', outputs: [{path: 'theme.json', hash: hashConfig({color: 'red'})}],
      sources: [{path: 'theme.json5', content: '// original\n{ color: "red" }'}], entries: [],
    }]);
    const result = await f.run();
    assert.equal(await f.read('src/ds_test/theme.json'), current);
    await assert.rejects(f.read('src/ds_test/theme.json5'), {code: 'ENOENT'});

  });
}

test('resource JSON, JSON5, and YAML retain their paths and exact bytes', async t => {
  const f = await fixture(t);
  const resources = {
    'plain.json': Buffer.from('{\r\n "n" : 1\r\n}\r\n'),
    'plain.json5': Buffer.from('// handwritten\n{ n: 1, }\n'),
    'plain.yaml': Buffer.from('# handwritten\nn: 1\n'),
    'raw.yml': Buffer.from('not: [valid yaml'),
    'raw.json5': Buffer.from([0xff, 0xfe, 0x00, 0x7b]),
    'topic.notes/data.json5': Buffer.from('ordinary resource, not a dashboard'),
  };
  for (const [relative, bytes] of Object.entries(resources)) await f.put(`dist/ds_test/${relative}`, bytes);
  await f.run({resources: true, dashboards: false, cubes: false});
  for (const [relative, bytes] of Object.entries(resources)) {
    assert.deepEqual(await fs.readFile(path.join(f.root, 'src/ds_test', relative)), bytes);
  }
});

test('semantic equality never hides local resource formatting edits', async t => {
  const f = await fixture(t);
  await f.put('dist/ds_test/plain.json', '{"n":1}');
  await f.run();
  await f.put('src/ds_test/plain.json', '{ "n": 1 }\n');
  await f.put('dist/ds_test/plain.json', '{\n"n":1\n}');
  await f.put('dist/ds_test/new.txt', 'must not be written');
  await assert.rejects(f.run(), /Restore conflicts/);
  assert.equal(await f.read('src/ds_test/plain.json'), '{ "n": 1 }\n');
  await assert.rejects(f.read('src/ds_test/new.txt'), {code: 'ENOENT'});
});

test('resources-only restore includes nonnumeric topic-prefixed resource folders', async t => {
  const f = await fixture(t);
  const original = '// raw resource\n{enabled: true,}\n';
  await f.put('dist/ds_test/topic.notes/data.json5', original);
  await f.put('dist/ds_test/topic.1/index.json', '{"title":"disabled"}');
  await f.run({ dashboards: false });
  assert.equal(await f.read('src/ds_test/topic.notes/data.json5'), original);
  await assert.rejects(f.read('src/ds_test/topic.1/index.json'), {code: 'ENOENT'});
  await assert.rejects(f.read('src/ds_test/topic.1/index.json5'), {code: 'ENOENT'});
});

async function mapped(f, name, sources) {
  await f.put(`dist/ds_test/${name}.js`, `compiled\n//# sourceMappingURL=${path.posix.basename(name)}.js.map`);
  await f.put(`dist/ds_test/${name}.js.map`, JSON.stringify({version: 3, file: `ds_test/${name}.js`, sources: sources.map(s => s[0]), sourcesContent: sources.map(s => s[1])}));
}

test('multi-source webpack map restores entry, dependency and original nested Sass without loader wrappers', async t => {
  const f = await fixture(t);
  const style = '.foo { color: red; }';
  const nested = JSON.stringify({version:3, sources:['webpack://./src/ds_test/style.scss'],sourcesContent:[style]});
  await mapped(f, 'widget', [
    ['webpack://app/./src/ds_test/widget.tsx', "import './style.scss'; import {n} from './model'; export default n;"],
    ['webpack://app/./src/ds_test/model.ts', 'export const n: number = 1;'],
    ['webpack://app/./src/ds_test/style.scss', `___CSS_LOADER_EXPORT___.push([module.id, "css", "",${nested}]);`],
    ['webpack://app/./src/ds_test/style.scss?abcd', 'import API from "style-loader/dist/runtime/foo";'],
    ['webpack://app/./node_modules/react/index.js', 'module.exports = React;'],
  ]);
  await f.run();
  assert.equal(await f.read('src/ds_test/style.scss'), style);
  const metadata = JSON.parse(await f.read('src/ds_test/.bi-build.json'));
  assert.deepEqual(metadata.entries, ['widget.tsx']);
  assert.deepEqual(metadata.bundledSources, ['model.ts', 'style.scss', 'widget.tsx']);
  await assert.rejects(f.read('src/ds_test/widget.js'), {code:'ENOENT'});
  await f.put('src/ds_test/model.ts', 'local edit');
  await f.run();
  assert.equal(await f.read('src/ds_test/model.ts'), 'local edit');
});

for (const source of ['webpack://app/./src/ds_test/../../escape.ts', 'webpack://app/./src/ds_other/widget.tsx']) test(`unsafe/cross-atlas source keeps bundle: ${source}`, async t => {
  const f = await fixture(t);
  await mapped(f, 'widget', [[source, 'export default 1;']]);
  await f.run();
  assert.match(await f.read('src/ds_test/widget.js'), /compiled/);
});

test('different versions of shared sources from multiple bundles fail atomically', async t => {
  const f = await fixture(t);
  for (const name of ['one', 'two']) await mapped(f, name, [
    [`webpack:///./src/ds_test/${name}.tsx`, 'export default 1;'],
    ['webpack:///./src/ds_test/model.ts', `export default '${name}';`],
  ]);
  await assert.rejects(f.run(), /source collision/);
  await assert.rejects(f.read('src/ds_test/one.tsx'), {code:'ENOENT'});
});

test('incomplete style map retains executable JS rather than writing loader code as SCSS', async t => {
  const f = await fixture(t);
  await mapped(f, 'widget', [
    ['webpack:///./src/ds_test/widget.tsx', "import './style.scss';"],
    ['webpack:///./src/ds_test/style.scss', '___CSS_LOADER_EXPORT___.push([module.id, "css"]);'],
  ]);
  await f.run();
  assert.match(await f.read('src/ds_test/widget.js'), /compiled/);
  await assert.rejects(f.read('src/ds_test/style.scss'), {code:'ENOENT'});
});

test('missing imported source or bundled dependency leaves original JS/map intact', async t => {
  const f = await fixture(t);
  await mapped(f, 'widget', [['webpack:///./src/ds_test/widget.tsx', "import './missing';"]]);
  await f.run();
  assert.match(await f.read('src/ds_test/widget.js'), /compiled/);
  await mapped(f, 'widget', [
    ['webpack:///./src/ds_test/widget.tsx', 'export default 1;'],
    ['webpack:///./node_modules/nonexistent-map-dependency/index.js', 'module.exports = 1;'],
  ]);
  await f.run();
  assert.match(await f.read('src/ds_test/widget.js'), /compiled/);
  await assert.rejects(f.read('src/ds_test/widget.tsx'), {code:'ENOENT'});
});

test('Sass @use requires the original partial before replacing the working bundle', async t => {
  const f = await fixture(t);
  await mapped(f, 'widget', [
    ['webpack:///./src/ds_test/widget.tsx', "import './style.scss';"],
    ['webpack:///./src/ds_test/style.scss', "@use './colors'; .a { color: colors.$red; }"],
  ]);
  await f.run();
  assert.match(await f.read('src/ds_test/widget.js'), /compiled/);
  await assert.rejects(f.read('src/ds_test/style.scss'), {code:'ENOENT'});
});

test('project directory named webpack is restored rather than discarded as runtime', async t => {
  const f = await fixture(t);
  await mapped(f, 'widget', [
    ['webpack://app/./src/ds_test/widget.tsx', "import {n} from './webpack/helper'; export default n;"],
    ['webpack://app/./src/ds_test/webpack/helper.ts', 'export const n = 1;'],
    ['webpack://app/webpack/bootstrap', 'runtime implementation'],
  ]);
  await f.run();
  assert.equal(await f.read('src/ds_test/webpack/helper.ts'), 'export const n = 1;');
  await assert.rejects(f.read('src/ds_test/widget.js'), {code:'ENOENT'});
});

test('installed package with subpath-only exports does not require a root export', async t => {
  const f = await fixture(t);
  await fs.unlink(path.join(f.root, 'node_modules'));
  await f.put('node_modules/subpath-only/package.json', JSON.stringify({name:'subpath-only', exports:{'./feature':'./internal.js'}}));
  await f.put('node_modules/subpath-only/internal.js', 'module.exports = 1;');
  await mapped(f, 'widget', [
    ['webpack://app/./src/ds_test/widget.tsx', "import n from 'subpath-only/feature'; export default n;"],
    ['webpack://app/./node_modules/subpath-only/internal.js', 'module.exports = 1;'],
  ]);
  await f.run();
  assert.match(await f.read('src/ds_test/widget.tsx'), /subpath-only\/feature/);
  await assert.rejects(f.read('src/ds_test/widget.js'), {code:'ENOENT'});
});
