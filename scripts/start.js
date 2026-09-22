const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { createProxyMiddleware } = require('http-proxy-middleware');
const mime = require('mime-types');
const path = require('path');
const fsp = require('fs').promises;
const { isConfigPath, parseConfig, toLogicalPath } = require('./lib/config-codec');
const chokidar = require('chokidar');
const webpackConfig = require('../webpack.config')({ dev: true });
const auth = require('./lib/auth');
const config = require('./lib/config');
const { filterSchemaNames, decodePath } = require('./lib/utils');
const SourceLocal = require('./platforms/SourceLocal');
const { createResourceMiddleware } = require('./server/middlewares/resource-middleware');
const { createLocalWriteGuard } = require('./server/middlewares/local-write-guard');
const { createCubeChangeTracker, parseCubePath } = require('./lib/cube-watcher');
const {
  authMiddleware,
  cubeMiddleware,
  dimensionMiddleware,
  dataMiddleware,
  dashboardMiddleware,
  dashletMiddleware,
  topicMiddleware,
  RtMiddleware,
} = require('./server/middlewares');
const {
  makeDashboardRtMessage,
  parseDashboardPath,
} = require('./lib/dashboard-watcher');

const ONLINE = !config.hasNoLogin();
const SERVER = config.getServer();
const PORT = config.getPort();
const HOST = config.getOption('session') ? '127.0.0.1' : '0.0.0.0';
const JWT = config.getJWT();

const startDev = async () => {
  const local = new SourceLocal('src');
  const ASSETS = {};
  let nextResourceId = 1;
  let rtMiddleware;
  const cubes = createCubeChangeTracker();
  if (config.hasCubes()) {
    for (const schema of await local.getSchemaNames()) {
      for (const cube of await local.cubes.enumerate(schema)) {
        cubes.seed(decodePath(cube).replace(/^\//, ''), await local.cubes.getContent(cube));
      }
    }
  }
  const options = {
    compress: false,
    host: HOST,
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
        app.use(createResourceMiddleware({
          local,
          getAssets: () => ASSETS,
          allocateId: () => nextResourceId++,
          onChange: ({type, schema, resource}) => rtMiddleware.publishSchemaMessage(schema, [{type, payload: resource}]),
        }));
      }

      if (config.hasDashboards()) {
        app.use('/api/db/:schema_name.dashboard_topics/', topicMiddleware);
        app.use('/api/db/:schema_name.dashboards/', dashboardMiddleware);
        app.use('/api/db/:schema_name.dashlets/', dashletMiddleware);
      }

      if (config.hasCubes()) {
        app.use('/api/db/:schema_name.cubes/', cubeMiddleware);
        app.use('/api/db/:schema_name.dimensions/', dimensionMiddleware);
        app.use('/api/v3/:schema_name/data/', dataMiddleware);
      }

      app.use(createLocalWriteGuard({
        dashboards: config.hasDashboards(),
        cubes: config.hasCubes(),
        resources: config.hasResources(),
      }));

      // Webpack's dev middleware also serves emitted resource URLs. Route the
      // disabled block before it so alt_id URLs cannot pick up stale local bytes.
      if (!config.hasResources()) {
        app.use('/srv/resources', createProxyMiddleware({
          target: `${SERVER.replace(/\/+$/, '')}/srv/resources`,
          changeOrigin: true,
          secure: false,
          on: {
            proxyReq: proxyReq => {
              if (JWT) proxyReq.setHeader('Authorization', `Bearer ${JWT}`);
            },
          },
        }));
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

  webpackDevServer.listen(PORT, HOST, function (err) {
    if (err) {
      console.log(err);
    }
    console.log('WebpackDevServer listening at localhost:', PORT);
  });


  rtMiddleware = new RtMiddleware(webpackDevServer.listeningApp);
  const upstreamWebSocket = createProxyMiddleware({target: SERVER, changeOrigin: true, secure: false});
  webpackDevServer.listeningApp.on('upgrade', (request, socket, head) => {
    const srvbi = rtMiddleware._wsServer;
    const pathname = request.url.split('?')[0];

    if (pathname === '/srv/bI/' || pathname === '/srv/bI') {
      srvbi.handleUpgrade(request, socket, head, (ws) => {
        srvbi.emit('connection', ws);
      });
    } else if (pathname !== '/srv/rt') {
      upstreamWebSocket.upgrade(request, socket, head);
    }
  });

  const crypto = require('crypto');
  // Хэш контента ассета — чтобы отличать реально изменённые ресурсы от просто переэмиченных copy-плагином.
  const hashOf = (asset, name) => {
    let bytes;
    try { bytes = asset.buffer ? asset.buffer() : asset.source(); }
    catch (_) { bytes = webpackDevServer.compiler.outputFileSystem.readFileSync(path.join(webpackConfig.output.path, 'srv/resources', name)); }
    return crypto.createHash('sha256').update(bytes).digest('hex');
  };

  // Watch dashboard/topic/dashlet JSON files and broadcast updates via rt-middleware.
  // These files are served by dashletMiddleware (not as webpack resources), so webpack
  // doesn't know about them — we do our own watching.
  const SRC_DIR = path.resolve(__dirname, '..', 'src');
  async function publishTopicChange(event, fullPath) {
    const rel = path.relative(SRC_DIR, fullPath).replace(/\\/g, '/');
    const parsed = parseDashboardPath(rel);
    const cube = parseCubePath(rel);
    if ((!parsed || !config.hasDashboards()) && (!cube || !config.hasCubes())) return;
    if (!filterSchemaNames([(parsed || cube).schema]).length) return;

    let effectiveEvent = event;
    let content;
    try {
      if (event === 'unlink') {
        // A format rename can emit add(new.yaml) before unlink(old.json5).
        // Resolve the logical entity before deleting it from browser state.
        const logical = '/' + toLogicalPath(rel).split('/').map(encodeURIComponent).join('/');
        const replacement = await local.readFile(logical);
        if (replacement !== null) {
          content = replacement;
          effectiveEvent = 'change';
        }
      } else {
        content = parseConfig(await fsp.readFile(fullPath, 'utf8'), fullPath);
      }
    } catch (err) {
      console.warn(`[watcher] failed to read ${rel}:`, err.message);
      return;
    }

    if (parsed && config.hasDashboards()) {
      rtMiddleware.publishSchemaMessage(parsed.schema, makeDashboardRtMessage(effectiveEvent, parsed, content));
    } else {
      const update = cubes.update(effectiveEvent, rel, content);
      if (update?.messages.length) rtMiddleware.publishSchemaMessage(update.schema, update.messages);
    }
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
      if (!isConfigPath(path.relative(SRC_DIR, fullPath))) return;
      return publishTopicChange(event, fullPath).catch(err => console.error('[watcher]', err));
    });
  }

  webpackDevServer.compiler.hooks.done.tap('webpack-dev-server', (stats) => {
    // Keep the last successful resource index while an edit fails to compile.
    // Disabled resources must not inject local IDs into upstream browser lists.
    if (!config.hasResources() || stats.hasErrors()) return;
    try {
      const now = new Date(stats.endTime).toJSON();

      const short = name => name.slice(14);                                                           // cut srv/resources from beginning of id
      const assets = {};
      Object.keys(stats.compilation.assets).filter(id => id.startsWith('srv/resources/') && !isConfigPath(short(id)))
        .forEach(id => assets[short(id)] = stats.compilation.assets[id]);
      const emittedAssetIds = Array.from(stats.compilation.emittedAssets).map(short).filter(id => assets[id]);

      const deletedIds = Object.keys(ASSETS).filter(id => !assets[id]);
      const addedIds = Object.keys(assets).filter(id => !ASSETS[id]);
      // emittedAssets содержит ВСЕ copy-webpack ресурсы на каждой пересборке → без фильтра по контенту
      // правка одного файла рассылала "modified" по ВСЕМ ресурсам, и BI перезагружал их тысячами
      // (ERR_INSUFFICIENT_RESOURCES, themes.json грузился многократно). Шлём только реально изменившиеся.
      const modifiedIds = emittedAssetIds.filter(id => {
        if (!ASSETS[id]) return false;
        const h = hashOf(assets[id], id);
        const changed = ASSETS[id].hash !== h;
        ASSETS[id].hash = h;
        return changed;
      });

      console.log('deleted', deletedIds);
      console.log('added', addedIds);
      console.log('modified', modifiedIds);

      groupBySchemaNames(deletedIds).forEach(({schema_name, ids}) => {
        rtMiddleware.publishSchemaMessage(schema_name, ids.map(id => ({type: 'DELETE_RESOURCES', payload: ASSETS[id]})));
      });
      deletedIds.forEach(id => delete ASSETS[id]);

      addedIds.forEach(asset => ASSETS[asset] = {
        id: nextResourceId++,
        alt_id: asset.replace(/^\w+\//, ''),
        content_type: mime.lookup(asset),
        content_length: assets[asset].size(),
        hash: hashOf(assets[asset], asset),
        config: {},
        updated: now,
        created: now
      });

      groupBySchemaNames(addedIds).forEach(({schema_name, ids}) => {
        rtMiddleware.addResources(schema_name, ids.map(id => ASSETS[id]));
      });

      modifiedIds.forEach(asset => {
        ASSETS[asset].updated = now;
        ASSETS[asset].content_length = assets[asset].size();
      });

      groupBySchemaNames(modifiedIds).forEach(({schema_name, ids}) => {
        rtMiddleware.modifyResources(schema_name, ids.map(id => ASSETS[id]));
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
else startDev().catch(error => { console.error(error); process.exitCode = 1; });
