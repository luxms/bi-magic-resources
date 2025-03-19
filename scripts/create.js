const Server = require('./platforms/Server');
const Local = require('./platforms/Local');
const createEntity = require('./lib/createEntity');
const auth = require('./lib/auth');

const server = new Server();
const local = new Local();

let args = process.argv.slice(2);
args = args.map(arg => arg.includes('--') ? arg.split('=')[1] : arg);

auth.init(() => createEntity(local, server, ...args));
