const axios = require('axios').default;
const mime = require('mime-types');
const {splitResource, filterSchemaNames} = require('../lib/utils');
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
      const fullPath = this._getFullPath(path);
      const response = await axios.get(fullPath, {
        ...auth.REQUEST_OPTIONS,
        responseType: path.endsWith('.json') ? 'json' : 'arraybuffer',
        ...options,
      });
      return response.data;
    } catch (err) {
      if (err.response?.status === 404) {
        return null;
      }
      throw err;
    }
  }

  async writeFile(path, content) {
    try {
      const fullPath = this._getFullPath(path);
      // todo Порешать дело с заголовками и датой
      const response = await axios({
        ...auth.REQUEST_OPTIONS,
        headers: {
          ...auth.REQUEST_OPTIONS,
          'Content-Type': 'application/json',
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

  async updateFile(path, content) {
    try {
      const fullPath = this._getFullPath(path);
      // todo Порешать дело с заголовками и датой
      const response = await axios({
        ...auth.REQUEST_OPTIONS,
        headers: {
          ...auth.REQUEST_OPTIONS.headers,
          'Content-Type': contentType.replace('application/json', 'text/plain')
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
    const encodedPath = path.split('/').map(part => encodeURIComponent(part)).join('/');
    return `${auth.BASE_URL}/${encodedPath}`;
  }
}

module.exports = Server;
