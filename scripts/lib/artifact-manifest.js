const crypto = require('crypto');
const path = require('path');

const SOURCE_PACKAGE = '_sources.json';
const BUILD_METADATA = '.bi-build.json';
const FORMAT = 'luxmsbi-sources';
const VERSION = 1;

function validateRelativePath(value) {
  if (typeof value !== 'string' || !value || value.includes('\\') || value.includes('\0') ||
      path.posix.isAbsolute(value) || /^[a-zA-Z]:/.test(value) ||
      value.split('/').some(p => !p || p === '.' || p === '..' ||
        p === 'node_modules' || p === '.git' || p === BUILD_METADATA ||
        p === SOURCE_PACKAGE || /^\.env(?:\.|$)/i.test(p) || /^authConfig(?:\.|$)/i.test(p))) {
    throw new Error(`Unsafe source artifact path: ${value}`);
  }
  return value;
}
function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}
function hashConfig(value) {
  return sha256(require('./config-codec').canonicalJson(value));
}
module.exports = { SOURCE_PACKAGE, BUILD_METADATA, FORMAT, VERSION,
  validateRelativePath, assertSafePath: validateRelativePath,
  sha256, hashBytes: sha256, hashConfig };
