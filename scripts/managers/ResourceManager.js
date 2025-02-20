const ContentManager = require('./base/ContentManager');
const utils = require('../lib/utils');

class ResourceManager extends ContentManager {
  async enumerate() {
    const list = [];
    const schemaNames = await this.platform.getSchemaNames();

    for (const schemaName of  schemaNames) {
      const files = this.platform.type === 'server'
        ? await this.platform.getFiles(schemaName, 'resources')
        : await this.platform.getFiles(schemaName);

      for (const file of files) {
        const fileName = typeof file === 'string' ? file : file.alt_id;
        if (!fileName.startsWith('cubes/') && !fileName.startsWith('topic.')) {
          list.push(`/${schemaName}/${fileName}`);
        }
      }
    }

    return list.sort();
  }

  async getContent(resource) {
    const path = this.platform.type === 'server' ? `srv/resources${resource}` : resource;
    return await this.platform.readFile(path);
  }

  async createContent(path, content) {
    if (this.platform.type === 'server') {
      const [schemaName, altId] = utils.splitResource(path);
      const metaUrl = `api/db/${schemaName}.resources/`;
      const metaData = this.platform.writeFile(metaUrl, {
        alt_id: altId,
        content_type: (mime.lookup(altId) || 'application/octet-stream').replace('application/json', 'text/plain'),
      });
      const id = metaData.data.id;
      console.log('CREATED resource with id=', id);



    } else {
      await this.platform.writeFile(path, content);
    }
  }

  async updateContent(path, content) {
    if (this.platform.type === 'server') {
      const [schemaName, altId] = utils.splitResource(path);
      const id = await this._getResourceId(path);
      const url = `srv/resources/${schemaName}/${id}`;
      const response = this.platform.updateFile(url, content);
      if (response.statusText === 'OK' && mime.lookup(altId).includes('application/json')) {
        const url = `api/db/${schemaName}.resources/${id}`;
        await this.platform.updateFile(url,  {'content_type': 'application/json'});
      }
    } else {
      await this.platform.updateFile(path, content);
    }
  }

  async deleteContent(path) {
    if (this.platform.type === 'server') {
      const [schemaName] = utils.splitResource(path);
      const id = await this._getResourceId(path);
      const url = `api/db/${schemaName}.resources/${id}`;
      await this.platform.deleteFile(url);
    } else {
      await this.platform.deleteFile(path);
    }
  }

  async _getResourceId(resource) {
    const [schemaName, altId] = utils.splitResource(resource);
    const metaUrl = `/api/db/${schemaName}.resources/.filter(alt_id='${encodeURIComponent(altId)}')`;
    const metaData = this.platform.readFile(metaUrl);
    if (!metaData.length) {
      throw new Error(`Not found resource in ${schemaName} with alt_id=${altId} (${metaUrl})`);
    }
    return metaData[0].id;
  }
}

module.exports = ResourceManager;
