const fs = require('fs');
const path = require('path');
const readlineSync = require('readline-sync');
const chalk = require('chalk');


const varNameToEnv = (varName) => 'BI_' + varName.replace(/[A-Z]/g, letter => '_' + letter).toUpperCase();
const varNameToCli = (varName) => varName.replace(/[A-Z]/g, letter => '-' + letter.toLowerCase());


function getCliArg(argName) {
  let args = process.argv.slice(2);
  for (let arg of args) {
    if (arg.match(/^--([A-Za-z_-]+?)(?:=(.+)?)?$/) && RegExp.$1 === varNameToCli(argName)) {
      return RegExp.$2 || true;
    }
  }
}

/**
 * saved values for config
 * used to prevent several input from console while option is already entered
 * @type {Object.<string, string>}
 */
const savedValues = {};

/**
 *
 * @type {Object.<string, number>}
 */
const defaultValues = {
  port: '3003',
  force: false,
  noRemove: false,
  include: '^ds_\\w+$',
  exclude: '',
  dashboards: false,
  kerberos: '',
  noLogin: false,
};


function getOption(name, prompt) {
  // 1. may be cached
  const savedValue = savedValues[name];
  if (savedValue) return savedValue;

  // 2. read from cli args:
  // ex:
  //   npm run pull -- --option=value
  const cliValue = getCliArg(name);
  if (cliValue) return (savedValues[name] = cliValue);

  // 3. read value from ENV
  // (must be uppercase)
  // ex:
  //   BI_SERVER=http://127.0.0.1 npm run pull
  const envValue = process.env[varNameToEnv(name)];
  if (envValue) return (savedValues[name] = envValue);

  // 4. read from config
  // two config files:
  //   config.json - for server and other options
  //   authConfig  - only for username and password
  const jsonConfigFileName = (name === 'username' || name === 'password') ? 'authConfig.json': 'config.json';
  try {
    const authConfig = fs.readFileSync(path.resolve(__dirname, '..', '..', jsonConfigFileName), 'utf8');
    try {
      const jsonConfig = JSON.parse(authConfig);
      const currentBranchName = require('current-git-branch')();
      const jsonConfigValue = (currentBranchName in jsonConfig) ? jsonConfig[currentBranchName][name] : jsonConfig[name];
      if (jsonConfigValue) return (savedValues[name] = jsonConfigValue);
    } catch (err) {
      console.warn('Error reading authConfig.json:', err.message);
    }
  } catch (err) {
    // file might not exists or invalid...
    // skip
  }

  // 5. default value for option
  const defaultValue = defaultValues[name];
  if (defaultValue !== undefined) return (savedValues[name] = defaultValue);

  // 6. read from keyboard
  const kbdValue = readlineSync.question(prompt || `Enter ${name}: `, {
    hideEchoBack: name === 'password'
  });
  return (savedValues[name] = kbdValue);
}


/**
 * get remote server url
 * @return {string}
 */
function getServer() {
  return getOption('server', 'Enter server URL: ');
}


/**
 * get port for local to open with 'npm start' from config
 * @returns {number}
 */
function getPort() {
  return +getOption('port');
}


/**
 * get regexp for schemas to include
 * @return {string}
 */
function getInclude() {
  return getOption('include');
}


/**
 * get regexp for schemas to exclude
 * @return {string}
 */
function getExclude() {
  return getOption('exclude');
}


/**
 * get force: whether to ask "Continue? YN"
 * @returns boolean
 */
function getForce() {
  return !!getOption('force');
}


/**
 * get no remove: whether to disable remove while push/pull
 * @returns boolean
 */
function getNoRemove() {
  return !!getOption('noRemove');
}


/**
 * get dashboards: it's possibility to save configs
 * of Dashboards and Dashlets to a local disk.
 * Also, upload it to a server after.
 * @returns boolean
 */
function mustSaveDashboardConfigToDisk() {
  return !!getOption('dashboards');
}


/**
 * get no login: whether perform login on server. Valid only for dev mode
 * @returns boolean
 */
function getNoLogin() {
  return !!getOption('noLogin');
}


/**
 * get server, username and password values from config
 * if none exists, will ask to enter from keyboard
 * and will log values to console
 * @returns {{SERVER: string, PASSWORD: string, USERNAME: string}}
 */
function getSUPConfig() {
  const SERVER = getServer();
  const KERBEROS = getOption('kerberos');
  const USERNAME = !KERBEROS ? getOption('username') : '';
  const PASSWORD = !KERBEROS ? getOption('password') : '';
  return {SERVER, USERNAME, PASSWORD, KERBEROS};
}

function getSUPConfigAndLog() {
  const {SERVER, USERNAME, PASSWORD, KERBEROS} = getSUPConfig();
  console.log();
  console.log('SERVER  :', chalk.yellowBright(SERVER));
  if (!!KERBEROS) {
    console.log('KERBEROS:', chalk.yellowBright(KERBEROS));
  } else {
    console.log('USERNAME:', chalk.yellowBright(USERNAME));
    console.log('PASSWORD:', chalk.yellowBright(PASSWORD.split('').map(_ => '*').join('')), '\n');
  }
  return {SERVER, USERNAME, PASSWORD};
}


module.exports = {
  getServer,
  getPort,
  getForce,
  getNoRemove,
  getInclude,
  getExclude,
  getSUPConfig,
  getSUPConfigAndLog,
  mustSaveDashboardConfigToDisk,
  getNoLogin,
}
