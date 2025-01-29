const Local = require('./platforms/Local');
const Server = require('./platforms/Server');
const Commands = require('./lib/Commands');

const local = new Local('dist');
const server = new Server();

const commands = new Commands(local, server);
commands.withAuth(() => commands.synchronize());
