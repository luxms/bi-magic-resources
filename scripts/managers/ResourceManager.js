const Manager = require('./base/Manager');

/**
 * - ConcreteImplementor (bridge pattern)
 */
class ResourceManager extends Manager {
  async getContent(resource) {
    return await this.platform.readFile(resource);
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

  async enumerate() {
    const resources = [];
    const schemaNames = await this.platform.getSchemaNames();

    for (const schemaName of schemaNames) {
      const files = await this.platform.getFiles(schemaName, 'resources');
      for (const file of files) {
        const fileName = typeof file === 'string' ? file : file.alt_id;
        resources.push(`/${schemaName}/${fileName}`);
      }
    }

    resources.sort();
    return resources;
  }
}

module.exports = ResourceManager;
