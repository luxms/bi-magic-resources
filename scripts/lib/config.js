const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env'), quiet: true });
const readlineSync = require('readline-sync');
const currentGitBranch = require('current-git-branch');
const chalk = require('chalk');

const KNOWN_OPTIONS = [
  'server', 'username', 'password', 'port', 'force', 'noRemove',
  'include', 'exclude', 'resources', 'dashboards', 'cubes',
  'kerberos', 'jwt', 'noLogin',
];
const toKebab = (name) => name.replace(/[A-Z]/g, letter => '-' + letter.toLowerCase());
const KNOWN_CLI_NAMES = new Set(KNOWN_OPTIONS.map(toKebab));

// Reject typos like --usarname before they silently get ignored. Only validate when
// the entry script is one of ours — webpack-cli has its own --env/--mode/etc.
function validateCliArgs() {
  const entry = process.argv[1] || '';
  if (!/[\\/]scripts[\\/](start|push|pull|create)\.js$/.test(entry)) return;

  for (const arg of process.argv.slice(2)) {
    if (!arg.startsWith('--')) continue;
    const m = arg.match(/^--([A-Za-z][A-Za-z_-]*?)(?:=.*)?$/);
    if (!m) continue;
    const name = m[1];
    if (KNOWN_CLI_NAMES.has(name)) continue;
    const valid = Array.from(KNOWN_CLI_NAMES).sort().map(n => '--' + n).join(', ');
    console.error(chalk.redBright(`Unknown CLI argument: --${name}`));
    console.error('Valid options: ' + valid);
    process.exit(1);
  }
}
validateCliArgs();

class Config {
  static DEFAULT_VALUES = {
    port: '3003',
    force: false,
    noRemove: false,
    include: '^ds_\\w+$',
    exclude: '',
    resources: true,
    dashboards: false,
    cubes: false,
    kerberos: '',
    jwt: '',
    noLogin: false,
  };

  constructor() {
    this.OPTIONS_CACHE = {};
    this.CONFIG_CACHE = null;
    this.AUTH_CONFIG_CACHE = null;
  }

  getAuthConfig() {
    const KERBEROS = this.getOption('kerberos');
    const JWT = !KERBEROS ? this.getOption('jwt') : '';
    const USERNAME = !KERBEROS && !JWT ? this.getOption('username') : '';
    const PASSWORD = !KERBEROS && !JWT ? this.getOption('password') : '';
    return {JWT, KERBEROS, USERNAME, PASSWORD};
  }

  logAuthParams() {
    const {KERBEROS, JWT, USERNAME, PASSWORD} = this.getAuthConfig();
    console.log('\nSERVER:', chalk.yellowBright(this.getServer()));
    if (KERBEROS) {
      console.log('KERBEROS:', chalk.yellowBright(KERBEROS));
    } else if (JWT) {
      console.log('JWT:', chalk.yellowBright(`${JWT.slice(0, 16)}...`));
    } else {
      console.log('USERNAME:', chalk.yellowBright(USERNAME));
      console.log('PASSWORD:', chalk.yellowBright(PASSWORD.split('').map(_ => '*').join('')), '\n');
    }
    const checkMark = (v) => v ? '☑' : '☐';
    console.log(`${checkMark(this.hasResources())} resources    ${checkMark(this.hasDashboards())} dashboards    ${checkMark(this.hasCubes())} cubes\n`);
  }

  getServer() {
    return this.getOption('server', 'Enter server URL: ');
  }

  getPort() {
    return +this.getOption('port');
  }

  getForce() {
    return !!this.getOption('force');
  }

  getInclude() {
    return this.getOption('include');
  }

  getExclude() {
    return this.getOption('exclude');
  }

  getJWT() {
    return this.getOption('jwt');
  }

  hasNoLogin() {
    return this.hasOption('noLogin');
  }

  hasNoRemove() {
    return this.hasOption('noRemove');
  }

  hasResources() {
    return this.hasOption('resources');
  }

  hasDashboards() {
    return this.hasOption('dashboards');
  }

  hasCubes() {
    return this.hasOption('cubes');
  }

  hasOption(name) {
    return !!this.getOption(name);
  }

  /**
   * Get option from config
   * @param {string} name - Option name
   * @param {string} prompt - Text to display in console (optional)
   * @returns {string}
   */
  getOption(name, prompt) {
    // 1. Cached value
    if (name in this.OPTIONS_CACHE) {
      return this.OPTIONS_CACHE[name];
    }

    let value;

    // 2. CLI args
    // ex:
    //   npm run pull -- --option=value
    value = this._getFromCli(name);
    if (value !== undefined) {
      return (this.OPTIONS_CACHE[name] = value);
    }

    // 3. ENV variables
    // (must be uppercase)
    // ex:
    //   BI_SERVER=http://127.0.0.1 npm run pull
    value = this._getFromEnv(name);
    if (value !== undefined) {
      return (this.OPTIONS_CACHE[name] = value);
    }

    // 4. Config files
    // two config files:
    //   config.json - for server and other options
    //   authConfig.json  - only for username, password and jwt
    const useAuthConfig = ['username', 'password', 'jwt'].includes(name);
    const config = useAuthConfig ? this._loadAuthConfig() : this._loadConfig();
    if (config[name] !== undefined) {
      return (this.OPTIONS_CACHE[name] = config[name]);
    }

    // 5. Default values
    if (Config.DEFAULT_VALUES[name] !== undefined) {
      return (this.OPTIONS_CACHE[name] = Config.DEFAULT_VALUES[name]);
    }

    // 6. Ask user
    value = readlineSync.question(prompt || `Enter ${name}: `, {hideEchoBack: name === 'password'});
    return (this.OPTIONS_CACHE[name] = value);
  }

  _getFromCli(name) {
    const cliName = name.replace(/[A-Z]/g, letter => '-' + letter.toLowerCase());
    const args = process.argv.slice(2);
    for (const arg of args) {
      if (arg.match(/^--([A-Za-z_-]+?)(?:=(.+)?)?$/) && RegExp.$1 === cliName) {
        return RegExp.$2 || true;
      }
    }
  }

  _getFromEnv(name) {
    const envName = 'BI_' + name.replace(/[A-Z]/g, letter => '_' + letter).toUpperCase();
    return process.env[envName];
  }

  _loadConfig() {
    if (!this.CONFIG_CACHE) {
      try {
        const textContent = fs.readFileSync(path.resolve(__dirname, '..', '..', 'config.json'), 'utf8');
        this.CONFIG_CACHE = JSON.parse(textContent);
      } catch (err) {
        console.warn('Error reading config.json:', err.message);
        this.CONFIG_CACHE = {};
      }
    }
    return this.CONFIG_CACHE;
  }

  _loadAuthConfig() {
    if (!this.AUTH_CONFIG_CACHE) {
      try {
        const textContent = fs.readFileSync(path.resolve(__dirname, '..', '..', 'authConfig.json'), 'utf8');
        let config = JSON.parse(textContent);
        try {
          const branchName = currentGitBranch();
          if (branchName in config) config = config[branchName];
        } catch (err) {
          // Skip git branch feature
        }
        this.AUTH_CONFIG_CACHE = config;
      } catch (err) {
        console.warn('Error reading authConfig.json:', err.message);
        this.AUTH_CONFIG_CACHE = {};
      }
    }
    return this.AUTH_CONFIG_CACHE;
  }
}

module.exports = new Config();
