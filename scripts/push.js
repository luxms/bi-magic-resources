const Local = require('./platforms/Local');
const Server = require('./platforms/Server');
const withAuth = require('./lib/auth');
const synchronize = require('./lib/synchronize');

const local = new Local('dist');
const server = new Server();

withAuth(server, () => synchronize(local, server));
