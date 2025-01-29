const Local = require('./platforms/Local');
const Server = require('./platforms/Server');
const Commands = require('./lib/Commands');

let args = process.argv.slice(2);
args = args.map(arg => arg.includes('--') ? arg.split('=')[1] : arg);
const [type, schemaName, topicId, dashboardId, content] = args;

const local = new Local();
const server = new Server();

const commands = new Commands(local, server);
commands.withAuth(() => commands.createEntity(type, schemaName, topicId, dashboardId, content));
