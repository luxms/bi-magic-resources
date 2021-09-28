const connect = require('connect');
const http = require('http');
const fs = require('fs');
const path = require('path');
const parse = require('url-parse')
const mime = require('mime-types');
const { createProxyMiddleware } = require('http-proxy-middleware');
const local = require('./lib/local');
const server = require('./lib/server');
const config = require('./lib/config');
const { splitResource } = require('./lib/utils');
const { loginWithSpinner }  = require('./lib/commands');


// initialize server module
config.getSUPConfigAndLog();
loginWithSpinner().then(start);


async function fixResourceIdToName(resource) {
  const [schemaName, resourceIdOrName] = splitResource(resource);
  if (resourceIdOrName.match(/^\d+$/)) {
    // TODO
    throw new Error('Not implemented');
  } else {
    return `/${schemaName}/${encodeURIComponent(resourceIdOrName)}`;
  }
}


function start(loginResponse) {
  const app = connect();

  app.use('/srv/resources/', async function(req, res, next){
    try {
      const {method, url} = req;
      const resource = await fixResourceIdToName(parse(url, true).pathname);
      const [schema_name] = splitResource(resource);
      const validSchemas = await local.getSchemaNames();

      if (!validSchemas.includes(schema_name)) {
        next();
        return;
      }

      if (method === 'GET') {
        const content = await local.getResourceContent(resource);
        if (content === null) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain');
          res.end(`Not found: ${resource}`);
        } else {
          res.setHeader('Content-Type', mime.lookup(resource) || 'application/octet-stream');
          res.end(content);
        }

      } else {
        throw new Error(`Method ${method} not implemented`)
      }
    } catch (err) {
      res.statusCode = 500;
      res.end('Error: ' + err.message);
      console.error(err);
    }
  });


  try {
    const settingsJs = path.join(__dirname, '..', 'settings.js');
    fs.statSync(settingsJs);

    app.use('/settings/settings.js', function(req, res) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.end(fs.readFileSync(settingsJs, 'utf8'));
    });

  } catch (err) {
    // skip
  }

  app.use('/api/auth/check', (req, res) => {
    res.setHeader('Set-Cookie', server.getCookies());
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(loginResponse));
  });
  app.use('/api/auth/login', (req, res) => {                                                        // stub
    res.setHeader('Set-Cookie', server.getCookies());
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(loginResponse));
  });
  app.use('/api/auth/logout', (req, res) => {                                                       // stub
    res.setHeader('Set-Cookie', 'LuxmsBI-User-Session=; expires=Mon, 22 Sep 2014 00:00:00 GMT; path=/');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end('{}');
  });


  const SERVER = config.getServer();
  const PORT = config.getPort();

  // app.use(parse(SERVER).pathname, createProxyMiddleware({ target: parse(SERVER).origin, changeOrigin: true, secure: true }));
  app.use('/', createProxyMiddleware({ target: SERVER, changeOrigin: true, secure: true }));

  console.log(`Server running on http://localhost:${PORT}`);

  http.createServer(app).listen(PORT);
}

