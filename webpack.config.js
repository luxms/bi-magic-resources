/* global __dirname, require, module*/

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const CopyPlugin = require("copy-webpack-plugin");
const pkg = require('./package.json');
const env = yargs.argv.env;                                                                         // use --env with webpack 2
const mode = (env === 'build') ? 'production' : 'development';
const { filterSchemaNames } = require('./scripts/lib/utils');
const JSON5 = require('json5');


function getFiles(dir, prefix = '') {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = dirents.map((dirent) => {
    return dirent.isDirectory() ? getFiles(path.resolve(dir, dirent.name), prefix + dirent.name + '/') : prefix + dirent.name;
  });
  return Array.prototype.concat(...files);
}


// наполняем объект entry записями о jsx/tsx файлах из директорий типа ds_xxx
// для development:
//  'srv/resources/ds_xxx/File': './src/ds_xxx/File.tsx',
// Для production (build)
//  'ds_xxx/File': './src/ds_xxx/File.tsx',
const entry = {};                                                                                   //  __dirname + '/src/index.js',
const SRC = path.resolve(__dirname, 'src');
const SCHEMA_NAMES = filterSchemaNames(fs.readdirSync(SRC).filter(fileName => fs.statSync(path.resolve(SRC, fileName)).isDirectory()));

SCHEMA_NAMES.forEach(schema_name => {
  const files = getFiles(path.resolve(SRC, schema_name)).filter(fileName => fileName.endsWith('.tsx') || fileName.endsWith('.jsx'));
  files.forEach(fileName => {
    const fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
    console.log(`Register file: /${schema_name}/${fileNameWithoutExtension}`);
    if (mode === 'production') {
      entry[`${schema_name}/${fileNameWithoutExtension}`] = `./src/${schema_name}/${fileName}`;
    } else {
      entry[`srv/resources/${schema_name}/${fileNameWithoutExtension}`] = `./src/${schema_name}/${fileName}`;
    }
  });
});

function json5ToJson(buffer) {
  const result = JSON.stringify(JSON5.parse(buffer.toString()), null, 2);
  return Buffer.from(result);
}


module.exports = {
  mode,
  entry,
  devtool: 'source-map',
  output: {
    publicPath: '',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: pkg.name,
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
  externals: {
    'react': 'react',
    'react-dom': 'react-dom',
    'classnames': 'classnames',
    'jquery': 'jquery',
    'axios': 'axios',
    'three': 'three',
    '@react-three/fiber': '@react-three/fiber',
    '@react-three/drei': '@react-three/drei',
    'bi-internal': 'bi-internal',
    'bi-internal/font': 'bi-internal/font',
    'bi-internal/core': 'bi-internal/core',
    'bi-internal/face': 'bi-internal/face',
    'bi-internal/root': 'bi-internal/root',
    'bi-internal/types': 'bi-internal/types',
    'bi-internal/shell': 'bi-internal/shell',
    'bi-internal/services': 'bi-internal/services',
    'bi-internal/utils': 'bi-internal/utils',
    'bi-internal/ds-helpers': 'bi-internal/ds-helpers',
    'bi-internal/ui': 'bi-internal/ui',
  },
  optimization:{
    minimize: false,                                                                                // disables uglify
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js|\.ts|\.tsx)$/,
        use: {
          loader: 'babel-loader',
        },
        exclude: /(node_modules|bower_components)/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',                                                                           // Creates `style` nodes from JS strings
          'css-loader',                                                                             // Translates CSS into CommonJS
          'sass-loader',                                                                            // Compiles Sass to CSS
        ],
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',                                                                           // Creates `style` nodes from JS strings
          'css-loader',                                                                             // Translates CSS into CommonJS
        ],
      },
      {
        test: /\.(jpe?g|gif|png|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false,
              limit: 8192,
              outputPath: (url, resourcePath, context) => {
                resourcePath = resourcePath.slice(context.length + path.sep.length);
                resourcePath = resourcePath.split(path.sep);

                if (resourcePath[0] !== 'src') throw new Error('Cannot get image outside ot src', resourcePath);
                resourcePath = resourcePath.slice(1);

                const schema_name = resourcePath[0];
                if (!schema_name.startsWith('ds_')) throw new Error('Cannot get image outside ot schema', resourcePath);
                resourcePath = resourcePath.slice(1);

                if (mode === 'production') {
                  return path.join(schema_name, ...resourcePath);
                } else {
                  return path.join('srv', 'resources', schema_name, ...resourcePath);
                }
              },
            }
          }
        ],
      }
    ],
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js', '.ts', '.jsx', '.tsx', '.css', '.scss', '.sass'],
  },
  plugins: [
    new CopyPlugin({
      // для каждой схемы из зарегистрированных копируем файлы в свою директорию (кроме файлов scss и react)
      patterns: SCHEMA_NAMES.map(schema_name => ({
        from: path.join('src', schema_name),
        to: (mode === 'production') ? schema_name : `srv/resources/${schema_name}`,
        filter: f => !(f.endsWith('.tsx') || f.endsWith('.jsx') || f.endsWith('.scss')),
        transform: (content, path) => {
          if (path.match(/topic\./g) && path.endsWith('.json')) return json5ToJson(content);
          return content;
        },
        noErrorOnMissing: true,
      })),
    }),
  ],
};

