const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const webpack = require('webpack');
const Plugin = require('../webpack/SourceArtifactsPlugin');
const {sha256, hashConfig, validateRelativePath} = require('../lib/artifact-manifest');
const {stringifyConfig} = require('../lib/config-codec');

async function fixture(t, files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'source-build-'));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const src = path.join(root, 'src');
  const schema = path.join(src, 'ds_test');
  fs.mkdirSync(schema, {recursive: true});
  for (const [file, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(schema, file)), {recursive: true});
    fs.writeFileSync(path.join(schema, file), content);
  }
  const plugin = new Plugin({src, schemas: () => ['ds_test'], production: true});
  const config = {mode: 'production', context: root, entry: () => plugin.entries(),
    devtool: 'source-map', optimization: {minimize: false},
    resolve: {extensions: ['.jsx', '.js', '.json']},
    output: {path: path.join(root, 'dist'), filename: '[name].js', library: {type: 'umd', name: 'test'}},
    plugins: [plugin]};
  return {root, src, schema, plugin, config, build: () => new Promise((resolve, reject) => {
    const compiler = webpack(config);
    compiler.run((error, stats) => compiler.close(() => {
      if (error) return reject(error);
      if (stats.hasErrors()) return reject(new Error(stats.toString({all: false, errors: true})));
      resolve(path.join(root, 'dist', 'ds_test'));
    }));
  })};
}
test('configs compile, exact originals and transitive helper sources are packaged', async t => {
  const files = {
    'main.jsx': "import {value} from './helper.jsx'; export default value;",
    'helper.jsx': 'export const value = 42;',
    '.bi-build.json': JSON.stringify({version: 1, entries: ['main.jsx'], bundledSources: ['main.jsx', 'helper.jsx']}),
    'topic.1/index.json5': '// keep me\n{title: "Test", trailing: [1,],}',
    'topic.1/dashboard.2/index.yaml': 'title: Hello\nconfig: {}\n',
    'plain.js': 'window.oldResource = true;',
    'asset.bin': Buffer.from([0, 255, 1]),
    'package.json': '{"name":"unchanged"}',
  };
  const f = await fixture(t, files), dist = await f.build();
  assert.equal(fs.existsSync(path.join(dist, 'helper.js')), false);
  assert.equal(fs.existsSync(path.join(dist, '.bi-build.json')), false);
  assert.equal(fs.readFileSync(path.join(dist, 'plain.js'), 'utf8'), files['plain.js']);
  assert.deepEqual(fs.readFileSync(path.join(dist, 'asset.bin')), files['asset.bin']);
  const pkg = JSON.parse(fs.readFileSync(path.join(dist, '_sources.json')));
  const bundle = pkg.artifacts.find(x => x.kind === 'bundle');
  assert.deepEqual(bundle.entries, ['main.jsx']);
  assert.deepEqual(bundle.sources.map(x => x.path).sort(), ['helper.jsx', 'main.jsx']);
  for (const output of bundle.outputs) assert.equal(output.hash, sha256(fs.readFileSync(path.join(dist, output.path))));
  const config = pkg.artifacts.find(x => x.sources[0].path === 'topic.1/index.json5');
  assert.equal(config.sources[0].content, files['topic.1/index.json5']);
  assert.equal(config.outputs[0].hash, hashConfig(JSON.parse(fs.readFileSync(path.join(dist, 'topic.1/index.json')))));
  assert.equal(JSON.parse(fs.readFileSync(path.join(dist, 'topic.1/dashboard.2/index.json'))).title, 'Hello');
});
test('rejects duplicate config output and reserved sidecar', async t => {
  const f = await fixture(t, {'topic.1/index.json5': '{}', 'topic.1/index.yaml': '{}'});
  await assert.rejects(f.build(), /Duplicate resource output/);
  const g = await fixture(t, {'_sources.json': '{}'});
  await assert.rejects(g.build(), /Reserved resource path/);
});
test('generated topic and cube .json JSON5 source compiles to strict JSON and packages exact text', async t => {
  const values = {'topic.1/index.json': {title: 'Topic'}, '.cubes/source.sales.json': {title: 'Sales'}};
  const files = Object.fromEntries(Object.entries(values).map(([name, value]) => [name, stringifyConfig(value, name)]));
  files['data.json'] = '{ "resource" : true }\r\n';
  const f = await fixture(t, files), dist = await f.build();
  const pkg = JSON.parse(fs.readFileSync(path.join(dist, '_sources.json')));
  for (const [name, value] of Object.entries(values)) {
    assert.match(files[name], /title:/);
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dist, name))), value);
    assert.equal(pkg.artifacts.find(artifact => artifact.sources[0].path === name).sources[0].content, files[name]);
  }
  assert.equal(fs.readFileSync(path.join(dist, 'data.json'), 'utf8'), files['data.json']);
});
test('rejects ready JS colliding with a compiled entry', async t => {
  const f = await fixture(t, {'main.jsx': 'export default 1;', 'main.js': 'old compiled resource'});
  await assert.rejects(f.build(), /collides with compiled output/);
});
test('inventory refreshes entries and rejects symlinks', async t => {
  const f = await fixture(t, {'main.jsx': 'export default 1;'});
  assert.equal(Object.keys(f.plugin.entries()).length, 1);
  fs.writeFileSync(path.join(f.schema, 'new.jsx'), 'export default 2;');
  assert.equal(Object.keys(f.plugin.entries()).length, 2);
  fs.symlinkSync(path.join(f.schema, 'main.jsx'), path.join(f.schema, 'link.jsx'));
  assert.throws(() => f.plugin.entries(), /symlinks/);
});
test('artifact paths reject traversal and private files', () => {
  for (const input of ['../x', '/tmp/x', 'x/../y', 'x\\y', '.env', 'a/.env.local', 'authConfig.json', 'node_modules/x', '.bi-build.json', '_sources.json']) {
    assert.throws(() => validateRelativePath(input), /Unsafe/);
  }
});
test('packages exact TSX and Sass sources while preserving binary assets', async t => {
  const f = await fixture(t, {
    'main.tsx': "import {value} from './helper'; import './styles.scss'; import image from './image.png'; export default {value, image};",
    'helper.tsx': 'export const value: number = 3;',
    'styles.scss': '@use "./colors"; .test {color: colors.$color}',
    '_colors.scss': '$color: red;',
    'image.png': Buffer.from([0x89, 0x50, 0x4e, 0x47]),
    '.bi-build.json': JSON.stringify({version: 1, entries: ['main.tsx'], bundledSources: ['main.tsx', 'helper.tsx', 'styles.scss', '_colors.scss']}),
  });
  f.config.resolve.extensions.unshift('.tsx');
  f.config.resolveLoader = {modules: [path.resolve(__dirname, '../../node_modules')]};
  f.config.module = {rules: [
    {test: /\.tsx$/, use: {loader: require.resolve('babel-loader'), options: {babelrc: false, configFile: false, presets: [require.resolve('@babel/preset-typescript')]}}},
    {test: /\.scss$/, use: [require.resolve('style-loader'), require.resolve('css-loader'), require.resolve('sass-loader')]},
    {test: /\.png$/, type: 'asset/resource', generator: {filename: 'ds_test/[name][ext]'}},
  ]};
  const dist = await f.build();
  const pkg = JSON.parse(fs.readFileSync(path.join(dist, '_sources.json')));
  const bundle = pkg.artifacts.find(x => x.kind === 'bundle');
  assert.deepEqual(bundle.sources.map(x => x.path).sort(), ['_colors.scss', 'helper.tsx', 'main.tsx', 'styles.scss']);
  assert.equal(bundle.sources.find(x => x.path === 'styles.scss').content, '@use "./colors"; .test {color: colors.$color}');
  assert.equal(bundle.outputs.some(x => x.path === 'image.png'), false);
  assert.deepEqual(fs.readFileSync(path.join(dist, 'image.png')), Buffer.from([0x89, 0x50, 0x4e, 0x47]));
});
test('rejects local dependencies outside the schema and unowned dynamic chunks', async t => {
  const f = await fixture(t, {'main.jsx': "import value from '../shared.js'; export default value;"});
  fs.writeFileSync(path.join(f.src, 'shared.js'), 'export default 1;');
  await assert.rejects(f.build(), /Cross-schema or external local source/);
  const g = await fixture(t, {'main.jsx': "export default () => import('./lazy.js');", 'lazy.js': 'export default 2;'});
  await assert.rejects(g.build(), /shared\/dynamic chunks are unsupported/);
});

test('ready JSON-like resources are opaque bytes and same-stem names coexist', async t => {
  const resources = {
    'data.json': Buffer.from([0xff, 0x7b, 0x00]),
    'data.json5': '// incomplete JSON5\n{broken:',
    'data.yaml': '!!unknown malformed: [',
    'data.yml': 'other: *undefined-alias',
    'nested/data.json': '{ invalid JSON',
    'topic.notes/data.json5': 'not a numeric topic; opaque',
  };
  const f = await fixture(t, {...resources, 'topic.1/index.json5': '{title:"config",}', '.cubes/example.yaml': 'enabled: true'});
  const dist = await f.build();
  for (const [name, content] of Object.entries(resources)) {
    assert.deepEqual(fs.readFileSync(path.join(dist, name)), Buffer.from(content), name);
  }
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dist, 'topic.1/index.json'))), {title: 'config'});
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dist, '.cubes/example.json'))), {enabled: true});
  const pack = JSON.parse(fs.readFileSync(path.join(dist, '_sources.json')));
  assert.equal(pack.artifacts.length, 2);
  assert.ok(pack.artifacts.every(artifact => artifact.kind === 'config'));
});
