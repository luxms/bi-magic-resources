const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { createProxyMiddleware } = require('http-proxy-middleware');
const mime = require('mime-types');
const webpackConfig = require('../webpack.config');
const auth = require('./lib/auth');
const config = require('./lib/config');
const { filterSchemaNames } = require('./lib/utils');
const {
  authMiddleware,
  cubeMiddleware,
  dimensionMiddleware,
  dataMiddleware,
  dashboardMiddleware,
  dashletMiddleware,
  RtMiddleware,
  RtMiddlewareRSocket,
} = require('./server/middlewares');

const ONLINE = !config.hasNoLogin();
const SERVER = config.getServer();
const PORT = config.getPort();
const JWT = config.getJWT();

const startDev = () => {
  const options = {
    compress: false,
    host: '0.0.0.0',
    port: PORT,
    hot: true,
    inline: false,
    stats: {
      colors: true
    },
    publicPath: '/',
    watchOptions: {
      ignored: /node_modules/,
      poll: true
    },
    sockPath: '/srv/rt',
    transportMode: {
      client: 'ws',
      server: require.resolve('./server/CustomServer'),
    },
    before(app) {
      app.use(authMiddleware);

      if (config.hasResources()) {
        app.use('/api/db/:schema_name.resources/', (req, res, next) => {
          const schema_name = req.params.schema_name;
          if (!filterSchemaNames([schema_name]).length) return next();
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify(Object.keys(ASSETS).filter(asset => asset.startsWith(schema_name + '/')).map(asset => ASSETS[asset])));
        });
      }

      if (config.hasDashboards()) {
        app.use('/api/db/:schema_name.dashboards/', dashboardMiddleware);
        app.use('/api/db/:schema_name.dashlets/', dashletMiddleware);
      }

      if (config.hasCubes()) {
        app.use('/api/db/:schema_name.cubes/', cubeMiddleware);
        app.use('/api/db/:schema_name.dimensions/', dimensionMiddleware);
        app.use('/api/v3/:schema_name/data/', dataMiddleware);
      }

      if (JWT) {
        app.use('/api/', createProxyMiddleware({
          target: `${SERVER}/api/`,
          changeOrigin: true,
          secure: false,
          on: {
            proxyReq: (proxyReq) => {
              proxyReq.setHeader('Authorization', `Bearer ${JWT}`);
            },
          }
        }))
      }

      // поскольку есть copy plugin, теперь не нужно сервить статику специальным образом
      // app.use('/srv/resources/', express.static(path.resolve(__dirname, '..', 'src')));
    },
    proxy: {
      // '/api': { target: API, changeOrigin: true, secure: false },
      // '/srv': { target: API, changeOrigin: true, secure: false, onError(err) { console.log('/srv error:', err);  }, },
      // '/srv/rt': { target: API.replace(/^http/, 'ws'), changeOrigin: true, secure: false, ws: true, onError(err) { console.log('WS error:', err);  }, },
      // '/admin-server': { target: API, changeOrigin: true, secure: false },
      '/': {target: SERVER, changeOrigin: true, secure: false},
    },

  };

  const webpackDevServer = new WebpackDevServer(webpack(webpackConfig), options);

  webpackDevServer.listen(PORT, '0.0.0.0', function (err) {
    if (err) {
      console.log(err);
    }
    console.log('WebpackDevServer listening at localhost:', PORT);
  });


  let rtMiddleware = new RtMiddleware(webpackDevServer.listeningApp);                                 // rt must be initialized with httpServer object
  let rtMiddlewareRSocket = new RtMiddlewareRSocket(webpackDevServer.listeningApp);
  // Поскольку сейчас висит два обработчика на вебсокетах, то требуется вручную их роутить
  webpackDevServer.listeningApp.on('upgrade', (request, socket, head) => {
    const srvbi = rtMiddleware._wsServer;
    const srvrt = rtMiddlewareRSocket._wsServer;

    const pathname = request.url;

    if (pathname === '/srv/bI/') {
      srvbi.handleUpgrade(request, socket, head, (ws) => {
        srvbi.emit('connection', ws);
      });
    } else if (pathname === '/srv/rt/') {
      srvrt.handleUpgrade(request, socket, head, (ws) => {
        srvrt.emit('connection', ws);
      });
    } else {
      socket.destroy();
    }
  });

  let ASSETS = {}, _id = 1;

  webpackDevServer.compiler.hooks.done.tap('webpack-dev-server', (stats) => {
    try {
      const now = new Date(stats.endTime).toJSON();

      const short = name => name.slice(14);                                                           // cut srv/resources from beginning of id
      const assets = {};
      Object.keys(stats.compilation.assets).forEach(id => assets[short(id)] = stats.compilation.assets[id]);
      const emittedAssetIds = Array.from(stats.compilation.emittedAssets).map(short);

      const deletedIds = Object.keys(ASSETS).filter(id => !assets[id]);
      const addedIds = Object.keys(assets).filter(id => !ASSETS[id]);
      const modifiedIds = emittedAssetIds.filter(id => ASSETS[id]);

      console.log('deleted', deletedIds);
      console.log('added', addedIds);
      console.log('modified', modifiedIds);

      // groupBySchemaNames(deletedIds).forEach(({schema_name, ids}) => rtMiddleware.deleteResources(schema_name, ids.map(id => ASSETS[id])));
      deletedIds.forEach(id => delete ASSETS[id]);

      addedIds.forEach(asset => ASSETS[asset] = {
        id: _id++,
        alt_id: asset.replace(/^\w+\//, ''),
        content_type: mime.lookup(asset),
        content_length: assets[asset]._size,
        config: {},
        updated: now,
        created: now
      });

      groupBySchemaNames(addedIds).forEach(({schema_name, ids}) => {
        rtMiddleware.addResources(schema_name, ids.map(id => ASSETS[id]));
        rtMiddlewareRSocket.addResources(schema_name, ids.map(id => ASSETS[id]));
      });

      modifiedIds.forEach(asset => ASSETS[asset].updated = now);

      groupBySchemaNames(modifiedIds).forEach(({schema_name, ids}) => {
        rtMiddleware.modifyResources(schema_name, ids.map(id => ASSETS[id]));
        rtMiddlewareRSocket.modifyResources(schema_name, ids.map(id => ASSETS[id]));
      });

    } catch (err) {
      console.error(err);
    }
  });

  // ids is array of strings of form `schema_name/resource_id`
  // return [ {schema_name, ids: [...]}, ... ]
  function groupBySchemaNames(ids) {
    let h = {};
    ids.forEach(id => {
      let schema_name = id.split('/')[0];
      (h[schema_name] || (h[schema_name] = {schema_name, ids: []})).ids.push(id);
    });
    return Object.values(h);
  }
};

if (ONLINE) auth.init(startDev);
else startDev();
