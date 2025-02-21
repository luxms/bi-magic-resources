const auth = require('../../lib/auth');

function authMiddleware(req, res, next) {
  if (req.url === '/api/auth/check') {
    res.setHeader('Set-Cookie', auth.getCookies());
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    auth.login().then((loginResponse) => {
      res.end(JSON.stringify(loginResponse, null, 2));
    }).catch(err => {
      res.end(JSON.stringify({message: 'error'}));
    });
  } else if (req.url === '/api/auth/login') {
    res.setHeader('Set-Cookie', auth.getCookies());
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    auth.login().then((loginResponse) => {
      res.end(JSON.stringify(loginResponse, null, 2));
    }).catch(err => {
      res.end(JSON.stringify({message: 'error'}));
    });
  } else if (req.url === '/api/auth/logout') {
    res.setHeader('Set-Cookie', 'LuxmsBI-User-Session=; expires=Mon, 22 Sep 2014 00:00:00 GMT; path=/');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    res.end('{}');
  } else {
    next();
  }
}

module.exports = authMiddleware;
