const local = require('./lib/local');
const server = require('./lib/server');
const { synchronize, pullPushInit } = require('./lib/commands');

local.setBaseDir('src');
pullPushInit(() => synchronize(server, local));
