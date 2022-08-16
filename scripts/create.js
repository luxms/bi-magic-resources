const local = require('./lib/local');
const server = require('./lib/server');
const { pullPushInit, createEntity } = require('./lib/commands');
let args = process.argv.slice(2);
// args = ['topic', 'ds_demo12',]

args = args.map((arg) => arg.includes('--') ? arg.split('=')[1] : arg);
pullPushInit(() => createEntity(local, server, ...args));
