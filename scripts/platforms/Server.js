const axios = require('axios').default;
const mime = require('mime-types');
const {splitResource, filterSchemaNames} = require('../lib/utils');
const Platform = require('./base/Platform');
const auth = require('../lib/auth');

class Server extends Platform {
  constructor() {
    super();
    this.TREE_FF = {};
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

  async getDashboards(schemaName) {
    let result = [];
    const response = await Promise.all([
      axios({
        method: 'get',
        url: `${auth.BASE_URL}/api/db/${schemaName}.dashboard_topics`,
        ...auth.REQUEST_OPTIONS
      }),
      axios({
        method: 'get',
        url: `${auth.BASE_URL}/api/db/${schemaName}.dashboards`,
        ...auth.REQUEST_OPTIONS
      }),
      axios({
        method: 'get',
        url: `${auth.BASE_URL}/api/db/${schemaName}.dashlets`,
        ...auth.REQUEST_OPTIONS
      })
    ]);
    const topics = response[0].data;
    const dashboards = response[1].data;
    const dashlets = response[2].data;
    const snFolders = this.TREE_FF[schemaName] = {};
    for (let topic of topics) {
      const topicId = topic.id
      result.push(`topic.${topicId}/index.json`);
      if (topic.hasOwnProperty('id')) delete topic.id;
      if (topic.hasOwnProperty('updated')) delete topic.updated;
      const snf = snFolders[`topic.${topicId}`] = {index: topic};
      for (let db of dashboards) {
        if (db.topic_id == topicId) {
          const dashboardId = db.id
          result.push(`topic.${topicId}/dashboard.${dashboardId}/index.json`);
          if (db.hasOwnProperty('id')) delete db.id;
          if (db.hasOwnProperty('updated')) delete db.updated;
          const cd = snf[`dashboard.${dashboardId}`] = {index: db};
          dashlets.forEach((d) => {
            if (d.dashboard_id == dashboardId) {
              const dashId = d.id;
              result.push(`topic.${topicId}/dashboard.${dashboardId}/${dashId}.json`);
              if (d.hasOwnProperty('id')) delete d.id;
              if (d.hasOwnProperty('updated')) delete d.updated;
              cd[dashId] = d;
            }
          })
        }
      }
    }
   return result;
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

  async _getResourceId(resource) {
    const [schemaName, altId] = splitResource(resource);
    const url = `${auth.BASE_URL}/api/db/${schemaName}.resources/.filter(alt_id='${encodeURIComponent(altId)}')`;
    const response = await axios.get(url, auth.REQUEST_OPTIONS);
    if (!response.data.length) {
      throw new Error(`Resource not found: ${resource}`);
    }
    return response.data[0].id;
  }

  async getResourceContent(resource) {
    const url = `${auth.BASE_URL}/srv/resources${resource}`;
    try {
      const response = await axios.get(url, {
        ...auth.REQUEST_OPTIONS,
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
    const createMetaUrl = `${auth.BASE_URL}/db/${schemaName}.resources/`;

    // Create resource metadata first
    const createMetaResponse = await axios({
      ...auth.REQUEST_OPTIONS,
      method: 'post',
      url: createMetaUrl,
      headers: {
        ...auth.REQUEST_OPTIONS.headers,
        'Content-Type': 'application/json'
      },
      data: {
        alt_id: altId,
        content_type: (mime.lookup(altId) || 'application/octet-stream')
          .replace('application/json', 'text/plain')
      }
    });

    const {id} = createMetaResponse.data;
    console.log('Created resource with id:', id);

    // Then save the content
    await this.saveResourceContent(resource, content);
  }

  async saveResourceContent(resource, content) {
    const [schemaName, altId] = splitResource(resource);
    const id = await this._getResourceId(resource);
    const contentType = mime.lookup(altId) || 'application/octet-stream';
    const response = await axios({
      ...auth.REQUEST_OPTIONS,
      headers: {
        ...auth.REQUEST_OPTIONS.headers,
        'Content-Type': contentType.replace('application/json', 'text/plain')
      },
      method: 'put',
      url: `${auth.BASE_URL}/srv/resources/${schemaName}/${id}`,
      data: content,
    });

    // Update content type for JSON files
    if (response.status === 200 && contentType.includes('application/json')) {
      const metaUrl = `${auth.BASE_URL}/api/db/${schemaName}.resources/${id}`;
      await axios({
        method: 'put',
        url: metaUrl,
        ...auth.REQUEST_OPTIONS,
        data: { content_type: 'application/json' }
      });
    }
  }

  async removeResourceContent(resource) {
    const [schemaName] = splitResource(resource);
    const id = await this._getResourceId(resource);
    const url = `${auth.BASE_URL}/api/db/${schemaName}.resources/${id}`;
    await axios.delete(url, auth.REQUEST_OPTIONS);
  }

  // Server-specific HTTP methods that managers will use
  async get(endpoint, options = {}) {
    const url = `${auth.BASE_URL}/${endpoint}`;
    return axios.get(url, {
      ...auth.REQUEST_OPTIONS,
      ...options,
    });
  }

  async post(endpoint, data, options = {}) {
    const url = `${auth.BASE_URL}/${endpoint}`;
    return axios.post(url, data, {
      ...auth.REQUEST_OPTIONS,
      ...options,
    });
  }

  async put(endpoint, data, options = {}) {
    const url = `${auth.BASE_URL}/${endpoint}`;
    return axios.put(url, data, {
      ...auth.REQUEST_OPTIONS,
      ...options,
    });
  }

  async delete(endpoint, options = {}) {
    const url = `${auth.BASE_URL}/${endpoint}`;
    return axios.delete(url, {
      ...auth.REQUEST_OPTIONS,
      ...options,
    });
  }
}

module.exports = Server;
