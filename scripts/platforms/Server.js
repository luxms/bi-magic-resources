const axios = require('axios').default;
const {filterSchemaNames} = require('../lib/utils');
const Platform = require('./base/Platform');
const auth = require('../lib/auth');

class Server extends Platform {
  constructor() {
    super();
    this.type = 'server';
  }

  async getSchemaNames() {
    const url = `${auth.BASE_URL}/api/db/adm.datasets`;
    try {
      const response = await axios.get(url, auth.REQUEST_OPTIONS);
      return filterSchemaNames(response.data.map(item => item.schema_name));
    } catch (err) {
      console.warn(`Failed to get schema names: ${err.message}`);
      throw err;
    }
  }

  async getFiles(schemaName, dirName) {
    const url = `${auth.BASE_URL}/api/db/${schemaName}.${dirName}`;
    try {
      const response = await axios.get(url, auth.REQUEST_OPTIONS);
      return response.data;
    } catch (error) {
      if (err.response?.status === 404) return [];
      throw new Error(`Failed to fetch files for schema ${schemaName}: ${error.message}`);
    }
  }

  async readFile(path, options) {
    try {
      const fullPath = `${auth.BASE_URL}/${path}`;
      const response = await axios.get(fullPath, {
        responseType: path.endsWith('.json') ? 'json' : 'arraybuffer',
        ...auth.REQUEST_OPTIONS,
        ...options,
        headers: {
          ...auth.REQUEST_OPTIONS.headers,
          ...(options && options.headers || {}),
        },
      });
      return response.data;
    } catch (err) {
      if (err.response?.status === 404) {
        return null;
      }
      throw err;
    }
  }

  async writeFile(path, content, options) {
    try {
      const fullPath = this._getFullPath(path);
      const response = await axios({
        ...auth.REQUEST_OPTIONS,
        headers: {
          'Content-Type': 'application/json',
          ...auth.REQUEST_OPTIONS,
          ...(options && options.headers || {}),
        },
        method: 'post',
        url: fullPath,
        data: content,
      });
      return response;
    } catch (err) {
      throw err;
    }
  }

  async updateFile(path, content, options) {
    try {
      const fullPath = this._getFullPath(path);
      const response = await axios({
        ...auth.REQUEST_OPTIONS,
        headers: {
          ...auth.REQUEST_OPTIONS.headers,
          ...(options && options.headers || {}),
        },
        method: 'put',
        url: fullPath,
        data: content,
      });
      return response;
    } catch (err) {
      throw err;
    }
  }

  async deleteFile(path) {
    const fullPath = this._getFullPath(path);
    await axios({
      ...auth.REQUEST_OPTIONS,
      method: 'delete',
      url: fullPath,
    });
  }

  _getFullPath(path) {
    return`${auth.BASE_URL}/${path}`;
  }
}

module.exports = Server;
