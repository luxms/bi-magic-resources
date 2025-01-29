const Manager = require('./base/Manager');

/**
 * - ConcreteImplementor (bridge pattern)
 */
class ResourceManager extends Manager {
  async getContent(resource) {
    return this.platform.getResourceContent(resource);
  }

  async saveContent(resource, content) {
    return this.platform.saveResourceContent(resource, content);
  }

  async createContent(resource, content) {
    return this.platform.createResourceContent(resource, content);
  }

  async removeContent(resource) {
    return this.platform.removeResourceContent(resource);
  }

  async enumerate(schemaName) {
    const resources = await this.platform.getResources(schemaName);
    return resources.map(resource => `/${schemaName}/${encodeURIComponent(resource)}`);
  }
}

module.exports = ResourceManager;
