const axios = require('axios').default;
const {filterSchemaNames} = require('../lib/utils');
const Platform = require('./base/Platform');
const auth = require('../lib/auth');

function formatAxiosError(error) {
  const data = error.response?.data;
  if (data == null) return error.message;
  let body = Buffer.isBuffer(data) ? data.toString('utf8') : (typeof data === 'string' ? data : JSON.stringify(data));
  if (body.length > 2000) body = body.slice(0, 2000) + '… (truncated)';
  return `${error.message}\nResponse body: ${body}`;
}

function extractMissingColumn(error) {
  const data = error.response?.data;
  if (data == null) return null;
  let message;
  if (Buffer.isBuffer(data)) message = data.toString('utf8');
  else if (typeof data === 'string') message = data;
  else if (typeof data === 'object' && typeof data.message === 'string') message = data.message;
  else message = JSON.stringify(data);
  const match = message.match(/column "([^"]+)" of relation "[^"]+" does not exist/);
  return match ? match[1] : null;
}

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
      throw new Error(`Failed to get schema names by URL ${url}: ${formatAxiosError(error)}`);
    }
  }

  async getFiles(schemaName, dirName) {
    const url = `${auth.BASE_URL}/api/db/${schemaName}.${dirName}`;
    try {
      const response = await axios.get(url, auth.REQUEST_OPTIONS);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return [];
      throw new Error(`Failed to get files by URL ${url}: ${formatAxiosError(error)}`);
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
      throw new Error(`Failed to read file by URL ${fullPath}: ${formatAxiosError(error)}`);
    }
  }

  async writeFile(path, content, options) {
    const fullPath = this._getFullPath(path);
    let data = content;
    const stripped = [];
    for (let attempt = 0; attempt < 10; attempt++) {
      try {
        return await axios({
          ...auth.REQUEST_OPTIONS,
          headers: {
            'Content-Type': 'application/json',
            ...auth.REQUEST_OPTIONS.headers,
            ...(options && options.headers || {}),
          },
          method: 'post',
          url: fullPath,
          data,
        });
      } catch (error) {
        const missingColumn = extractMissingColumn(error);
        if (missingColumn && data && typeof data === 'object' && missingColumn in data) {
          const {[missingColumn]: _drop, ...rest} = data;
          data = rest;
          stripped.push(missingColumn);
          continue;
        }
        throw new Error(`Failed to write file by URL ${fullPath}: ${formatAxiosError(error)}`);
      }
    }
    throw new Error(`Failed to write file by URL ${fullPath}: too many missing columns (stripped: ${stripped.join(', ')})`);
  }

  async updateFile(path, content, options) {
    const fullPath = this._getFullPath(path);
    let data = content;
    const stripped = [];
    for (let attempt = 0; attempt < 10; attempt++) {
      try {
        return await axios({
          ...auth.REQUEST_OPTIONS,
          headers: {
            ...auth.REQUEST_OPTIONS.headers,
            ...(options && options.headers || {}),
          },
          method: 'put',
          url: fullPath,
          data,
        });
      } catch (error) {
        const missingColumn = extractMissingColumn(error);
        if (missingColumn && data && typeof data === 'object' && missingColumn in data) {
          const {[missingColumn]: _drop, ...rest} = data;
          data = rest;
          stripped.push(missingColumn);
          continue;
        }
        throw new Error(`Failed to update file by URL ${fullPath}: ${formatAxiosError(error)}`);
      }
    }
    throw new Error(`Failed to update file by URL ${fullPath}: too many missing columns (stripped: ${stripped.join(', ')})`);
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
      throw new Error(`Failed to delete file by URL ${fullPath}: ${formatAxiosError(error)}`);
    }
  }

  _getFullPath(path) {
    return`${auth.BASE_URL}/${path}`;
  }
}

module.exports = Server;
