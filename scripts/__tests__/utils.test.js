const assert = require('node:assert/strict');
const test = require('node:test');
const { splitResource, encodePath, decodePath } = require('../lib/utils');

test('splitResource decodes resource names and rejects invalid identifiers', () => {
  assert.deepEqual(
    splitResource('/ds_sales/Annual%20report%2Fsummary.json'),
    ['ds_sales', 'Annual report/summary.json'],
  );
  assert.throws(() => splitResource('ds_sales/report.json'), /Invalid schema name and resource/);
});

test('encodePath and decodePath preserve special characters across path separators', () => {
  const encoded = encodePath(String.raw`ds_sales\reports 2026\profit & loss#1.json`);

  assert.equal(encoded, 'ds_sales/reports%202026/profit%20%26%20loss%231.json');
  assert.equal(decodePath(encoded), 'ds_sales/reports 2026/profit & loss#1.json');
});
