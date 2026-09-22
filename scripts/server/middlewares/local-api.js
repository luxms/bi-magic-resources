const { URL } = require('url');

function httpError(statusCode, message) {
  return Object.assign(new Error(message), { statusCode });
}
function sendJson(res, value, statusCode = 200) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(value));
}
function sendError(res, error) {
  if (!res.writableEnded) sendJson(res, { error: error.message }, error.statusCode || 500);
}
async function readJsonBody(req) {
  const chunks = [];
  let length = 0;
  for await (const chunk of req) {
    const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    length += bytes.length;
    if (length > 16 * 1024 * 1024) throw httpError(413, 'JSON body is too large');
    chunks.push(bytes);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch (_) { throw httpError(400, 'Invalid JSON request body'); }
}
function objectBody(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw httpError(400, 'Expected a JSON object');
  return value;
}
function route(req) {
  const url = new URL(req.url, 'http://local');
  let resource;
  try { resource = decodeURIComponent(url.pathname).replace(/^\/+|\/+$/g, ''); }
  catch (_) { throw httpError(400, 'Invalid URL encoding'); }
  return { resource, nextId: url.searchParams.has('next_id') };
}
function integerId(value, label = 'id') {
  if ((typeof value !== 'number' && typeof value !== 'string') || !/^\d+$/.test(String(value)) || !Number.isSafeInteger(Number(value))) {
    throw httpError(400, `Invalid ${label}`);
  }
  return Number(value);
}
function mergePartial(current, patch) {
  if (!patch || typeof patch !== 'object' || Array.isArray(patch)) return patch;
  const result = { ...current };
  for (const key of Object.keys(patch)) {
    const value = patch[key];
    const next = value && typeof value === 'object' && !Array.isArray(value)
      ? mergePartial(current?.[key] && typeof current[key] === 'object' && !Array.isArray(current[key]) ? current[key] : {}, value)
      : value;
    Object.defineProperty(result, key, { value: next, enumerable: true, writable: true, configurable: true });
  }
  return result;
}
// The browser's repositories use chained .filter(...).order_by(...) expressions.
// Only equality filters are needed for local entity tables; reject unknown syntax.
function selectRows(rows, expression) {
  let remaining = expression;
  let selected = rows.slice();
  while (remaining) {
    const match = remaining.match(/^\.(filter|order_by)\(([^)]*)\)/);
    if (!match) throw httpError(400, `Unsupported local query: ${expression}`);
    const [, operation, args] = match;
    if (operation === 'filter') {
      for (const clause of args.split('&&').filter(Boolean)) {
        const condition = clause.match(/^\s*([A-Za-z_]\w*)\s*=\s*(?:'((?:[^']|'')*)'|"([^"]*)"|(-?\d+(?:\.\d+)?)|(null|true|false))\s*$/);
        if (!condition) throw httpError(400, `Unsupported local filter: ${clause}`);
        const [, field, single, double, number, literal] = condition;
        const value = single !== undefined ? single.replace(/''/g, "'") : double !== undefined ? double : number !== undefined ? Number(number) : JSON.parse(literal);
        selected = selected.filter(row => row[field] === value);
      }
    } else {
      const fields = args.split(',').filter(Boolean).map(x => x.trim());
      if (fields.some(field => !/^-?[A-Za-z_]\w*$/.test(field))) throw httpError(400, 'Invalid local ordering');
      selected.sort((a, b) => {
        for (const field of fields) {
          const descending = field.startsWith('-');
          const key = descending ? field.slice(1) : field;
          const av = a[key] ?? '', bv = b[key] ?? '';
          const comparison = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
          if (comparison) return descending ? -comparison : comparison;
        }
        return 0;
      });
    }
    remaining = remaining.slice(match[0].length);
  }
  return selected;
}
function mutationQueue() {
  const pending = new Map();
  return async (key, operation) => {
    const previous = pending.get(key) || Promise.resolve();
    const result = previous.catch(() => {}).then(operation);
    pending.set(key, result);
    try { return await result; }
    finally { if (pending.get(key) === result) pending.delete(key); }
  };
}
module.exports = { httpError, sendJson, sendError, readJsonBody, objectBody, route, integerId, mergePartial, selectRows, mutationQueue };
