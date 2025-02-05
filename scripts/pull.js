const Local = require('./platforms/Local');
const Server = require('./platforms/Server');
const withAuth = require('./lib/auth');
const synchronize = require('./lib/synchronize');

const local = new Local('src');
const server = new Server();

withAuth(server, () => synchronize(server, local));
