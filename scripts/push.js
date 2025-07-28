const Server = require('./platforms/Server');
const Local = require('./platforms/Local');
const yargs = require('yargs');
const synchronize = require('./lib/synchronize');
const auth = require('./lib/auth');
const env = yargs.argv.env ? yargs.argv.env : 'none';

const server = new Server();
const local = new Local(`dist_${env}`);

auth.init(() => synchronize(local, server));
