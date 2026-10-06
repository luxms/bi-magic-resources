const test = require('node:test');
const assert = require('node:assert/strict');
const { parseCubePath, makeCubeRtMessages, createCubeChangeTracker } = require('../lib/cube-watcher');

const file = 'ds_test/.cubes/source.sales.json5';
const parsed = parseCubePath(file);
const cube = {source_ident: 'source', name: 'sales', title: 'Sales', dimensions: [{name: 'amount', title: 'Amount', config: {type: 'number'}}]};

test('cube paths use every config source format and preserve dotted composite ids', () => {
  for (const extension of ['json', 'json5', 'yaml', 'yml']) {
    assert.deepEqual(parseCubePath(`ds_test/.cubes/source.with.dots.sales.total.${extension}`), {schema: 'ds_test', id: 'source.with.dots.sales.total'});
  }
  for (const invalid of ['ds_test/topic.1/index.json', 'ds_test/resource.json5', '../.cubes/a.json', 'ds_test/.cubes/folder/a.json']) assert.equal(parseCubePath(invalid), null);
});

test('cube and dimension upserts use the exact frontend table payload shape', () => {
  const messages = makeCubeRtMessages('add', parsed, cube);
  assert.deepEqual(messages, [
    {type: 'ADD_CUBES', payload: {source_ident: 'source', name: 'sales', title: 'Sales', id: 'source.sales', is_source_global: 0, is_global: 0}},
    {type: 'ADD_DIMENSIONS', payload: {name: 'amount', title: 'Amount', config: {type: 'number'}, id: 'source.sales.amount', source_ident: 'source', cube_id: 'source.sales', cube_name: 'sales', is_cube_global: 0, is_global: 0}},
  ]);
  assert.equal(Array.isArray(messages[0].payload), false);
});

test('changes remove disappeared dimensions and upsert only changed values', () => {
  const current = {...cube, dimensions: [{name: 'count', title: 'Count'}]};
  assert.deepEqual(makeCubeRtMessages('change', parsed, current, cube).map(m => [m.type, m.payload.id]), [
    ['DELETE_DIMENSIONS', 'source.sales.amount'], ['ADD_DIMENSIONS', 'source.sales.count'],
  ]);
  assert.deepEqual(makeCubeRtMessages('change', parsed, {...cube}, cube), []);
  const changed = {...cube, dimensions: [{...cube.dimensions[0], title: 'New amount'}]};
  assert.equal(makeCubeRtMessages('change', parsed, changed, cube)[0].payload.title, 'New amount');
});

test('renamed cube identities remove old dimensions and cube before adding new ones', () => {
  const current = {...cube, source_ident: 'source.with.dots', name: 'sales.total'};
  assert.deepEqual(makeCubeRtMessages('change', parsed, current, cube).map(m => [m.type, m.payload.id]), [
    ['DELETE_DIMENSIONS', 'source.sales.amount'], ['DELETE_CUBES', 'source.sales'],
    ['ADD_CUBES', 'source.with.dots.sales.total'], ['ADD_DIMENSIONS', 'source.with.dots.sales.total.amount'],
  ]);
});

test('tracker seeds original snapshots for deletion, copies values, and survives invalid intermediate changes', () => {
  const tracker = createCubeChangeTracker();
  const content = JSON.parse(JSON.stringify(cube));
  assert.equal(tracker.seed(file, content), true);
  content.dimensions[0].name = 'mutated outside';
  assert.throws(() => tracker.update('change', file, {name: 'invalid'}), /source_ident/);
  assert.deepEqual(tracker.update('unlink', file), {schema: 'ds_test', messages: [
    {type: 'DELETE_DIMENSIONS', payload: {id: 'source.sales.amount'}},
    {type: 'DELETE_CUBES', payload: {id: 'source.sales'}},
  ]});
  assert.deepEqual(tracker.update('unlink', file).messages, [{type: 'DELETE_CUBES', payload: {id: 'source.sales'}}]);
});

test('tracker canonicalizes extensions and rejects ambiguous dimension identities', () => {
  const tracker = createCubeChangeTracker();
  tracker.seed(file, cube);
  assert.deepEqual(tracker.update('change', 'ds_test/.cubes/source.sales.yaml', cube).messages, []);
  assert.throws(() => tracker.update('change', file, {...cube, dimensions: [{name: 'same'}, {name: 'same'}]}), /unique/);
  assert.equal(tracker.update('change', 'ds_test/plain.yaml', cube), null);
});
