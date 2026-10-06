const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const webpack = require('webpack');
const SourceArtifactsPlugin = require('../webpack/SourceArtifactsPlugin');
const createConfig = require('../../webpack.config');

const repo = path.resolve(__dirname, '../..');
const fixtures = {
  'Probe.tsx': 'import React from "react";\nimport "./style.scss";\nimport "./plain.css";\nimport icon from "./icon.svg";\nimport woff from "./font.woff";\nimport woff2 from "./font.woff2";\nimport ttf from "./font.ttf";\nimport eot from "./font.eot";\n// comment\nexport default () => <img src={icon} data-fonts={[woff, woff2, ttf, eot].join(",")} />;\n',
  'plain.js': 'const first = 1;\nconst second = 2;\n',
  'plain.css': '.plain {\n  color: red;\n}\n',
  'style.scss': '@use "colors";\n.styled {\n  color: colors.$color;\n}\n',
  '_colors.scss': '$color: blue;\n.partial {\n  color: $color;\n}\n',
  'data.json': '{\n  "code": "a\\r\\nb"\n}\n',
  'icon.svg': '<svg xmlns="http://www.w3.org/2000/svg">\n<path d="M0 0"/>\n</svg>\n',
};
const binary = Buffer.from([0, 0x80, 13, 10, 0xff]);

async function build(scratch, mode, eol) {
  const sourceDir = path.join(scratch, 'src/ds_res');
  await fs.mkdir(sourceDir, {recursive: true});
  for (const [name, text] of Object.entries(fixtures)) {
    await fs.writeFile(path.join(sourceDir, name), text.replace(/\n/g, eol));
  }
  await fs.writeFile(path.join(sourceDir, 'opaque.bin'), binary);
  for (const extension of ['woff', 'woff2', 'ttf', 'eot']) {
    await fs.writeFile(path.join(sourceDir, `font.${extension}`), binary);
  }
  const prefix = mode === 'production' ? '' : 'srv/resources/';
  const baseConfig = createConfig({build: mode === 'production'});
  const config = {
    ...baseConfig, mode, context: scratch, cache: false,
    entry: {[`${prefix}ds_res/Probe`]: './src/ds_res/Probe.tsx'},
    output: {...baseConfig.output, path: path.join(scratch, 'dist'), clean: true},
    resolve: {...baseConfig.resolve, modules: [path.join(repo, 'node_modules'), path.join(scratch, 'src')]},
    resolveLoader: {modules: [path.join(repo, 'node_modules')]},
    module: {rules: baseConfig.module.rules.map(rule => rule.use?.loader === 'babel-loader' ? {
      ...rule, use: {loader: require.resolve('babel-loader'), options: {babelrc: false, configFile: path.join(repo, '.babelrc')}},
    } : rule)},
    plugins: baseConfig.plugins.map(plugin => plugin instanceof SourceArtifactsPlugin ? new SourceArtifactsPlugin({
      src: path.join(scratch, 'src'), schemas: () => ['ds_res'], production: mode === 'production',
    }) : plugin),
  };
  const compiler = webpack(config);
  try {
    await new Promise((resolve, reject) => compiler.run((error, stats) => {
      if (error) return reject(error);
      if (stats.hasErrors()) return reject(new Error(stats.toString({all: false, errors: true})));
      resolve();
    }));
  } finally {
    await new Promise((resolve, reject) => compiler.close(error => error ? reject(error) : resolve()));
  }
  const assets = {};
  async function readAssets(dir) {
    for (const entry of await fs.readdir(dir, {withFileTypes: true})) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) await readAssets(file);
      else assets[path.relative(config.output.path, file).split(path.sep).join('/')] = await fs.readFile(file);
    }
  }
  await readAssets(config.output.path);
  return assets;
}

for (const mode of ['production', 'development']) {
  test(`${mode} build produces identical assets from LF and CRLF input`, async t => {
    const scratch = await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(), 'bi-eol-build-')));
    t.after(async () => {
      assert.equal(path.dirname(path.resolve(scratch)), await fs.realpath(os.tmpdir()));
      assert.ok(path.basename(scratch).startsWith('bi-eol-build-'));
      await fs.rm(scratch, {recursive: true, force: true});
    });
    const lf = await build(scratch, mode, '\n');
    const crlf = await build(scratch, mode, '\r\n');
    assert.deepEqual(Object.keys(crlf).sort(), Object.keys(lf).sort());
    for (const name of Object.keys(lf)) assert.deepEqual(crlf[name], lf[name], name);
    const prefix = mode === 'production' ? '' : 'srv/resources/';
    assert.deepEqual(crlf[`${prefix}ds_res/opaque.bin`], binary);
    const bundle = crlf[`${prefix}ds_res/Probe.js`].toString();
    const fontUrls = [...bundle.matchAll(/"(srv\/resources\/[^"]+\/font\.(?:woff2?|ttf|eot))"/g)].map(match => match[1]);
    assert.deepEqual(fontUrls.sort(), ['eot', 'ttf', 'woff', 'woff2'].map(extension => `srv/resources/ds_res/font.${extension}`));
    for (const url of fontUrls) {
      const assetPath = mode === 'production' ? url.replace(/^srv\/resources\//, '') : url;
      assert.deepEqual(crlf[assetPath], binary, `font URL must resolve to emitted asset: ${url}`);
    }
    assert.deepEqual(JSON.parse(crlf[`${prefix}ds_res/data.json`]), {code: 'a\r\nb'});
    assert.equal(await fs.readFile(path.join(scratch, 'src/ds_res/Probe.tsx'), 'utf8'), fixtures['Probe.tsx'].replace(/\n/g, '\r\n'), 'building must not rewrite source files');
    const sourceMap = JSON.parse(crlf[`${prefix}ds_res/Probe.js.map`]);
    assert.ok(sourceMap.sourcesContent.every(content => content == null || !content.includes('\r')));
  });
}
