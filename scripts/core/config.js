const fs = require('fs');
const path = require('path');
const readlineSync = require('readline-sync');
const chalk = require('chalk');
const currentGitBranch = require('current-git-branch');

class Config {
  DEFAULT_VALUES = {
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
    this.OPTIONS_CACHE = {};
    this.CONFIG_CACHE = null;
    this.AUTH_CONFIG_CACHE = null;
  }

  getAuthConfig() {
    const JWT = this.getOption('jwt');
    const KERBEROS = this.getOption('kerberos');
    const USERNAME = this.getOption('username');
    const PASSWORD = this.getOption('password');
    return { JWT, KERBEROS, USERNAME, PASSWORD };
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

  hasNoLogin() {
    return !!this.getOption('noLogin');
  }

  hasNoRemove() {
    return !!this.getOption('noRemove');
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
    value = this._getFromCli(name);
    if (value !== undefined) {
      return (this.OPTIONS_CACHE[name] = value);
    }

    // 3. ENV variables
    value = this._getFromEnv(name);
    if (value !== undefined) {
      return (this.OPTIONS_CACHE[name] = value);
    }

    // 4. Config files
    const useAuthConfig = ['username', 'password', 'jwt'].includes(name);
    const config = useAuthConfig ? this._loadAuthConfig() : this._loadConfig();
    if (config[name] !== undefined) {
      return (this.OPTIONS_CACHE[name] = config[name]);
    }

    // 5. Default values
    if (Config.DEFAULT_VALUES[name] !== undefined) {
      return (this.OPTIONS_CACHE[name] = this.DEFAULT_VALUES[name]);
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
    if (this.CONFIG_CACHE) return this.CONFIG_CACHE;
    try {
      const textContent = fs.readFileSync(path.resolve(__dirname, '..', '..', 'config.json'), 'utf8');
      this.CONFIG_CACHE = JSON.parse(textContent);
    } catch (err) {
      console.warn('Error reading config.json:', err.message);
      this.CONFIG_CACHE = {};
    }
  }

  _loadAuthConfig() {
    if (this.AUTH_CONFIG_CACHE) return this.AUTH_CONFIG_CACHE;
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
}

module.exports = new Config();
