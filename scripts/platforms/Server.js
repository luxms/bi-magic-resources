const axios = require('axios').default;
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');
const mime = require('mime-types');
const { splitResource, filterSchemaNames } = require('../lib/utils');
const Platform = require('./base/Platform');

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

   /**
   * Gets resource ID from the server
   * @private
   */
   async _getResourceId(resource) {
    const [schemaName, altId] = splitResource(resource);
    const url = auth.getApiUrl(`/db/${schemaName}.resources/.filter(alt_id='${encodeURIComponent(altId)}')`);
    
    const response = await axios.get(url, auth.getRequestOptions());
    if (!response.data.length) {
      throw new Error(`Resource not found: ${resource}`);
    }
    
    return response.data[0].id;
  }

  async getSchemaNames() {
    const url = auth.getApiUrl('/db/adm.datasets');
    try {
      const response = await axios.get(url, auth.getRequestOptions());
      return filterSchemaNames(response.data.map(item => item.schema_name));
    } catch (err) {
      console.warn(`Failed to get schema names: ${err.message}`);
      throw err;
    }
  }

  async getResources(schemaName) {
    const url = auth.getApiUrl(`/db/${schemaName}.resources`);
    try {
      const response = await axios.get(url, auth.getRequestOptions());
      return response.data.map(entry => entry.alt_id);
    } catch (err) {
      if (err.response?.status === 404) {
        return [];
      }
      throw err;
    }
  }

  async getResourceContent(resource) {
    const url = auth.getResourceUrl(resource);
    try {
      const response = await axios.get(url, {
        ...auth.getRequestOptions(),
        responseType: 'arraybuffer'
      });
      return response.data;
    } catch (err) {
      if (err.response?.status === 404) {
        return null;
      }
      throw err;
    }
  }

  async createResourceContent(resource, content) {
    const [schemaName, altId] = splitResource(resource);
    const createMetaUrl = auth.getApiUrl(`/db/${schemaName}.resources/`);

    // Create resource metadata first
    const createMetaResponse = await axios({
      method: 'post',
      url: createMetaUrl,
      ...auth.getRequestOptions({
        'Content-Type': 'application/json'
      }),
      data: {
        alt_id: altId,
        content_type: (mime.lookup(altId) || 'application/octet-stream')
          .replace('application/json', 'text/plain') // Server workaround
      }
    });

    const { id } = createMetaResponse.data;
    console.log('Created resource with id:', id);

    // Then save the content
    await this.saveResourceContent(resource, content);
  }

  async saveResourceContent(resource, content) {
    const [schemaName, altId] = splitResource(resource);
    const id = await this._getResourceId(resource);
    const url = auth.getApiUrl(`/srv/resources/${schemaName}/${id}`);

    const contentType = mime.lookup(altId) || 'application/octet-stream';
    const response = await axios({
      method: 'put',
      url,
      data: content,
      ...auth.getRequestOptions({
        'Content-Type': contentType.replace('application/json', 'text/plain')
      })
    });

    // Update content type for JSON files
    if (response.status === 200 && contentType.includes('application/json')) {
      const metaUrl = auth.getApiUrl(`/db/${schemaName}.resources/${id}`);
      await axios({
        method: 'put',
        url: metaUrl,
        ...auth.getRequestOptions(),
        data: { content_type: 'application/json' }
      });
    }
  }

  async removeResourceContent(resource) {
    const [schemaName] = splitResource(resource);
    const id = await this._getResourceId(resource);
    
    const url = auth.getApiUrl(`/db/${schemaName}.resources/${id}`);
    await axios.delete(url, auth.getRequestOptions());
  }

  async getFiles(schemaName, dirName) {
    const url = `${this.SERVER}/api/db/${schemaName}.${dirName}`;
    try {
      const response = await axios.get(url, {withCredentials: true, jar: this.cookieJar});
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch files for schema ${schemaName}: ${error.message}`);
    }
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
