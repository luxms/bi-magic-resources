const {test, before, after} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const https = require('node:https');
const {execFileSync} = require('node:child_process');
const config = require('../lib/config');
const auth = require('../lib/auth');
const Server = require('../platforms/Server');
const middleware = require('../server/middlewares/auth-middleware');

let server, baseUrl, directory;
let requests = [];
let response = {status: 200, body: {id: 42}};
const session = 'test-browser-session';
before(async () => {
  directory = fs.mkdtempSync(path.join(os.tmpdir(), 'bi-session-test-'));
  const key = path.join(directory, 'key.pem'), cert = path.join(directory, 'cert.pem');
  execFileSync('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-keyout', key, '-out', cert, '-days', '1', '-subj', '/CN=localhost'], {stdio: 'ignore'});
  server = https.createServer({key: fs.readFileSync(key), cert: fs.readFileSync(cert)}, (req, res) => {
    requests.push({url: req.url, cookie: req.headers.cookie, method: req.method});
    req.resume();
    res.writeHead(response.status, {'Content-Type': 'application/json', ...(response.headers || {})});
    res.end(typeof response.body === 'string' ? response.body : JSON.stringify(response.body));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `https://127.0.0.1:${server.address().port}`;
  config.OPTIONS_CACHE = {session, insecureSessionTls: true};
  auth._setBaseUrl(baseUrl);
});
after(async () => {
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
  fs.rmSync(directory, {recursive: true, force: true});
});

test('session config takes precedence, masks logs, and supports CLI/environment values', () => {
  config.OPTIONS_CACHE = {};
  config.AUTH_CONFIG_CACHE = {session, jwt: 'ignored-token', insecureSessionTls: false};
  assert.equal(config.getAuthConfig().SESSION, session);
  assert.equal(config.getJWT(), '');
  assert.equal(config.getOption('insecureSessionTls'), false);
  config.OPTIONS_CACHE.server = baseUrl;
  config.CONFIG_CACHE = {};
  const lines = [], log = console.log;
  console.log = (...args) => lines.push(args.join(' '));
  try { config.logAuthParams(); } finally { console.log = log; }
  assert.ok(!lines.join('\n').includes(session));
  const args = process.argv;
  process.argv = ['node', 'test', '--session=cli-session', '--insecure-session-tls=false'];
  try {
    config.OPTIONS_CACHE = {};
    assert.equal(config.getAuthConfig().SESSION, 'cli-session');
    assert.equal(config.getOption('insecureSessionTls'), 'false');
  } finally { process.argv = args; }
  const previous = process.env.BI_SESSION;
  process.env.BI_SESSION = 'env-session';
  try { config.OPTIONS_CACHE = {}; assert.equal(config.getAuthConfig().SESSION, 'env-session'); }
  finally {
    if (previous === undefined) delete process.env.BI_SESSION; else process.env.BI_SESSION = previous;
    config.OPTIONS_CACHE = {session, insecureSessionTls: true};
  }
});

test('browser session authenticates and works for resource reads and writes', async () => {
  response = {status: 200, body: {id: 42}};
  assert.equal((await auth._getAuthenticationMethod()).id, 42);
  assert.equal(auth.getCookies(), `LuxmsBI-User-Session=${session}`);
  const platform = new Server();
  await platform.readFile('api/test');
  await platform.writeFile('api/test', {test: true});
  await platform.updateFile('api/test', 'test');
  await platform.deleteFile('api/test');
  assert.deepEqual(requests.slice(-4).map(r => r.method), ['GET', 'POST', 'PUT', 'DELETE']);
  assert.ok(requests.every(r => r.cookie === `LuxmsBI-User-Session=${session}`));
  const count = requests.length;
  await auth.logout();
  assert.equal(requests.length, count, 'imported browser session must not be logged out');
});

test('session check rejects redirects, expired sessions and HTML login pages', async () => {
  for (const reply of [
    {status: 302, headers: {Location: baseUrl + '/sso'}, body: {}},
    {status: 401, body: {}},
    {status: 200, body: '<html>SSO</html>'},
    {status: 200, body: {}},
  ]) {
    response = reply;
    const count = requests.length;
    await assert.rejects(auth._loginWithSession(session));
    assert.equal(requests.length, count + 1);
  }
  response = {status: 302, headers: {Location: baseUrl + '/sso'}, body: {}};
  const count = requests.length;
  await assert.rejects(new Server().readFile('api/test'));
  assert.equal(requests.length, count + 1, 'sync must not follow redirects either');
});

test('TLS bypass is explicit, and insecure HTTP or malformed cookies are rejected', async () => {
  response = {status: 200, body: {id: 42}};
  for (const value of [false, 'false', '0']) {
    config.OPTIONS_CACHE.insecureSessionTls = value;
    await assert.rejects(auth._loginWithSession(session), /certificate/i);
  }
  config.OPTIONS_CACHE.insecureSessionTls = true;
  auth._setBaseUrl(baseUrl.replace('https:', 'http:'));
  await assert.rejects(auth._loginWithSession(session), /HTTPS/);
  auth._setBaseUrl(baseUrl);
  await assert.rejects(auth._loginWithSession('bad; cookie'), /Invalid session/);
});

test('dev middleware forwards cookie on first page and scopes the local cookie to root', async () => {
  const req = {url: '/', headers: {}}, res = {};
  let next = false;
  middleware(req, res, () => { next = true; });
  assert.equal(next, true);
  assert.equal(req.headers.cookie, `LuxmsBI-User-Session=${session}`);
  auth.LOGIN_PROMISE = Promise.resolve({id: 42});
  const headers = {};
  await new Promise(resolve => middleware({url: '/api/auth/check', headers: {}}, {
    setHeader(key, value) { headers[key] = value; },
    end(body) { assert.equal(JSON.parse(body).id, 42); resolve(); },
  }, () => {}));
  assert.equal(headers['Set-Cookie'], `LuxmsBI-User-Session=${session}; Path=/; HttpOnly; SameSite=Lax`);
});
