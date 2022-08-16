const local = require('./lib/local');
const server = require('./lib/server');
const { synchronize, pullPushInit, synchronizeII } = require('./lib/commands');

local.setBaseDir('src');
pullPushInit(() => synchronizeII(server, local));
