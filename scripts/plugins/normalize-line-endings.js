const {normalizeLineEndings, normalizeSourceMap} = require('../lib/resource-content');

module.exports = function normalizeLineEndingsLoader(source, sourceMap, meta) {
  this.callback(null, normalizeLineEndings(source), normalizeSourceMap(sourceMap), meta);
};
