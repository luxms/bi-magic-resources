const Local = require('./platforms/Local');
const Server = require('./platforms/Server');
const Commands = require('./lib/Commands');

const local = new Local('src');
const server = new Server();

const commands = new Commands(server, local);
commands.withAuth(() => commands.synchronize());
