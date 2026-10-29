const fs = require('fs').promises;
const Server = require('../platforms/Server');
const Local = require('../platforms/Local');
const synchronize = require('./synchronize');

async function transferDist(direction) {
  if (direction !== 'pull' && direction !== 'push') {
    throw new Error(`Unknown dist transfer direction: ${direction}`);
  }
  const local = new Local('dist');
  const server = new Server();
  const [source, target] = direction === 'pull'
    ? [server, local]
    : [local, server];
  if (target === local) {
    const {assertNoSymlinks} = require('./restore');
    await assertNoSymlinks(local.BASE_DIR);
    await fs.mkdir(local.BASE_DIR, {recursive: true});
  }
  return synchronize(source, target);
}

module.exports = transferDist;
