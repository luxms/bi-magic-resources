const mime = require('mime-types');
const utils = require('../lib/utils');
const ContentManager = require('./base/ContentManager');

class ResourceManager extends ContentManager {
  async getContent(resource) {
    const path = this.platform.type === 'server' ? `srv/resources${resource}` : resource;
    // Resources are opaque files, including JSON/JSON5/YAML. Only dashboard and
    // cube managers exchange parsed configuration objects.
    return await this.platform.readFile(path, { responseType: 'arraybuffer' });
  }

  async createContent(path, content) {
    if (this.platform.type === 'server') {
      const [schemaName, altId] = utils.splitResource(path);
      const metaUrl = `api/db/${schemaName}.resources/`;
      await this.platform.writeFile(metaUrl, {
        alt_id: altId,
        content_type: this._getContentType(altId),
      });
      // A metadata-only resource already reads as an empty file. The raw
      // upload endpoint rejects an empty request body on older servers.
      if ((Buffer.isBuffer(content) && content.length === 0) || content === '') return;
      await this.updateContent(path, content)
    } else {
      await this.platform.writeFile(path, content);
    }
  }

  async updateContent(path, content) {
    if (this.platform.type === 'server') {
      const [schemaName, altId] = utils.splitResource(path);
      const id = await this._getResourceId(path);
      if ((Buffer.isBuffer(content) && content.length === 0) || content === '') {
        // Update the underlying content without deleting the resource: keep
        // its ID, metadata and access rights, and let DB triggers reset size/hash.
        await this.platform.updateFile(`api/db/${schemaName}._resources/${id}`, {content: ''});
        return;
      }
      const url = `srv/resources/${schemaName}/${id}`;
      const response = await this.platform.updateFile(url, content, {
        headers: { 'Content-Type': this._getContentType(altId) }
      });
      if (response.statusText === 'OK' && mime.lookup(altId)?.includes?.('application/json')) {
        const metaUrl = `api/db/${schemaName}.resources/${id}`;
        await this.platform.updateFile(metaUrl, { 'content_type': 'application/json' });
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
    const metaUrl = `api/db/${schemaName}.resources/.filter(alt_id='${altId}')`;      
    const metaData = await this.platform.readFile(metaUrl, { responseType: 'json' });      
    if (!metaData.length) {
      throw new Error(`Not found resource in ${schemaName} with alt_id=${altId} (${metaUrl})`);
    }
    return metaData[0].id;
  }

  _getContentType(altId) {
    try {
      const mimeType = mime.lookup(altId) || 'application/octet-stream';
      return mimeType === 'application/json' ? 'text/plain' : mimeType;
    } catch (error) {
      return 'application/octet-stream';
    }
  }

  getDirName() {
    return this.platform.type === 'server' ? 'resources' : '';
  }

  createPath(schemaName, resource) {
    const fileName = typeof resource === 'string' ? resource : resource.alt_id;
    if (fileName.startsWith('.cubes/') || fileName.startsWith('.cubes\\') || /^topic\.\d+[\\/]/.test(fileName)) return null;
    return `/${schemaName}/${utils.encodePath(fileName)}`;
  }
}

module.exports = ResourceManager;
