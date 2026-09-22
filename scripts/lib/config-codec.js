const path = require('path');
const JSON5 = require('json5');
const YAML = require('yaml');

const EXTENSIONS = /\.(json5|ya?ml|json)$/i;

function isConfigPath(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  return EXTENSIONS.test(normalized) && normalized.split('/').slice(0, -1)
    .some(segment => segment === '.cubes' || /^topic\.\d+$/.test(segment));
}

function toLogicalPath(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  return isConfigPath(normalized) ? normalized.replace(EXTENSIONS, '.json') : normalized;
}

// Validate before serialization: JSON.stringify silently loses several JS/YAML values.
function normalize(value, stack = new Set()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (!value || typeof value !== 'object') throw new Error('Config contains a value that JSON cannot represent');
  if (stack.has(value)) throw new Error('Config contains a cyclic reference');
  stack.add(value);
  let result;
  if (Array.isArray(value)) {
    result = Array.from(value, item => normalize(item, stack));
  } else {
    const entries = value instanceof Map ? [...value.entries()] : Object.entries(value);
    if (!(value instanceof Map) && ![Object.prototype, null].includes(Object.getPrototypeOf(value))) {
      throw new Error('Config contains a non-JSON object');
    }
    if (Object.getOwnPropertySymbols(value).length) throw new Error('Config contains symbol keys');
    result = Object.create(null);
    for (const [key, item] of entries) {
      if (typeof key !== 'string') throw new Error('Config keys must be strings');
      result[key] = normalize(item, stack);
    }
  }
  stack.delete(value);
  return result;
}

function parseConfig(text, physicalPath) {
  try {
    let value;
    if (/\.ya?ml$/i.test(physicalPath)) {
      const document = YAML.parseDocument(String(text), { uniqueKeys: true });
      if (document.errors.length) throw document.errors[0];
      if (document.warnings.length) throw document.warnings[0];
      value = document.toJS({ mapAsMap: true, maxAliasCount: 100 });
    } else {
      value = JSON5.parse(String(text));
    }
    // Return ordinary JSON objects, avoiding prototype setters while normalizing.
    return JSON.parse(JSON.stringify(normalize(value)));
  } catch (error) {
    throw new Error(`Invalid config ${physicalPath}: ${error.message}`);
  }
}

function stringifyConfig(value, physicalPath) {
  const normalized = normalize(value);
  const extension = path.extname(physicalPath).toLowerCase();
  if (extension === '.yaml' || extension === '.yml') return YAML.stringify(JSON.parse(JSON.stringify(normalized)));
  if (extension === '.json5' || (extension === '.json' && isConfigPath(physicalPath))) return JSON5.stringify(normalized, null, 2) + '\n';
  return JSON.stringify(normalized, null, 2) + '\n';
}

function canonicalJson(value) {
  const sort = item => {
    if (Array.isArray(item)) return item.map(sort);
    if (!item || typeof item !== 'object') return item;
    const result = Object.create(null);
    for (const key of Object.keys(item).sort()) result[key] = sort(item[key]);
    return result;
  };
  return JSON.stringify(sort(normalize(value)));
}

module.exports = { isConfigPath, toLogicalPath, parseConfig, stringifyConfig, canonicalJson };
