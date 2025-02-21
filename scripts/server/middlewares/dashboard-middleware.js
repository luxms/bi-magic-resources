const parse = require('url-parse')
const createEntity = require('../../lib/createEntity');
const Local = require('../../platforms/Local');
const Server = require('../../platforms/Local');

const local = new Local('src');
const server = new Server();

async function dashboardMiddleware(req, res, next) {
  try {
    const { method, url } = req;
    let resource = parse(url, true).pathname;
    resource = resource.replace('/', '');
    const dashboardId = parseInt(resource);

    const schemaName = req.params.schema_name;
    const validSchemas = await local.getSchemaNames();
    if (!validSchemas.includes(schemaName)) {
      next();
      return;
    }

    const paths = await local.dashboards.enumerate(schemaName);
    const topicsId = await local.dashboards.getTopicsId(schemaName);

    let topicId;
    if (!isNaN(dashboardId)) {
      const path = paths.find((t) => t.includes(`dashboard.${dashboardId}/`));
      const [topicName] = path.split('/');
      topicId = parseInt(topicName.substring(topicName.indexOf('.') + 1, topicName.length));
    }

    let dashboards = await local.dashboards.getDashboards(schemaName);
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
          const jsonBody = { id: dashboardId, ...JSON.parse(data) };
          const db = dashboards.find((r) => r.config.includes(`dashboard.${resource}/index.json`));
          await local.dashboards.updateContent(db.config, jsonBody);
          res.setHeader('Content-Type', 'application/json');
          res.end(Buffer.from(JSON.stringify(jsonBody)));
        })
      }
        break;
      case 'POST': {
        req.on('data', async function (chunk) {
          const data = chunk;
          let jsonBody = { ...JSON.parse(data) };
          if (!topicId) {
            if (data.hasOwnProperty('topic_id')) topicId = data.topic_id;
            else if (topicsId.length) topicId = topicsId[0];
          }
          jsonBody = await createEntity(local, server, schemaName, topicId, undefined, jsonBody);
          if (jsonBody) {
            res.setHeader('Content-Type', 'application/json');
            res.end(Buffer.from(JSON.stringify(jsonBody)));
          } else {
            throw new Error('Failed to create a dashboard');
          }
        })
      }
        break;
      case 'DELETE': {
        const db = dashboards.find((r) => r.config.includes(`topic.${topicId}/dashboard.${resource}/`));
        await local.dashboards.deleteContent(db.config);
        res.setHeader('Content-Type', 'application/json');
        res.end(Buffer.from(JSON.stringify('The dashboard was removed')));
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
}

async function dashletMiddleware(req, res, next) {
  try {
    const {method, url} = req;
    let resource = parse(url, true).pathname;
    resource = resource.replace('/', '');
    const dashletdId = parseInt(resource);

    const schemaName = req.params.schema_name;
    const validSchemas = await local.getSchemaNames();
    if (!validSchemas.includes(schemaName)) {
      next();
      return;
    }

    let dashlets = await local.dashboards.getDashlets(schemaName);
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
          await local.dashboards.updateContent(dash.config, jsonBody);
          res.setHeader('Content-Type', 'application/json');
          res.end(Buffer.from(JSON.stringify(jsonBody)));
        })
      }
        break;
      case 'POST': {
        req.on('data', async function (chunk) {
          const data = chunk;
          let jsonBody = {...JSON.parse(data)};
          const paths = await local.dashboards.enumerate(schemaName);
          const topicsId = await local.dashboards.getTopicsId(schemaName);

          let topicId;
          let dashboard_id = jsonBody.hasOwnProperty('dashboard_id') ? jsonBody['dashboard_id'] : undefined;
          let dashboards = await local.dashboards.getDashboards(schemaName);
          if (dashboard_id) {
            const path = paths.find((c) => c.includes(`dashboard.${dashboard_id}/`));
            const [topicName] = path.split('/');
            topicId = parseInt(topicName.substring(topicName.indexOf('.') + 1, topicName.length));
          }

          let exist = dashboard_id && dashboards.some((d) => d.config.includes(`dashboard.${dashboard_id}/`));
          if (!exist) {
            if (!topicId) {
              if (topicsId.length) topicId = topicsId[0];
              else topicId = await server.dashboards.getId({schemaName});
            }
            dashboard_id = await server.dashboards.getId({schemaName, topicId});
          }

          jsonBody = await createEntity(local, server, schemaName, topicId, dashboard_id, jsonBody);
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
        await local.dashboards.deleteContent(dash.config);
        res.setHeader('Content-Type', 'application/json');
        res.end(Buffer.from(JSON.stringify('The dashboard was removed')));
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
}

module.exports = {
  dashboardMiddleware,
  dashletMiddleware,
};
