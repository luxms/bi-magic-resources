const Server = require('./platforms/Server');
const Local = require('./platforms/Local');
const synchronize = require('./lib/synchronize');
const auth = require('./lib/auth');
const yargs = require('yargs');
const env = yargs.argv.env || 'production';

const server = new Server();
const local = new Local(env  === 'production' ? 'dist' : `dist_${env}`);

auth.init(() => synchronize(local, server));
