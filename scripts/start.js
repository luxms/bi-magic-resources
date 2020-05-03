const connect = require('connect');
const http = require('http');
const parse = require('url-parse')
const { createProxyMiddleware } = require('http-proxy-middleware');
const { getResourceContent } = require('./lib/local');

const app = connect();

app.use('/srv/resources/', function(req, res, next){
  try {
    const {method, url} = req;
    const resource = parse(url, true).pathname;

    if (method === 'GET') {
      const content = getResourceContent(resource);
      if (content === null) {
        res.statusCode = 404
        res.end(`Not found: ${resource}`);
      } else {
        res.end(content);
      }

    } else {
      throw new Error(`Method ${method} not implemented`)
    }
  } catch (err) {
    res.statusCode = 500;
    res.end('Error: ' + err.message);
  }
});

app.use('/', createProxyMiddleware({ target: 'http://192.168.101.134', changeOrigin: true }));

http.createServer(app).listen(3000);
