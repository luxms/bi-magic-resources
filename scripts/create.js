const Local = require('./platforms/Local');
const Server = require('./platforms/Server');
const withAuth = require('./lib/auth');

const local = new Local();
const server = new Server();

let args = process.argv.slice(2);
args = args.map(arg => arg.includes('--') ? arg.split('=')[1] : arg);

// withAuth(server, createEntity(local, server, ...args));
