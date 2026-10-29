const path = require('path');
const auth = require('./lib/auth');
const config = require('./lib/config');
const transferDist = require('./lib/transfer-dist');
const {restore} = require('./lib/restore');

auth.init(async () => {
  const result = await transferDist('pull');
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
