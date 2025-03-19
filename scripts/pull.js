const Server = require('./platforms/Server');
const Local = require('./platforms/Local');
const synchronize = require('./lib/synchronize');
const auth = require('./lib/auth');

const server = new Server();
const local = new Local('src');

auth.init(() => synchronize(server, local));
