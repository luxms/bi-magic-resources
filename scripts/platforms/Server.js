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
    } catch (error) {
      throw new Error(`Failed to get schema names by URL ${url}: ${error.message}`);
    }
  }

  async getFiles(schemaName, dirName) {
    const url = `${auth.BASE_URL}/api/db/${schemaName}.${dirName}`;
    try {
      const response = await axios.get(url, auth.REQUEST_OPTIONS);
      return response.data;
    } catch (error) {
      if (err.response?.status === 404) return [];
      throw new Error(`Failed to get files by URL ${url}: ${error.message}`);
    }
  }

  async readFile(path, options) {
    const fullPath = `${auth.BASE_URL}/${path}`;
    try {
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
    } catch (error) {
      if (error.response?.status === 404) return null;
      throw new Error(`Failed to read file by URL ${fullPath}: ${error.message}`);
    }
  }

  async writeFile(path, content, options) {
    const fullPath = this._getFullPath(path);
    try {
      return await axios({
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
    } catch (error) {
      throw new Error(`Failed to write file by URL ${fullPath}: ${error.message}`);
    }
  }

  async updateFile(path, content, options) {
    const fullPath = this._getFullPath(path);
    try {
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
    } catch (error) {
      throw new Error(`Failed to update file by URL ${fullPath}: ${error.message}`);
    }
  }

  async deleteFile(path) {
    const fullPath = this._getFullPath(path);
    try {
      await axios({
        ...auth.REQUEST_OPTIONS,
        method: 'delete',
        url: fullPath,
      });
    } catch (error) {
      throw new Error(`Failed to delete file by URL ${fullPath}: ${error.message}`);
    }
  }

  _getFullPath(path) {
    return`${auth.BASE_URL}/${path}`;
  }
}

module.exports = Server;
