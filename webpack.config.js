/* global __dirname, require, module*/

const fs = require('fs');
const path = require('path');
const SourceArtifactsPlugin = require('./scripts/webpack/SourceArtifactsPlugin');
const NormalizeLineEndingsPlugin = require('./scripts/plugins/NormalizeLineEndingsPlugin');
const normalizeLineEndingsLoader = path.resolve(__dirname, 'scripts/plugins/normalize-line-endings.js');
const pkg = require('./package.json');
const { filterSchemaNames } = require('./scripts/lib/utils');


module.exports = (env = {}) => {
  const mode = env === 'build' || env.build ? 'production' : 'development';
  const SRC = path.resolve(__dirname, 'src');
  const schemas = () => filterSchemaNames(fs.readdirSync(SRC, {withFileTypes: true})
    .filter(item => item.isDirectory()).map(item => item.name));
  const artifacts = new SourceArtifactsPlugin({src: SRC, schemas, production: mode === 'production'});
  return {
  mode,
  entry: () => artifacts.entries(),
  devtool: 'source-map',
  output: {
    publicPath: '',
    path: path.resolve(__dirname, 'dist'),
    hashFunction: 'xxhash64',
    filename: '[name].js',
    library: pkg.name,
    libraryTarget: 'umd',
    libraryExport: 'default',
    assetModuleFilename: function() {
      console.log('___xxx___images/[hash][ext][query]');
      return null;
    }
  },
  externals: {
    'react': 'react',
    'react/jsx-runtime': 'react/jsx-runtime',
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
    minimize: false,                                                                                // disables uglify
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?|css|s[ac]ss)$/i,
        enforce: 'pre',
        loader: normalizeLineEndingsLoader,
        exclude: /(node_modules|bower_components)/,
      },
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
          normalizeLineEndingsLoader,                                                               // Normalize maps of Sass imports before css-loader embeds them
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
        test: /\.(woff(2)?|ttf|eot)$/,
        type: 'asset/resource',
        generator: {
          publicPath: mode === 'production' ? 'srv/resources/' : '',
          filename: function(data, assetInfo) {
            let resourcePath = data.filename.split(path.sep);
            if (resourcePath[0] !== 'src') throw new Error('Cannot get image outside ot src', resourcePath);
            resourcePath = resourcePath.slice(1);

            const schema_name = resourcePath[0];
            if (!schema_name.startsWith('ds_')) throw new Error('Cannot get image outside ot schema', resourcePath);
            resourcePath = resourcePath.slice(1);

            return path.join(mode === 'production' ? '' : 'srv/resources/', schema_name, ...resourcePath);
          },
        },
      },
      {
        test: /\.(jpe?g|gif|png|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false,
              limit: 8192,
              name: '[name].[ext]',
              publicPath: (url, resourcePath, context) => {
                resourcePath = resourcePath.slice(context.length + path.sep.length);
                resourcePath = resourcePath.split(path.sep);

                if (resourcePath[0] !== 'src') throw new Error('Cannot get image outside ot src', resourcePath);
                resourcePath = resourcePath.slice(1);

                const schema_name = resourcePath[0];
                if (!schema_name.startsWith('ds_')) throw new Error('Cannot get image outside ot schema', resourcePath);
                resourcePath = resourcePath.slice(1);

                return path.join('srv', 'resources', schema_name, ...resourcePath);
              },
              outputPath: (url, resourcePath, context) => {
                resourcePath = resourcePath.slice(context.length + path.sep.length);
                resourcePath = resourcePath.split(path.sep);

                if (resourcePath[0] !== 'src') throw new Error('Cannot get image outside ot src', resourcePath);
                resourcePath = resourcePath.slice(1);

                const schema_name = resourcePath[0];
                if (!schema_name.startsWith('ds_')) throw new Error('Cannot get image outside ot schema', resourcePath);
                resourcePath = resourcePath.slice(1);

                return path.join(mode === 'production' ? '' : 'srv/resources/', schema_name, ...resourcePath);
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
  plugins: [artifacts, new NormalizeLineEndingsPlugin()],
  };
};
