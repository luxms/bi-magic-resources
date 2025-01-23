// node.js server used to serve assets bundled by Webpack
// use `yarn start` command to launch the server.
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack.config');
const path = require('path');
const parse = require('url-parse')
const mime = require('mime-types');
const local = require('./lib/local');
const server = require('./lib/server');
const config = require('./lib/config');
const { filterSchemaNames, splitResource, fixResourceIdToName } = require('./lib/utils');
const commands  = require('./lib/commands');
const authMiddleware = require('./apis/auth-middleware');
const RtMiddleware = require('./apis/rt-middleware');
const chalk = require("chalk");
const lpe = require("./lpe");
const express = require("express");

// initialize server module
const ONLINE = !config.getNoLogin()
if (ONLINE) config.getSUPConfigAndLog();
const SERVER = config.getServer();
const PORT = config.getPort();


const startDev = () => {

  const options = {
    // publicPath: webpackConfig.output.publicPath,
    // contentBase: 'www',
    compress: false,
    host: '0.0.0.0',
    port: PORT,
    // hot: true,
    // inline: true,
    hot: true,
    inline: false,
    stats: {colors: true},
    // open: true,
    publicPath: '/',
    watchOptions: {ignored: /node_modules/, poll: true},

    sockPath: '/srv/rt',

    transportMode: {
      client: 'ws',
      server: require.resolve('./CustomServer'),
    },

    // onListening: function (server) {
    //   const port = server.listeningApp.address().port;
    //   console.log('Listening on port:', port);
    // },
    before(app, wds, compiler) {
      // app.use(express.json())
      // app.use(express.urlencoded({extended: true}))

      app.use(authMiddleware());
      app.use('/api/db/:schema_name.resources/', (req, res, next) => {
        const schema_name = req.params.schema_name;
        if (!filterSchemaNames([schema_name]).length) return next();
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(Object.keys(ASSETS).filter(asset => asset.startsWith(schema_name + '/')).map(asset => ASSETS[asset])));
      });
      if (config.hasDashboards()) {
        app.use('/api/db/:schema_name.dashboards/', async function (req, res, next) {
          try {
            const {method, url} = req;
            let resource = parse(url, true).pathname;
            resource = resource.replace('/', '');
            const dashboardId = parseInt(resource);

            const schema_name = req.params.schema_name;
            const validSchemas = await local.getSchemaNames();

            if (!validSchemas.includes(schema_name)) {
              next();
              return;
            }
            const paths = await local.getConfigs(schema_name);
            const topicsId = await local.getTopicsId(schema_name);
            let topicId;
            if (!isNaN(dashboardId)) {
              const path = paths.find((t) => t.includes(`dashboard.${dashboardId}/`));
              const [topicName] = path.split('/');
              topicId = parseInt(topicName.substring(topicName.indexOf('.') + 1, topicName.length));
            }
            let dashboards = await local.getDashboards(schema_name);
            if (dashboards === null) {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'text/plain');
              res.end(`Not found: ${resource}`);
              return;
            }
            let contents = dashboards.map((r) => r.content);
            switch (method) {
              case 'GET': {
                if (resource === '.order_by(srt,id)') {
                  contents.sort((prev, next) => prev.srt - next.srt || prev.id - next.id);
                } else {
                  if (!isNaN(dashboardId)) contents = contents.find((c) => c.id === dashboardId);
                }
                const contentBuffer = Buffer.from(JSON.stringify(contents));
                res.setHeader('Content-Type', 'application/json');
                res.end(contentBuffer);
              }
                break;
              case 'PUT': {
                // пришлось так сделать, чтобы добраться до тела запроса
                // при других решениях запрос cube весит в статусе pending
                req.on('data', async function (chunk) {
                  const data = chunk;
                  const jsonBody = {id: dashboardId, ...JSON.parse(data)};
                  const db = dashboards.find((r) => r.config.includes(`dashboard.${resource}/index.json`));
                  await local.saveJSONContent(db.config, jsonBody);
                  res.setHeader('Content-Type', 'application/json');
                  res.end(Buffer.from(JSON.stringify(jsonBody)));
                })
              }
                break;
              case 'POST': {
                req.on('data', async function (chunk) {
                  const data = chunk;
                  let jsonBody = {...JSON.parse(data)};
                  if (!topicId) {
                    if (data.hasOwnProperty('topic_id')) topicId = data.topic_id;
                    else {
                      if (topicsId.length) topicId = topicsId[0];
                    }
                  }
                  jsonBody = await commands.createEntity(local, server, schema_name, topicId, undefined, jsonBody);
                  if (jsonBody) {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(Buffer.from(JSON.stringify(jsonBody)));
                  } else {
                    throw new Error(`Failed to create a dashboard`);
                  }
                })

              }
                break;
              case 'DELETE': {
                const db = dashboards.find((r) => r.config.includes(`topic.${topicId}/dashboard.${resource}/`));
                await local.removeFolder(db.config);
                res.setHeader('Content-Type', 'application/json');
                res.end(Buffer.from(JSON.stringify("The dashboard was removed")));
              }
                break;
              default: {
                throw new Error(`Method ${method} not implemented`);
              }
            }
          } catch (err) {
            res.statusCode = 500;
            res.end('Error: ' + err.message);
            console.error(err);
          }
        });
        app.use('/api/db/:schema_name.dashlets/', async function (req, res, next) {
          try {
            const {method, url} = req;
            let resource = parse(url, true).pathname;
            resource = resource.replace('/', '');
            const dashletdId = parseInt(resource);

            const schema_name = req.params.schema_name;
            const validSchemas = await local.getSchemaNames();

            if (!validSchemas.includes(schema_name)) {
              next();
              return;
            }
            let dashlets = await local.getDashlets(schema_name);
            if (dashlets === null) {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'text/plain');
              res.end(`Not found: ${resource}`);
              return;
            }
            let dashContents = dashlets.map((r) => r.content);
            switch (method) {
              case 'GET': {
                if (resource === '.order_by(srt,id)') {
                  dashContents.sort((prev, next) => prev.srt - next.srt || prev.id - next.id);
                } else {
                  if (!isNaN(dashletdId)) dashContents = dashContents.find((c) => c.id === dashletdId);
                }
                const contentBuffer = Buffer.from(JSON.stringify(dashContents));
                res.setHeader('Content-Type', 'application/json');
                res.end(contentBuffer);
              }
                break;
              case 'PUT': {
                req.on('data', async function (chunk) {
                  const data = chunk;
                  const jsonBody = {id: dashletdId, ...JSON.parse(data)};
                  const dash = dashlets.find((r) => r.config.includes(`${resource}.json`));
                  await local.saveJSONContent(dash.config, jsonBody);
                  res.setHeader('Content-Type', 'application/json');
                  res.end(Buffer.from(JSON.stringify(jsonBody)));
                })

              }
                break;
              case 'POST': {
                req.on('data', async function (chunk) {
                  const data = chunk;
                  let jsonBody = {...JSON.parse(data)};
                  const paths = await local.getConfigs(schema_name);
                  const topicsId = await local.getTopicsId(schema_name);
                  let topicId;
                  let dashboard_id = jsonBody.hasOwnProperty('dashboard_id') ? jsonBody['dashboard_id'] : undefined;

                  let dashboards = await local.getDashboards(schema_name);
                  if (dashboard_id) {
                    const path = paths.find((c) => c.includes(`dashboard.${dashboard_id}/`));
                    const [topicName] = path.split('/');
                    topicId = parseInt(topicName.substring(topicName.indexOf('.') + 1, topicName.length));
                  }
                  let exist = dashboard_id && dashboards.some((d) => d.config.includes(`dashboard.${dashboard_id}/`));
                  if (!exist) {
                    if (!topicId) {
                      if (topicsId.length) topicId = topicsId[0];
                      else topicId = await server.getId({schemaName: schema_name});
                    }
                    dashboard_id = await server.getId({schemaName: schema_name, topicId});
                  }

                  jsonBody = await commands.createEntity(local, server, schema_name, topicId, dashboard_id, jsonBody);
                  if (jsonBody) {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(Buffer.from(JSON.stringify(jsonBody)));
                  } else {
                    throw new Error(`Failed to create a dashlet`);
                  }
                });
              }
                break;
              case 'DELETE': {
                const dash = dashlets.find((r) => r.config.includes(`${resource}.json`));
                await local.removeJSONContent(dash.config);
                res.setHeader('Content-Type', 'application/json');
                res.end(Buffer.from(JSON.stringify("The dashboard was removed")));
              }
                break;
              default: {
                throw new Error(`Method ${method} not implemented`);
              }
            }
          } catch (err) {
            res.statusCode = 500;
            res.end('Error: ' + err.message);
            console.error(err);
          }
        });
      }
      if (config.hasCubes()) {
        // глобальные кубы --- koob.cubes/
        // локальные кубы --- :schema_name.cubes/.filter(is_global=0)
        // current dimensions --- :schema_name.dimensions/.filter(source_ident='ch'&&cube_name='max_example')
        // current data --- :schema_name/data?xAxis
        app.use('/api/db/:schema_name.cubes/', async function (req, res, next) {
          try {
            const {method, url, params: {schema_name}} = req;
            let cube = parse(url, true).pathname;

            const validSchemas = await local.getSchemaNames();
            if (!validSchemas.includes(schema_name)) {
              next();
              return;
            }

            const paths = await local.getCubes(schema_name);

            switch (method) {
              case 'GET': {
                let content;
                if (cube === '/.filter(is_global=0)') { // локальные кубы
                  content = [];
                  for (let index = 0; index < paths.length; index++) {
                    const cubePath = paths[index];
                    const cubeContent = await local.getCubeContent(schema_name, cubePath);
                    if (cubeContent.hasOwnProperty('dimensions')) delete cubeContent.dimensions;
                    content.push(cubeContent);
                  }

                  const contentBuffer = Buffer.from(JSON.stringify(content));
                  res.setHeader('Content-Type', 'application/json');
                  res.end(contentBuffer);
                }
              }
                break;
              case 'PUT': {
                // todo
              }
                break;
              case 'POST': {
                // todo
              }
                break;
              case 'DELETE': {
                // todo
              }
                break;
              default: {
                throw new Error(`Method ${method} not implemented`);
              }
            }
          } catch (err) {
            res.statusCode = 500;
            res.end('Error: ' + err.message);
            console.error(err);
          }
        });
        app.use('/api/db/:schema_name.dimensions/', async function (req, res, next) {
          try {
            const {method, url, params: {schema_name}} = req;
            let cube = parse(url, true).pathname;

            const validSchemas = await local.getSchemaNames();
            if (!validSchemas.includes(schema_name)) {
              next();
              return;
            }

            const paths = await local.getCubes(schema_name);

            switch (method) {
              case 'GET': {
                const pattern = /source_ident='([^']+)'&&cube_name='([^']+)'/;
                const match = cube.match(pattern);
                const cubeId = match ? `${match[1]}.${match[2]}` : null;

                if (cubeId && paths.includes(cubeId)) {
                  content = await local.getCubeContent(schema_name, cubeId);
                  const contentBuffer = Buffer.from(JSON.stringify(content.dimensions));
                  res.setHeader('Content-Type', 'application/json');
                  res.end(contentBuffer);
                }
              }
                break;
              case 'PUT': {
                // todo
              }
                break;
              case 'POST': {
                // todo
              }
                break;
              case 'DELETE': {
                // todo
              }
                break;
              default: {
                throw new Error(`Method ${method} not implemented`);
              }
            }
          } catch (err) {
            res.statusCode = 500;
            res.end('Error: ' + err.message);
            console.error(err);
          }
        });
        app.use('/api/v3/:schema_name/data/', async function (req, res, next) {
          try {
            const {method, url, body, params: {schema_name}} = req;
            const validSchemas = await local.getSchemaNames();
            if (!validSchemas.includes(schema_name)) {
              next();
              return;
            }
            switch (method) {
              case 'POST': {
                let body = [];
                req.on('data', async function (chunk) {
                  body.push(chunk);
                }).on('end', async () => {
                  body = Buffer.concat(body).toString();
                  body = JSON.parse(body)

                  const cubeId = body.with;
                  if (cubeId) {
                    const cubeContent = await local.getCubeContent(schema_name, cubeId);
                    const cubeSql = lpe.generate_koob_sql(body, {
                      _dimensions: cubeContent.dimensions.map(d => ({...d, id: `${cubeContent.source_ident}.${cubeContent.name}.${d.name}`})),
                      _cube: cubeContent,
                      _user_id: 1, // из ауф взять
                      _user_info: {},
                      _target_database: 'postgresql' // потом заполним adm.data_sources.config->_connection->>flavor
                    });
                    console.log(cubeSql);

                    const localSources = await server.getDataSources(schema_name);
                    const globalSources = await server.getDataSources("adm");
                    const currentDS = [...localSources, ...globalSources].find(ds => ds.ident === cubeContent.source_ident);
                    const isLocal = localSources.includes(currentDS);

                    const data = await server.lalala(schema_name, cubeSql, cubeContent.source_ident, isLocal);
                    const result = data.rows.map(row => {
                      return data.columns.reduce((acc, col, index) => {
                        acc[col.name] = row[index];
                        return acc;
                      }, {});
                    });

                    console.log(result);

                    const contentBuffer = Buffer.from(result.map(JSON.stringify).join('\n'));
                    res.setHeader('Content-Type', 'application/x-ndjson;charset=utf-8');
                    res.end(contentBuffer);
                  }});
                }
                break;
              case 'PUT': {
                // todo
              }
                break;
              case 'GET': {
                // todo
              }
                break;
              case 'DELETE': {
                // todo
              }
                break;
              default: {
                throw new Error(`Method ${method} not implemented`);
              }
            }
          } catch (err) {
            res.statusCode = 500;
            res.end('Error: ' + err.message);
            console.error(err);
          }
        });
      }

      // поскольку есть copy plugin, теперь не нужно сервить статику специальным образом
      // app.use('/srv/resources/', express.static(path.resolve(__dirname, '..', 'src')));
    },
    // after: function (app, server, compiler) {
    // },
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
      groupBySchemaNames(addedIds).forEach(({schema_name, ids}) => rtMiddleware.addResources(schema_name, ids.map(id => ASSETS[id])));

      modifiedIds.forEach(asset => ASSETS[asset].updated = now);
      groupBySchemaNames(modifiedIds).forEach(({schema_name, ids}) => rtMiddleware.modifyResources(schema_name, ids.map(id => ASSETS[id])));

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

if (ONLINE) {
  commands
    .loginWithSpinner()
    .then(startDev)
    .catch(err => {
      console.log(chalk.red('\nERROR:'));
      console.error(chalk.red(err.message));
    });
} else {
  startDev();
}
