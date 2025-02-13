const Manager = require('./base/Manager');

class ResourceManager extends Manager {
  /**
   * Lists all resources across all schemas
   * @returns {Promise<string[]>}
   */
  async enumerate() {
    const list = [];
    const schemaNames = await this.platform.getSchemaNames();

    for (const schemaName of schemaNames) {
      const resources = await this.platform.getResources(schemaName);
      for (const resource of resources) {
        // Note: Server and Local treat encoding differently
        // Server needs encoded paths, Local works with raw paths
        const resourcePath = this.platform.constructor.name === 'Server' 
          ? `/${schemaName}/${encodeURIComponent(resource)}`
          : `/${schemaName}/${resource}`;
        list.push(resourcePath);
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
