const fs = require('fs');
const path = require('path');
const readlineSync = require('readline-sync');
const chalk = require('chalk');
const currentGitBranch = require('current-git-branch');

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
    noLogin: false,
  };

  constructor() {
    this.cache = {};
    this.configCache = null;
    this.authConfigCache = null;
  }

  loadConfigFile() {
    if (!this.configCache) {
      try {
        const textContent = fs.readFileSync(path.resolve(__dirname, '..', '..', 'config.json'), 'utf8');
        this.configCache = JSON.parse(textContent);
      } catch (err) {
        console.warn('Error reading config.json:', err.message);
        this.configCache = {};
      }
    }
    return this.configCache;
  }

  loadAuthConfig() {
    if (!this.authConfigCache) {
      try {
        const textContent = fs.readFileSync(path.resolve(__dirname, '..', '..', 'authConfig.json'), 'utf8');
        let config = JSON.parse(textContent);

        try {
          const branchName = currentGitBranch();
          if (branchName in config) {
            config = config[branchName];
          }
        } catch (err) {
          // Skip git branch feature
        }

        this.authConfigCache = config;
      } catch (err) {
        console.warn('Error reading authConfig.json:', err.message);
        this.authConfigCache = {};
      }
    }
    return this.authConfigCache;
  }

  getFromCli(name) {
    const cliName = name.replace(/[A-Z]/g, letter => '-' + letter.toLowerCase());
    const args = process.argv.slice(2);
    for (const arg of args) {
      if (arg.match(/^--([A-Za-z_-]+?)(?:=(.+)?)?$/) && RegExp.$1 === cliName) {
        return RegExp.$2 || true;
      }
    }
  }

  getFromEnv(name) {
    const envName = 'BI_' + name.replace(/[A-Z]/g, letter => '_' + letter).toUpperCase();
    return process.env[envName];
  }

  getOption(name, prompt) {
    // Return cached value if exists
    if (name in this.cache) {
      return this.cache[name];
    }

    let value;

    // Try CLI args
    value = this.getFromCli(name);
    if (value !== undefined) {
      return (this.cache[name] = value);
    }

    // Try ENV variables
    value = this.getFromEnv(name);
    if (value !== undefined) {
      return (this.cache[name] = value);
    }

    // Try config files
    const config = (name === 'username' || name === 'password') ?
      this.loadAuthConfig() :
      this.loadConfigFile();

    if (config[name] !== undefined) {
      return (this.cache[name] = config[name]);
    }

    // Try default values
    if (Config.DEFAULT_VALUES[name] !== undefined) {
      return (this.cache[name] = Config.DEFAULT_VALUES[name]);
    }

    // Finally, ask user
    value = readlineSync.question(prompt || `Enter ${name}: `, {
      hideEchoBack: name === 'password'
    });
    return (this.cache[name] = value);
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

  getNoRemove() {
    return !!this.getOption('noRemove');
  }

  getInclude() {
    return this.getOption('include');
  }

  getExclude() {
    return this.getOption('exclude');
  }

  hasResources() {
    return !!this.getOption('resources');
  }

  hasDashboards() {
    return !!this.getOption('dashboards');
  }

  hasCubes() {
    return !!this.getOption('cubes');
  }

  getNoLogin() {
    return !!this.getOption('noLogin');
  }

  getSUPConfig() {
    const SERVER = this.getServer();
    const KERBEROS = this.getOption('kerberos');
    const USERNAME = !KERBEROS ? this.getOption('username') : '';
    const PASSWORD = !KERBEROS ? this.getOption('password') : '';
    return { SERVER, USERNAME, PASSWORD, KERBEROS };
  }

  getSUPConfigAndLog() {
    const checkMark = (v) => v ? '☑' : '☐';
    const { SERVER, USERNAME, PASSWORD, KERBEROS } = this.getSUPConfig();

    console.log();
    console.log('SERVER  :', chalk.yellowBright(SERVER));
    if (!!KERBEROS) {
      console.log('KERBEROS:', chalk.yellowBright(KERBEROS));
    } else {
      console.log('USERNAME:', chalk.yellowBright(USERNAME));
      console.log('PASSWORD:', chalk.yellowBright(PASSWORD.split('').map(_ => '*').join('')));
    }
    console.log(`          ${checkMark(this.hasResources())} resources    ${checkMark(this.hasDashboards())} dashboards    ${checkMark(this.hasCubes())} cubes`);
    console.log('\n');

    return { SERVER, USERNAME, PASSWORD };
  }
}

// Create and export a singleton instance
module.exports = new Config();
