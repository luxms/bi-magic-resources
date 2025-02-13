const Manager = require('./base/Manager');

class ResourceManager extends Manager {
  async enumerate() {
    const list = [];
    const schemaNames = await this.platform.getSchemaNames();

    for (const schemaName of  schemaNames) {
      const resources = await this.platform.getResources(schemaName);
      for (const resource of resources) {
        list.push(`/${schemaName}/${resource}`);
      }
    }

    return list.sort();
  }

  /**
   * Gets content of a resource
   * @param {string} path - Full resource path
   * @returns {Promise<Buffer>}
   */
  async getContent(path) {
    return this.platform.getResourceContent(path);
  }

  /**
   * Creates a new resource
   * @param {string} path - Full resource path
   * @param {Buffer} content - Resource content
   * @returns {Promise<void>}
   */
  async createContent(path, content) {
    return this.platform.createResourceContent(path, content);
  }

  /**
   * Updates existing resource
   * @param {string} path - Full resource path
   * @param {Buffer} content - New resource content
   * @returns {Promise<void>}
   */
  async updateContent(path, content) {
    return this.platform.saveResourceContent(path, content);
  }

  /**
   * Deletes a resource
   * @param {string} path - Full resource path
   * @returns {Promise<void>}
   */
  async deleteContent(path) {
    return this.platform.removeResourceContent(path);
  }
}

module.exports = ResourceManager;
