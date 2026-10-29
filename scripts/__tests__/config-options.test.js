const test = require('node:test');
const assert = require('node:assert/strict');
const config = require('../lib/config');

test('boolean CLI and environment options honor false and zero', t => {
  const originalArgv = process.argv;
  const originalCache = config.OPTIONS_CACHE;
  const envNames = ['BI_FORCE', 'BI_RESOURCES', 'BI_NO_REMOVE'];
  const originalEnv = Object.fromEntries(envNames.map(name => [name, process.env[name]]));
  t.after(() => {
    process.argv = originalArgv;
    config.OPTIONS_CACHE = originalCache;
    for (const name of envNames) {
      if (originalEnv[name] === undefined) delete process.env[name];
      else process.env[name] = originalEnv[name];
    }
  });

  process.argv = ['node', 'scripts/_pull.js', '--force=false', '--resources=0', '--no-remove=FALSE'];
  config.OPTIONS_CACHE = {};
  assert.equal(config.getForce(), false);
  assert.equal(config.hasResources(), false);
  assert.equal(config.hasNoRemove(), false);

  process.argv = ['node', 'scripts/_pull.js', '--force'];
  config.OPTIONS_CACHE = {};
  assert.equal(config.getForce(), true);

  process.argv = ['node', 'scripts/_pull.js', '--force=0'];
  config.OPTIONS_CACHE = {};
  assert.equal(config.getForce(), false);

  process.argv = ['node', 'scripts/_pull.js'];
  process.env.BI_FORCE = 'false';
  process.env.BI_RESOURCES = '0';
  process.env.BI_NO_REMOVE = 'FALSE';
  config.OPTIONS_CACHE = {};
  assert.equal(config.getForce(), false);
  assert.equal(config.hasResources(), false);
  assert.equal(config.hasNoRemove(), false);
});
