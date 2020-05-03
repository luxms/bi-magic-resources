const fs = require('fs');
const path = require('path');
const readlineSync = require('readline-sync');
const chalk = require('chalk');


function getCliArg(argName) {
  let args = process.argv.slice(2);
  for (let arg of args) {
    if (arg.match(/^--(\w+?)=(.+)$/) && RegExp.$1 === argName) {
      return RegExp.$2;
    }
  }
}

const savedValues = {};


function getOption(name, prompt) {
  // may be cached
  const savedValue = savedValues[name];
  if (savedValue) return savedValue;

  // try read from cli args:
  // ex:
  //   npm run pull -- --option=value
  const cliValue = getCliArg(name);
  if (cliValue) return (savedValues[name] = cliValue);

  // read value from env variable
  // which is uppercase
  // ex:
  //   SERVER=http://127.0.0.1 npm run pull
  const envValue = process.env[name.toUpperCase()];
  if (envValue) return (savedValues[name] = envValue);

  // two config files:
  //   config.json - for server and other options
  //   authConfig  - for username and password
  let jsonConfigFileName = name === 'username' || name === 'password' ? 'authConfig.json': 'config.json';
  try {
    const jsonConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', '..', jsonConfigFileName), 'utf8'));
    const jsonConfigValue = jsonConfig[name];
    if (jsonConfigValue) return (savedValues[name] = jsonConfigValue);
  } catch (err) {
    // file might not exists or invalid...
    // skip
  }

  // read from keyboard
  const kbdValue = readlineSync.question(prompt || `Enter ${name}: `, {
    hideEchoBack: name === 'password'
  });
  return (savedValues[name] = kbdValue);
}

function getServer() {
  return getOption('server', 'Enter server URL: ');
}


/**
 * get server, username and password values from config
 * if none exists, will ask to enter from keyboard
 * and will log values to console
 * @returns {{SERVER: string, PASSWORD: string, USERNAME: string}}
 */
function getSUPConfigAndLog() {
  const SERVER = getServer();
  const USERNAME = getOption('username');
  const PASSWORD = getOption('password')
  console.log();
  console.log('SERVER  :', chalk.yellowBright(SERVER));
  console.log('USERNAME:', chalk.yellowBright(USERNAME));
  console.log('PASSWORD:', chalk.yellowBright(PASSWORD.split('').map(_ => '*').join('')), '\n');
  return {SERVER, USERNAME, PASSWORD};
}


module.exports = {
  getServer,
  getSUPConfigAndLog,
}
