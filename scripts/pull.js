const fs = require('fs').promises;
const path = require('path');
const Server = require('./platforms/Server');
const Local = require('./platforms/Local');
const synchronize = require('./lib/synchronize');
const auth = require('./lib/auth');
const config = require('./lib/config');
const { restore, assertNoSymlinks } = require('./lib/restore');

const server = new Server();
const local = new Local('dist');

auth.init(async () => {
  await assertNoSymlinks(local.BASE_DIR);
  await fs.mkdir(local.BASE_DIR, { recursive: true });
  const result = await synchronize(server, local);
  if (result.status === 'cancelled') return;
  await restore({
    rootDir: path.resolve(__dirname, '..'),
    server: config.getServer(),
    include: config.getInclude(),
    exclude: config.getExclude(),
    resources: config.hasResources(),
    dashboards: config.hasDashboards(),
    cubes: config.hasCubes(),
    noRemove: config.hasNoRemove(),
    paths: result.paths,
  });
});
