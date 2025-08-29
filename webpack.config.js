/* global __dirname, require, module*/

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const pkg = require('./package.json');
const env = yargs.argv.env || 'production';
const { filterSchemaNames } = require('./scripts/lib/utils');
const JSON5 = require('json5');


function getFiles(dir, prefix = '') {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = dirents.map((dirent) => {
    return dirent.isDirectory()
      ? getFiles(path.resolve(dir, dirent.name), prefix + dirent.name + '/')
      : prefix + dirent.name;
  });
  return Array.prototype.concat(...files);
}

// наполняем объект entry записями о jsx/tsx файлах из директорий типа ds_xxx
// для serv:
//  'srv/resources/ds_xxx/File': './src/ds_xxx/File.tsx',
// Для production (build)
//  'ds_xxx/File': './src/ds_xxx/File.tsx',
const entry = {}; //  __dirname + '/src/index.jsx',
const SRC = path.resolve(__dirname, 'src');
const SCHEMA_NAMES = filterSchemaNames(
  fs
    .readdirSync(SRC)
    .filter((fileName) =>
      fs.statSync(path.resolve(SRC, fileName)).isDirectory(),
    ),
);
SCHEMA_NAMES.forEach((schema_name) => {
  const files = getFiles(path.resolve(SRC, schema_name)).filter(
    (fileName) => fileName.endsWith('.tsx') || fileName.endsWith('.jsx'),
  );
  files.forEach((fileName) => {
    const fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
    if (!(fileName.indexOf('src/') + 1)) {
      console.log(`Register file: /${schema_name}/${fileNameWithoutExtension}`);
      if (env === 'production' || env === 'development') {
        entry[`${schema_name}/${fileNameWithoutExtension}`] =
          `./src/${schema_name}/${fileName}`;
      } else {
        entry[`srv/resources/${schema_name}/${fileNameWithoutExtension}`] =
          `./src/${schema_name}/${fileName}`;
      }
    }
  });
});

function json5ToJson(buffer) {
  const result = JSON.stringify(JSON5.parse(buffer.toString()), null, 2);
  return Buffer.from(result);
}


module.exports = {
  mode: env,
  entry,
  devtool: 'source-map',
  output: {
    publicPath: '',
    path: path.resolve(__dirname, env  === 'production' ? 'dist' : `dist_${env}`),
    hashFunction: 'xxhash64',
    filename: '[name].js',
    library: pkg.name,
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
  externals: {
    'react': 'react',
    'react-dom': 'react-dom',
    'react-dom/client': 'react-dom/client',
    'react-latex-next': 'react-latex-next',
    'classnames': 'classnames',
    'jquery': 'jquery',
    'axios': 'axios',
    'three': 'three',
    '@react-three/fiber': '@react-three/fiber',
    '@react-three/drei': '@react-three/drei',
    'echarts': 'echarts',
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
    'bi-internal/_internal': 'bi-internal/_internal',
  },
  optimization: {
    minimize: env && env === 'production', // disables uglify
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
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: 'style-loader',                                                                           // Creates `style` nodes from JS strings
            options: {
              insert: function insertToHead(element, options) {
                document.head.appendChild(element);
                var internalModule = require('bi-internal/_internal');
                if (internalModule._registerStyleElement) internalModule._registerStyleElement(element);
              },
            },
          },
          'css-loader',                                                                             // Translates CSS into CommonJS
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [path.resolve(__dirname, 'src/ds_res/styles')]
              }
            }
          }
        ],
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader', // Creates `style` nodes from JS strings
          'css-loader', // Translates CSS into CommonJS
        ],
      },
      {
        test: /\.svg$/i,
        use: ['@svgr/webpack', 'url-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(jpe?g|gif|png)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false,
              limit: 8192,
              outputPath: (url, resourcePath, context) => {
                resourcePath = resourcePath.slice(
                  context.length + path.sep.length,
                );
                resourcePath = resourcePath.split(path.sep);

                console.log('resourcePath => ', resourcePath);

                if (resourcePath[0] !== 'src')
                  throw new Error(
                    'Cannot get image outside ot src',
                    resourcePath,
                  );
                // todo: не уверен в правильности решения строчкой ниже, нужно смотреть на последствия
                // if (resourcePath.filter(f => f === 'src').length > 1) throw new Error('Cannot get image in src in ds_*', resourcePath);

                resourcePath = resourcePath.slice(1);

                const schema_name = resourcePath[0];
                if (!schema_name.startsWith('ds_'))
                  throw new Error(
                    'Cannot get image outside ot schema',
                    resourcePath,
                  );
                resourcePath = resourcePath.slice(1);

                if (env === 'production' || env === 'development') {
                  return path.join(schema_name, ...resourcePath);
                } else {
                  return path.join(
                    'srv',
                    'resources',
                    schema_name,
                    ...resourcePath,
                  );
                }
              },
            },
          },
        ],
        exclude: (url) => !url.match(/src\/ds_[0-9][0-9]*[0-9]*[0-9]\/src/),
      },
    ],
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: [
      '.json',
      '.js',
      '.ts',
      '.jsx',
      '.tsx',
      '.css',
      '.scss',
      '.sass',
      '.svg',
    ],
    mainFields: ['module', 'main'],
    alias: {
      '@ds_res': path.resolve(__dirname, 'src/ds_res/'),
      'rc-field-form$': 'rc-field-form/lib/index.js',
      process: 'process/browser',
    },
  },
  plugins: [
    // new BundleAnalyzerPlugin(),

    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new CopyPlugin({
      // для каждой схемы из зарегистрированных копируем файлы в свою директорию (кроме файлов scss и react)
      patterns: SCHEMA_NAMES.map((schema_name) => ({
        from: path.join('src', schema_name),
        to:
          env === 'production' || env === 'development'
            ? schema_name
            : `srv/resources/${schema_name}`,
        filter: (f) =>
          !(
            f.endsWith('.tsx') ||
            f.endsWith('.jsx') ||
            f.endsWith('.scss') ||
            f.match(/src\/ds_.{1,20}\/src/)
          ),
        transform: (content, path) => {
          if (path.match(/topic\./g) && path.endsWith('.json')) return json5ToJson(content);
          return content;
        },
        noErrorOnMissing: true,
      })),
    }),
  ],
};
