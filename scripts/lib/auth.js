const axios = require('axios').default;
const tough = require('tough-cookie');
const chalk = require('chalk');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const Spinner = require('cli-spinner').Spinner;
const config = require('./config');
const {retryOnFail} = require('./utils');

class Auth {
  constructor() {
    axiosCookieJarSupport(axios);
    this.BASE_URL = null;
    this.LOGIN_PROMISE = null;
    this.COOKIE_JAR = new tough.CookieJar();
    this.JWT = null;
    this.USER_ID = null;
    this.REQUEST_OPTIONS = {
      jar: this.COOKIE_JAR,
      withCredentials: true,
    };
  }

  /**
   * Initializes the authentication process and executes the callback function
   * @param {Function} callback - Function to execute after successful authentication
   * @returns {Promise<void>}
   */
  async init(callback) {
    config.logAuthParams();
    this._setBaseUrl(config.getServer());
    try {
      await this.login();
      await callback();
    } catch (err) {
      this._handleError(err);
    } finally {
      await this.logout();
    }
  }

  _setBaseUrl(baseUrl) {
    this.BASE_URL = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }

  async login() {
    if (!this.LOGIN_PROMISE) {
      this.LOGIN_PROMISE = this._performLogin();
    }
    return this.LOGIN_PROMISE;
  }

  async logout() {
    try {
      const url = `${this.BASE_URL}/api/auth/logout`;
      await axios.get(url, {
        jar: this.cookieJar,
        withCredentials: true,
      });
    } catch (err) {
      // Ignore logout errors
    }
  }

  _handleError(err) {
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
  }

  async _performLogin() {
    const authSpinner = new Spinner('Authentication... %s');
    authSpinner.start();
    try {
      const result = await this._getAuthenticationMethod();
      this.USER_ID = result.id;
      authSpinner.stop();
      console.log('SUCCESS');
      return result;
    } catch (err) {
      authSpinner.stop();
      throw err;
    }
  }

  async _getAuthenticationMethod() {
    const {KERBEROS, JWT, USERNAME, PASSWORD} = config.getAuthConfig();
    if (KERBEROS) return await retryOnFail(() => this._loginWithSSO(KERBEROS));
    if (JWT) return await retryOnFail(() => this._loginWithJWT(JWT));
    return await retryOnFail(() => this._loginWithPassword(USERNAME, PASSWORD));
  }

  async _loginWithSSO(kerberosUrl) {
    try {
      const url = `${this.BASE_URL}/api/auth/check`;
      const {sso} = require('node-expose-sspi');
      const client = new sso.Client();
      const response = await client.fetch(url);
      const Cookie = tough.Cookie;
      const cookie = Cookie.parse(response.headers.get('set-cookie'));
      this.COOKIE_JAR.setCookie(cookie, url);
      return await response.json();
    } catch (err) {
      return this._loginWithKerberos(kerberosUrl);
    }
  }

  async _loginWithKerberos(kerberosUrl) {
    const kerberos = require('kerberos').Kerberos;
    try {
      const client = await kerberos.initializeClient(kerberosUrl, {
        mechOID: kerberos.GSS_MECH_OID_SPNEGO,
      });
      const ticket = await client.step("");
      const resp = await axios({
        method: 'get',
        url: `${this.BASE_URL}/api/auth/check`,
        headers: {'Authorization': 'Negotiate ' + ticket},
        jar: this.COOKIE_JAR,
        withCredentials: true,
      });
      return await resp.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async _loginWithJWT(token) {
    this.JWT = token;
    this.REQUEST_OPTIONS = {headers: {'Authorization': `Bearer ${token}`}};
    try {
      const url = `${this.BASE_URL}/api/auth/check`;
      const result = await axios.get(url, {
        headers: {'Authorization': `Bearer ${token}`},
      });
      return result.data;
    } catch(err) {
      if (err.response) throw new Error(err.response.data.message);
      else throw new Error(err.message);
    }
  }

  async _loginWithPassword(username, password) {
    const result = await axios({
      method: 'post',
      url: `${this.BASE_URL}/api/auth/login`,
      data: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
      headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
      jar: this.COOKIE_JAR,
      withCredentials: true,
    });
    return result.data;
  }

  getCookies() {
    return this.COOKIE_JAR.getCookiesSync(this.BASE_URL).join('; ');
  }
}

module.exports = new Auth();
