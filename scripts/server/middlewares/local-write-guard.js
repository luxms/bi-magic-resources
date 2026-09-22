const path = require('path');

const READ_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const ENTITY_PATH = /^\/api\/db\/[^/]+\.(dashboard_topics|dashboards|dashlets|cubes|dimensions|resources)(?:[/.]|$)/i;
const RESOURCE_PATH = /^\/srv\/resources(?:\/|$)/i;

function pathnameOf(url) {
  let pathname = String(url || '/');
  if (/^https?:\/\//i.test(pathname)) pathname = new URL(pathname).pathname;
  else pathname = pathname.split('?')[0];
  // Normalize encoded route separators as well: an unhandled local write must
  // not become an upstream entity write after proxy/backend URL decoding.
  for (let n = 0; n < 2 && /%[0-9a-f]{2}/i.test(pathname); n++) pathname = decodeURIComponent(pathname);
  return path.posix.normalize('/' + pathname.replace(/\\/g, '/').replace(/^\/+/, ''));
}

function isProtectedWrite(req, enabled = {}) {
  const protects = pathname => {
    const table = ENTITY_PATH.exec(pathname)?.[1].toLowerCase();
    const block = table && (['dashboard_topics', 'dashboards', 'dashlets'].includes(table)
      ? 'dashboards' : ['cubes', 'dimensions'].includes(table) ? 'cubes' : 'resources');
    return block ? enabled[block] !== false : RESOURCE_PATH.test(pathname) && enabled.resources !== false;
  };
  const override = req.headers?.['x-http-method-override'] || req.headers?.['x-method-override'];
  const method = String(req.method || 'GET').toUpperCase();
  const readOnly = READ_METHODS.has(method) && (!override || READ_METHODS.has(String(override).toUpperCase()));
  const raw = req.originalUrl || req.url || '/';
  try {
    const pathname = pathnameOf(raw);
    // The server's GET ?next_id advances its ID sequence. Local handlers must
    // reserve those IDs locally; an enabled local block must not proxy it.
    const reservesId = new URL(raw, 'http://local').searchParams.has('next_id');
    if (readOnly) return reservesId && ENTITY_PATH.test(pathname) && protects(pathname);
    return protects(pathname);
  } catch (_) {
    // Malformed encoded mutation URLs in the managed API namespace are rejected,
    // without restricting login, data-query POSTs, or other unrelated APIs.
    return !readOnly && protects(String(raw).split('?')[0]);
  }
}

// Mount after local CRUD handlers and before every upstream proxy.
// Disabled blocks are owned by the upstream, including mutations and next_id.
function localWriteGuard(req, res, next, enabled) {
  if (!isProtectedWrite(req, enabled)) return next();
  res.statusCode = 403;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify({
    error: 'LOCAL_WRITE_NOT_HANDLED',
    message: 'This configuration or resource write was not handled locally. It was blocked to avoid changing the upstream server. Use a supported local route for this enabled block.',
  }));
}

function createLocalWriteGuard(enabled) {
  return (req, res, next) => localWriteGuard(req, res, next, enabled);
}

module.exports = { localWriteGuard, createLocalWriteGuard, isProtectedWrite };
