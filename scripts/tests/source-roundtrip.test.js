const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const webpack = require('webpack');
const Plugin = require('../webpack/SourceArtifactsPlugin');
const {restore} = require('../lib/restore');
const {parseConfig} = require('../lib/config-codec');

function put(root, name, content) {
  fs.mkdirSync(path.dirname(path.join(root, name)), {recursive: true});
  fs.writeFileSync(path.join(root, name), content);
}
function build(root) {
  const plugin = new Plugin({src: path.join(root, 'src'), schemas: () => ['ds_test'], production: true});
  const config = {mode: 'production', context: root, entry: () => plugin.entries(),
    devtool: 'source-map', optimization: {minimize: false},
    resolve: {extensions: ['.tsx', '.js']},
    output: {path: path.join(root, 'dist'), filename: '[name].js', library: {type: 'umd', name: 'fixture'}},
    module: {rules: [
      {test: /\.tsx$/, use: {loader: require.resolve('babel-loader'), options: {babelrc: false, configFile: false, presets: [require.resolve('@babel/preset-typescript')]}}},
      {test: /\.scss$/, use: [require.resolve('style-loader'), require.resolve('css-loader'), require.resolve('sass-loader')]},
      {test: /\.png$/, type: 'asset/resource', generator: {filename: 'ds_test/[name][ext]'}},
    ]}, plugins: [plugin]};
  return new Promise((resolve, reject) => {
    const compiler = webpack(config);
    compiler.run((error, stats) => compiler.close(() => {
      if (error) return reject(error);
      if (stats.hasErrors()) return reject(new Error(stats.toString({all: false, errors: true})));
      resolve();
    }));
  });
}
async function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'source-roundtrip-'));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const original = {
    'main.tsx': "import {value} from './helper'; import './styles.scss'; import image from './image.png'; export default {value, image};",
    'helper.tsx': 'export const value: number = 7;',
    'styles.scss': '@use "./colors"; .fixture {color: colors.$color}',
    '_colors.scss': '$color: red;',
    'image.png': Buffer.from([137, 80, 78, 71]),
    'legacy.js': 'window.legacy = true;',
    'legacy.js.map': '{}',
    'data.json': Buffer.from([0xff, 0x7b, 0x00]),
    'data.json5': '// incomplete JSON5\n{broken:',
    'data.yaml': '!!unknown malformed: [',
    'data.yml': 'other: *undefined-alias',
    'nested/data.json': '{ invalid JSON',
    'topic.notes/data.json5': 'not a numeric topic; opaque',
    'topic.1/index.json5': '// topic comment\n{title: "Topic",}',
    'topic.1/dashboard.2/index.yaml': '# dashboard comment\ntitle: Dashboard\nconfig: {}\n',
    '.cubes/example.json5': '// cube comment\n{enabled: true,}',
    '.bi-build.json': JSON.stringify({version: 1, entries: ['main.tsx'], bundledSources: ['main.tsx', 'helper.tsx', 'styles.scss', '_colors.scss']}),
  };
  for (const [name, content] of Object.entries(original)) put(root, 'src/ds_test/' + name, content);
  await build(root);
  fs.rmSync(path.join(root, 'src'), {recursive: true});
  const run = options => restore({rootDir: root, server: 'http://fixture', log() {}, ...options});
  return {root, original, run};
}
test('compile -> restore -> compile preserves source text, configs, assets and bundle entry ownership', async t => {
  const {root, original, run} = await fixture(t);
  await run();
  for (const [name, content] of Object.entries(original)) {
    if (name === '.bi-build.json') continue;
    assert.deepEqual(fs.readFileSync(path.join(root, 'src/ds_test', name)), Buffer.from(content), name);
  }
  const meta = JSON.parse(fs.readFileSync(path.join(root, 'src/ds_test/.bi-build.json')));
  assert.deepEqual(meta.entries, ['main.tsx']);
  fs.rmSync(path.join(root, 'dist'), {recursive: true});
  await build(root);
  assert.equal(fs.existsSync(path.join(root, 'dist/ds_test/helper.js')), false);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root, 'dist/ds_test/topic.1/index.json'))), {title: 'Topic'});
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root, 'dist/ds_test/topic.1/dashboard.2/index.json'))), {title: 'Dashboard', config: {}});
  assert.deepEqual(fs.readFileSync(path.join(root, 'dist/ds_test/image.png')), original['image.png']);
  for (const name of ['data.json', 'data.json5', 'data.yaml', 'data.yml', 'nested/data.json', 'topic.notes/data.json5']) {
    assert.deepEqual(fs.readFileSync(path.join(root, 'dist/ds_test', name)), Buffer.from(original[name]), name);
  }
});
test('repeat pull keeps local comments and changes; partial categories do not import others', async t => {
  const {root, run} = await fixture(t);
  await run({resources: false, cubes: false, dashboards: true});
  assert.equal(fs.existsSync(path.join(root, 'src/ds_test/main.tsx')), false);
  assert.equal(fs.existsSync(path.join(root, 'src/ds_test/.cubes/example.json5')), false);
  const topicPath = 'src/ds_test/topic.1/index.json';
  const text = '// extra local note\n{title:"Topic"}\n';
  put(root, topicPath, text);
  await run();
  assert.equal(fs.readFileSync(path.join(root, topicPath), 'utf8'), text);
  put(root, 'src/ds_test/helper.tsx', 'export const value: number = 99;');
  await run();
  assert.equal(fs.readFileSync(path.join(root, 'src/ds_test/helper.tsx'), 'utf8'), 'export const value: number = 99;');
  // A config-only pull has no resource sidecar: first import uses JSON5 in .json.
  const config = fs.readFileSync(path.join(root, 'src/ds_test/topic.1/dashboard.2/index.json'), 'utf8');
  assert.deepEqual(parseConfig(config, 'index.json'), {title: 'Dashboard', config: {}});
});

test('legacy project upgrade keeps existing JSON paths and bytes, supports edits and protects pull conflicts', async t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'legacy-config-upgrade-'));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const SourceLocal = require('../platforms/SourceLocal');
  const configs = {
    'topic.1/index.json': {title: 'Legacy topic'},
    'topic.1/dashboard.2/index.json': {title: 'Legacy dashboard', topic_id: 1, config: {}},
    'topic.1/dashboard.2/3.json': {title: 'Legacy dashlet', dashboard_id: 2, config: {enabled: true}},
    '.cubes/source.cube.json': {source_ident: 'source', name: 'cube', config: {}, dimensions: [{name: 'value', config: {}}]},
  };
  const run = () => restore({rootDir: root, server: 'http://legacy-fixture', resources: false, log() {}});
  for (const [name, value] of Object.entries(configs)) {
    // Old projects have no .bi-sync baseline; formatting is intentionally different.
    put(root, `src/ds_test/${name}`, JSON.stringify(value, null, 4));
    put(root, `dist/ds_test/${name}`, JSON.stringify(value));
  }
  const opaque = '{"ordinary":"resource"}\n';
  put(root, 'src/ds_test/options.json', opaque);
  await run();
  for (const [name, value] of Object.entries(configs)) {
    assert.equal(fs.readFileSync(path.join(root, 'src/ds_test', name), 'utf8'), JSON.stringify(value, null, 4));
    assert.equal(fs.existsSync(path.join(root, 'src/ds_test', name.replace(/\.json$/, '.json5'))), false);
  }
  const local = new SourceLocal(path.join(root, 'src'));
  for (const [name, value] of Object.entries(configs)) {
    const logical = `/ds_test/${name}`;
    assert.deepEqual(await local.readFile(logical), value);
    await local.writeFile(logical, value);
    assert.equal(fs.readFileSync(path.join(root, 'src', logical), 'utf8'), JSON.stringify(value, null, 4));
    await local.writeFile(logical, {...value, title: 'Local edit'});
    assert.deepEqual(await local.readFile(logical), {...value, title: 'Local edit'});
  }
  await run(); // unchanged server must preserve all local edits
  for (const name of Object.keys(configs)) assert.equal((await local.readFile(`/ds_test/${name}`)).title, 'Local edit');
  put(root, 'dist/ds_test/topic.1/index.json', JSON.stringify({title: 'Remote edit'}));
  await assert.rejects(run(), /Restore conflicts/);
  assert.equal((await local.readFile('/ds_test/topic.1/index.json')).title, 'Local edit');
  await build(root);
  for (const [name, value] of Object.entries(configs)) {
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root, 'dist/ds_test', name), 'utf8')), {...value, title: 'Local edit'});
  }
  assert.equal(fs.readFileSync(path.join(root, 'dist/ds_test/options.json'), 'utf8'), opaque);
});
