const local = require('./lib/local');
const server = require('./lib/server');
const { synchronize, synchronizeII, pullPushInit } = require('./lib/commands');

local.setBaseDir('dist');
pullPushInit(() => synchronizeII(local, server));
