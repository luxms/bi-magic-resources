const Spinner = require('cli-spinner').Spinner;
const chalk = require('chalk');
const local = require('./lib/local');
const server = require('./lib/server');
const { synchronize } = require('./lib/utils');
const config = require('./lib/config');


// const SERVER = 'http://lomaster.ci-test.spb.luxms.com/';
const {SERVER, USERNAME, PASSWORD} = config.getSUPConfigAndLog();
server.setServer(SERVER);

async function pull() {
  // authentication
  const authSpinner = new Spinner('Authentication... %s');
  authSpinner.start();
  try {
    await server.login(USERNAME, PASSWORD);
  } catch (err) {
    console.log(chalk.red('\nERROR:'));
    console.error(chalk.red(err.message));
    return;
  } finally {
    authSpinner.stop();
  }
  console.log(' SUCCESS');

  try {
    await synchronize(server, local);

  } finally {
    await server.logout();
  }
}

pull();
