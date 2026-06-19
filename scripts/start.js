const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { createProxyMiddleware } = require('http-proxy-middleware');
const mime = require('mime-types');
const path = require('path');
const fsp = require('fs').promises;
const JSON5 = require('json5');
const chokidar = require('chokidar');
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

  const crypto = require('crypto');
  // Хэш контента ассета — чтобы отличать реально изменённые ресурсы от просто переэмиченных copy-плагином.
  const hashOf = (a) => { try { return crypto.createHash('md5').update(a.source()).digest('hex'); } catch (e) { return 's' + a._size; } };
  let ASSETS = {}, _id = 1;

  // Watch dashboard/topic/dashlet JSON files and broadcast updates via rt-middleware.
  // These files are served by dashletMiddleware (not as webpack resources), so webpack
  // doesn't know about them — we do our own watching.
  const SRC_DIR = path.resolve(__dirname, '..', 'src');
  const TOPIC_TYPES = {
    topic:     { upsert: 'ADD_DASHBOARD_TOPICS', delete: 'DELETE_DASHBOARD_TOPICS' },
    dashboard: { upsert: 'ADD_DASHBOARDS',       delete: 'DELETE_DASHBOARDS' },
    dashlet:   { upsert: 'ADD_DASHLETS',         delete: 'DELETE_DASHLETS' },
  };

  function parseTopicPath(relPath) {
    const [schema, topicSeg, ...rest] = relPath.split('/');
    if (!schema || !topicSeg || !topicSeg.startsWith('topic.')) return null;
    if (!filterSchemaNames([schema]).length) return null;
    const topicId = Number(topicSeg.slice(6));
    if (!Number.isInteger(topicId)) return null;
    if (rest.length === 1 && rest[0] === 'index.json') {
      return { kind: 'topic', schema, id: topicId };
    }
    if (rest.length === 2 && rest[0].startsWith('dashboard.')) {
      const dashboardId = Number(rest[0].slice(10));
      if (!Number.isInteger(dashboardId)) return null;
      if (rest[1] === 'index.json') {
        return { kind: 'dashboard', schema, id: dashboardId, topic_id: topicId };
      }
      const m = rest[1].match(/^(\d+)\.json$/);
      if (m) return { kind: 'dashlet', schema, id: Number(m[1]), dashboard_id: dashboardId };
    }
    return null;
  }

  async function publishTopicChange(event, fullPath) {
    const rel = path.relative(SRC_DIR, fullPath).replace(/\\/g, '/');
    const parsed = parseTopicPath(rel);
    if (!parsed) return;

    const isDelete = event === 'unlink';
    let payload = { id: parsed.id };
    if (parsed.topic_id !== undefined) payload.topic_id = parsed.topic_id;
    if (parsed.dashboard_id !== undefined) payload.dashboard_id = parsed.dashboard_id;

    if (!isDelete) {
      try {
        const content = await fsp.readFile(fullPath, 'utf8');
        payload = { ...JSON5.parse(content), ...payload };
      } catch (err) {
        console.warn(`[watcher] failed to read ${rel}:`, err.message);
        return;
      }
    }

    const types = TOPIC_TYPES[parsed.kind];
    const msg = [{ type: isDelete ? types.delete : types.upsert, payload }];
    console.log(`[watcher] ${event} ${parsed.kind}:`, rel);
    rtMiddleware.publishSchemaMessage(parsed.schema, msg);
    rtMiddlewareRSocket.publishSchemaMessage(parsed.schema, msg);
  }

  const topicWatcher = chokidar.watch(SRC_DIR, {
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 100, pollInterval: 50 },
    ignored: (p) => {
      // Skip non-atlas top-level directories entirely (don't descend into them).
      const rel = path.relative(SRC_DIR, p);
      if (!rel || rel.startsWith('..')) return false;
      const top = rel.split(path.sep)[0];
      return !filterSchemaNames([top]).length;
    },
  });
  for (const event of ['add', 'change', 'unlink']) {
    topicWatcher.on(event, (fullPath) => {
      if (!fullPath.endsWith('.json')) return;
      publishTopicChange(event, fullPath).catch(err => console.error('[watcher]', err));
    });
  }

  webpackDevServer.compiler.hooks.done.tap('webpack-dev-server', (stats) => {
    try {
      const now = new Date(stats.endTime).toJSON();

      const short = name => name.slice(14);                                                           // cut srv/resources from beginning of id
      const assets = {};
      Object.keys(stats.compilation.assets).forEach(id => assets[short(id)] = stats.compilation.assets[id]);
      const emittedAssetIds = Array.from(stats.compilation.emittedAssets).map(short);

      const deletedIds = Object.keys(ASSETS).filter(id => !assets[id]);
      const addedIds = Object.keys(assets).filter(id => !ASSETS[id]);
      // emittedAssets содержит ВСЕ copy-webpack ресурсы на каждой пересборке → без фильтра по контенту
      // правка одного файла рассылала "modified" по ВСЕМ ресурсам, и BI перезагружал их тысячами
      // (ERR_INSUFFICIENT_RESOURCES, themes.json грузился многократно). Шлём только реально изменившиеся.
      const modifiedIds = emittedAssetIds.filter(id => {
        if (!ASSETS[id]) return false;
        const h = hashOf(assets[id]);
        const changed = ASSETS[id].hash !== h;
        ASSETS[id].hash = h;
        return changed;
      });

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
        hash: hashOf(assets[asset]),
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
