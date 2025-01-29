const axios = require('axios').default;
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');
const mime = require('mime-types');
const { splitResource, filterSchemaNames } = require('./utils');
const Platform = require('./base/Platform');

/**
 * - RefinedAbstraction (bridge pattern)
 */
class Server extends Platform {
  constructor() {
    super();
    axiosCookieJarSupport(axios);
    this.cookieJar = new tough.CookieJar();
    this.SERVER = '';
  }

  setServer(server) {
    this.SERVER = server.endsWith('/') ? server.slice(0, -1) : server;
  }

  async getSchemaNames() {
    const url = `${this.SERVER}/api/db/adm.datasets`;
    try {
      const response = await axios.get(url, {
        jar: this.cookieJar,
        withCredentials: true,
      });
      return filterSchemaNames(response.data.map(item => item.schema_name));
    } catch (err) {
      console.warn(`Failed request ${url}`, err.message);
      throw err;
    }
  }

  async login(username, password) {
    const url = `${this.SERVER}/api/auth/login`;
    const result = await axios({
      method: 'post',
      url,
      data: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
      headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
      jar: this.cookieJar,
      withCredentials: true,
    });
    return result.data;
  }

  async logout() {
    const url = `${this.SERVER}/api/auth/logout`;
    await axios.get(url, {
      jar: this.cookieJar,
      withCredentials: true,
    });
  }

  // Server-specific HTTP methods that managers will use
  async get(endpoint, options = {}) {
    const url = `${this.SERVER}${endpoint}`;
    return axios.get(url, {
      jar: this.cookieJar,
      withCredentials: true,
      ...options,
    });
  }

  async post(endpoint, data, options = {}) {
    const url = `${this.SERVER}${endpoint}`;
    return axios.post(url, data, {
      jar: this.cookieJar,
      withCredentials: true,
      ...options,
    });
  }

  async put(endpoint, data, options = {}) {
    const url = `${this.SERVER}${endpoint}`;
    return axios.put(url, data, {
      jar: this.cookieJar,
      withCredentials: true,
      ...options,
    });
  }

  async delete(endpoint, options = {}) {
    const url = `${this.SERVER}${endpoint}`;
    return axios.delete(url, {
      jar: this.cookieJar,
      withCredentials: true,
      ...options,
    });
  }
}

module.exports = Server;
