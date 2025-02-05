const chalk = require('chalk');
const Spinner = require('cli-spinner').Spinner;
const { retryOnFail } = require('./utils');
const config = require('./config');

// TODO перенести сюда JWT
async function _loginWithSpinner(server) {
  const {SERVER, USERNAME, PASSWORD, KERBEROS} = config.getSUPConfig();
  server.setServer(SERVER);

  const authSpinner = new Spinner('Authentication... %s');
  authSpinner.start();
  try {
    const result = KERBEROS
      ? await retryOnFail(() => server.loginSSO(KERBEROS))
      : await retryOnFail(() => server.login(USERNAME, PASSWORD));
    authSpinner.stop();
    console.log('   SUCCESS\n');
    return result;
  } catch (err) {
    authSpinner.stop();
    throw err;
  }
}

let loginPromise = null;
const loginWithSpinner = (server) => loginPromise || (loginPromise = _loginWithSpinner(server));

async function withAuth(server, callback) {
  config.getSUPConfigAndLog();

  try {
    await loginWithSpinner(server);
  } catch (err) {
    return;
  }

  try {
    await callback();
  } catch (err) {
    if (err.isAxiosError) {
      console.log(chalk.redBright('Network error'));
      if (err.response) {
        console.log('    ', err.response.config.method, err.response.config.url);
        console.log('    ', err.response.status, err.response.statusText);
        console.error(err.response.data);
      } else {
        console.error(err.stack);
      }
    } else {
      console.error(err);
    }
  } finally {
    try {
      await server.logout();
    } catch (err2) {
      // ignore
    }
  }
}

module.exports = withAuth;
