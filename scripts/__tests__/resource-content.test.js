const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const {
  normalizeLineEndings,
  normalizeSourceMap,
  normalizeResourceContent,
  equalContentBytes,
} = require('../lib/resource-content');
const Local = require('../platforms/Local');

test('normalizeLineEndings handles empty, mixed and repeated line endings without adding a final newline', () => {
  for (const [source, expected] of [
    ['', ''],
    ['no final newline', 'no final newline'],
    ['a\nb\n', 'a\nb\n'],
    ['a\r\nb\rc\n', 'a\nb\nc\n'],
    ['\r\n\r\r\n', '\n\n\n'],
    ['  a\t\r\n b  ', '  a\t\n b  '],
    ['\uFEFFa\u0085b\u2028c\u2029d', '\uFEFFa\u0085b\u2028c\u2029d'],
    [String.raw`a\r\nb\nc`, String.raw`a\r\nb\nc`],
  ]) {
    const normalized = normalizeLineEndings(source);
    assert.equal(normalized, expected, JSON.stringify(source));
    assert.equal(normalizeLineEndings(normalized), expected, 'normalization must be idempotent');
  }
});

test('normalizeLineEndings rejects missing values and values without a replace method', () => {
  for (const value of [null, undefined, 42, false, {}]) {
    assert.throws(() => normalizeLineEndings(value), TypeError);
  }
});

test('normalizeSourceMap returns absent and unsupported maps unchanged', () => {
  for (const sourceMap of [
    null, undefined, {},
    {version: 2, sourcesContent: ['a\r\nb']},
    {version: '3', sourcesContent: ['a\r\nb']},
  ]) assert.strictEqual(normalizeSourceMap(sourceMap), sourceMap);
});

test('normalizeSourceMap changes only source text and does not mutate the input', () => {
  const sourceMap = {
    version: 3, file: 'bundle.js', sourceRoot: '../src',
    sources: ['a.ts', 'b.ts'], names: ['value'], mappings: 'AAAA',
    sourcesContent: ['first\r\nsecond\rthird; "\\r\\n"', null],
    x_metadata: {label: 'preserve\r\nthis'},
  };
  const before = structuredClone(sourceMap);
  const normalized = normalizeSourceMap(sourceMap);

  assert.deepEqual(normalized, {...before, sourcesContent: ['first\nsecond\nthird; "\\r\\n"', null]});
  assert.deepEqual(sourceMap, before, 'input map must remain unchanged');
  assert.notStrictEqual(normalized, sourceMap);
  assert.notStrictEqual(normalized.sourcesContent, sourceMap.sourcesContent);
  assert.strictEqual(normalized.sources, sourceMap.sources);
  assert.strictEqual(normalized.names, sourceMap.names);
  assert.strictEqual(normalized.x_metadata, sourceMap.x_metadata);
  assert.deepEqual(normalizeSourceMap(normalized), normalized);
});

test('normalizeSourceMap recursively handles nested sections without changing offsets or external references', () => {
  const externalSection = {offset: {line: 20, column: 2}, url: 'external.map'};
  const unsupportedMap = {version: 2, sourcesContent: ['keep\r\nthis']};
  const sourceMap = {
    version: 3,
    sections: [
      {offset: {line: 0, column: 0}, map: {
        version: 3,
        sections: [{offset: {line: 1, column: 4}, map: {
          version: 3, sourcesContent: ['a\r\nb\rc', null], mappings: 'AAAA',
        }}],
      }},
      externalSection,
      {offset: {line: 30, column: 0}, map: unsupportedMap},
    ],
  };
  const before = structuredClone(sourceMap);
  const normalized = normalizeSourceMap(sourceMap);
  const expected = structuredClone(sourceMap);
  expected.sections[0].map.sections[0].map.sourcesContent[0] = 'a\nb\nc';

  assert.deepEqual(normalized, expected);
  assert.deepEqual(sourceMap, before);
  assert.notStrictEqual(normalized.sections, sourceMap.sections);
  assert.notStrictEqual(normalized.sections[0], sourceMap.sections[0]);
  assert.strictEqual(normalized.sections[0].offset, sourceMap.sections[0].offset);
  assert.strictEqual(normalized.sections[1], externalSection);
  assert.strictEqual(normalized.sections[2].map, unsupportedMap);
});

test('normalizeSourceMap tolerates missing optional arrays and preserves non-string source entries', () => {
  for (const sourceMap of [
    {version: 3},
    {version: 3, sourcesContent: null, sections: undefined},
    {version: 3, sourcesContent: ['a\nb', null, 42, false]},
  ]) assert.deepEqual(normalizeSourceMap(sourceMap), sourceMap);
});

test('text resources use LF without changing literal escape sequences or Unicode', () => {
  const source = Buffer.from('Привет\r\nnext\rlast\n"\\r\\n"');
  const normalized = normalizeResourceContent('/ds_res/report%20name.JS', source);
  assert.equal(normalized.toString(), 'Привет\nnext\nlast\n"\\r\\n"');
  assert.strictEqual(normalizeResourceContent('test.js', normalized), normalized);
  assert.equal(normalizeResourceContent('test.css', 'a\r\nb'), 'a\nb');
});

test('resource normalization preserves BOM, Unicode and the input buffer', () => {
  const source = Buffer.from('\uFEFFПривет 👋\r\n  last\t');
  const before = Buffer.from(source);
  const normalized = normalizeResourceContent(path.join('folder.with.dots', 'FILE.TXT'), source);

  assert.ok(Buffer.isBuffer(normalized));
  assert.notStrictEqual(normalized, source);
  assert.equal(normalized.toString('utf8'), '\uFEFFПривет 👋\n  last\t');
  assert.deepEqual(source, before);
});

test('unchanged, empty and unsupported resource contents keep their identity', () => {
  for (const [name, content] of [
    ['empty.txt', Buffer.alloc(0)],
    ['empty.txt', ''],
    ['already.txt', Buffer.from('a\nb\n')],
    ['unknown.data', 'a\r\nb'],
    ['no-extension', Buffer.from('a\r\nb')],
    ['resource.txt', null],
    ['resource.txt', undefined],
    ['resource.txt', 42],
    ['resource.txt', false],
    ['resource.txt', new Uint8Array([13, 10])],
    ['resource.json', Object.freeze({code: 'a\r\nb'})],
    ['resource.json', Object.freeze(['a\r\nb'])],
  ]) assert.strictEqual(normalizeResourceContent(name, content), content, name);
});

test('binary, unknown formats and invalid UTF-8 are preserved and compared by bytes', () => {
  for (const [name, bytes] of [
    ['picture.png', Buffer.from('binary\r\n')],
    ['unknown.data', Buffer.from('text\r\n')],
    ['wrong.txt', Buffer.from([0xff, 13, 10])],
    ['utf16.txt', Buffer.from('a\r\nb', 'utf16le')],
  ]) assert.strictEqual(normalizeResourceContent(name, bytes), bytes);
  assert.equal(equalContentBytes(Buffer.from([0x80]), Buffer.from([0x81])), false);
  assert.equal(equalContentBytes(Buffer.from('hello'), 'hello'), true);
  assert.equal(equalContentBytes(null, Buffer.alloc(0)), false);
});

test('text-like extensions do not cause binary or malformed UTF-8 bytes to be rewritten', () => {
  for (const bytes of [
    Buffer.from('a\0\r\nb'),
    Buffer.from([0xc3, 13, 10]), // Incomplete UTF-8 character.
    Buffer.from([0xc0, 0xaf, 13, 10]), // Overlong UTF-8 encoding.
    Buffer.from([0xed, 0xa0, 0x80, 13, 10]), // UTF-8 encoding of a surrogate.
    Buffer.from([0x80, 13, 10]), // Continuation byte without a leading byte.
  ]) {
    const before = Buffer.from(bytes);
    assert.strictEqual(normalizeResourceContent('suspect.txt', bytes), bytes);
    assert.deepEqual(bytes, before);
  }
  const withNul = 'a\0\r\nb';
  assert.equal(normalizeResourceContent('suspect.txt', withNul), withNul);
  // A correctly encoded replacement character is valid text, not damaged UTF-8.
  assert.equal(normalizeResourceContent('valid.txt', Buffer.from('\uFFFD\r\n')).toString(), '\uFFFD\n');
});

test('JSON formatting is normalized without changing string values or parsed objects', () => {
  const data = {code: 'a\r\nb'};
  assert.strictEqual(normalizeResourceContent('config.json', data), data);
  const text = JSON.stringify(data, null, 2).replace(/\n/g, '\r\n');
  assert.deepEqual(JSON.parse(normalizeResourceContent('config.json', text)), data);
  assert.ok(!normalizeResourceContent('config.json', text).includes('\r'));
});

test('source maps normalize embedded source text, including indexed maps', () => {
  const makeMap = eol => ({
    version: 3, sources: ['a.ts'], names: ['value'], mappings: 'AAAA',
    sourcesContent: ['first' + eol + 'second; "\\r\\n"', null],
  });
  const lf = makeMap('\n');
  const crlf = makeMap('\r\n');
  assert.equal(normalizeResourceContent('a.js.map', JSON.stringify(crlf, null, 2)), JSON.stringify(lf));
  const indexed = {version: 3, sections: [{offset: {line: 0, column: 0}, map: crlf}]};
  const normalized = JSON.parse(normalizeResourceContent('indexed.map', JSON.stringify(indexed)));
  assert.deepEqual(normalized.sections[0].map, lf);
  assert.equal(normalizeResourceContent('other.map', 'not json\r\n'), 'not json\n');
});

test('source map serialization is compact and idempotent and retains Buffer output', () => {
  const sourceMap = {version: 3, sourcesContent: ['a\r\nb'], mappings: 'AAAA'};
  const source = Buffer.from(JSON.stringify(sourceMap, null, 2) + '\r\n');
  const before = Buffer.from(source);
  const normalized = normalizeResourceContent('bundle.js.MAP', source);
  assert.ok(Buffer.isBuffer(normalized));
  assert.equal(normalized.toString(), '{"version":3,"sourcesContent":["a\\nb"],"mappings":"AAAA"}');
  assert.deepEqual(source, before);
  assert.strictEqual(normalizeResourceContent('bundle.js.map', normalized), normalized);
});

test('unrecognized or malformed source maps only normalize physical line endings', () => {
  for (const text of [
    'not JSON\r\n',
    'null\r\n',
    '{\r\n  "version": 2, "sourcesContent": ["a\\r\\nb"]\r\n}\r\n',
    '{\r\n  "version": "3", "sourcesContent": ["a\\r\\nb"]\r\n}\r\n',
    '{\r\n  "version": 3, "sourcesContent": ["a\\r\\nb"], "sections": [null]\r\n}\r\n',
  ]) {
    assert.equal(normalizeResourceContent('other.map', text), text.split('\r\n').join('\n'));
  }
});

test('byte comparison preserves binary distinctions and treats CRLF and LF as different', () => {
  for (const [left, right, expected] of [
    [Buffer.from([0x80, 13, 10]), Buffer.from([0x81, 13, 10]), false],
    [Buffer.from([0xff, 0, 13, 10]), Buffer.from([0xff, 0, 13, 10]), true],
    [Buffer.from('Привет 👋'), 'Привет 👋', true],
    [Buffer.alloc(0), '', true],
    [Buffer.from('a\r\nb'), Buffer.from('a\nb'), false],
    ['a\r\nb', 'a\nb', false],
    [Buffer.from('abc'), Buffer.from('abcd'), false],
  ]) {
    assert.equal(equalContentBytes(left, right), expected);
    assert.equal(equalContentBytes(right, left), expected, 'comparison must be symmetric');
  }
  const parent = Buffer.from([1, 0xff, 0, 2]);
  assert.equal(equalContentBytes(parent.subarray(1, 3), Buffer.from([0xff, 0])), true);
});

test('byte comparison uses strict equality for non-byte values without object coercion', () => {
  const shared = {toString() { throw new Error('must not convert objects to strings'); }};
  for (const [left, right, expected] of [
    [shared, shared, true],
    [shared, '[object Object]', false],
    [{value: 1}, {value: 1}, false],
    [null, null, true],
    [undefined, undefined, true],
    [null, undefined, false],
    [null, Buffer.alloc(0), false],
    [42, 42, true],
    [42, '42', false],
    [false, false, true],
    [NaN, NaN, false],
    [new Uint8Array([1]), Buffer.from([1]), false],
  ]) {
    assert.equal(equalContentBytes(left, right), expected);
    assert.equal(equalContentBytes(right, left), expected);
  }
});

test('local writes save text as LF and retain binary bytes and JSON string values', async t => {
  const scratch = await fs.mkdtemp(path.join(os.tmpdir(), 'bi-eol-local-'));
  t.after(async () => {
    assert.equal(path.dirname(path.resolve(scratch)), path.resolve(os.tmpdir()));
    assert.ok(path.basename(scratch).startsWith('bi-eol-local-'));
    await fs.rm(scratch, {recursive: true, force: true});
  });
  const local = new Local(scratch);
  await local.writeFile('/ds_res/file.txt', Buffer.from('first\r\nsecond\r'));
  assert.equal(await fs.readFile(path.join(scratch, 'ds_res/file.txt'), 'utf8'), 'first\nsecond\n');
  const bytes = Buffer.from([0, 13, 10, 0xff]);
  await local.writeFile('/ds_res/file.png', bytes);
  assert.deepEqual(await local.readFile('/ds_res/file.png'), bytes);
  const data = {code: 'first\r\nsecond'};
  await local.writeFile('/ds_res/topic.1/index.json', data);
  assert.deepEqual(await local.readFile('/ds_res/topic.1/index.json'), data);
  await local.writeFile('/ds_res/file.json', Buffer.from('{\r\n  \"code\": \"first\\r\\nsecond\"\r\n}'));
  assert.deepEqual(JSON.parse((await local.readFile('/ds_res/file.json')).toString()), data);
});
