const ContentManager = require('./base/ContentManager');

class ResourceManager extends ContentManager {
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

  async getContent(path) {
    if (this.platform.type === 'server') {
      return this.platform.getResourceContent(path);
    }

    return await this.platform.readFile(path);
  }

  async createContent(path, content) {
    return this.platform.createResourceContent(path, content);
  }

  async updateContent(path, content) {
    return this.platform.saveResourceContent(path, content);
  }

  async deleteContent(path) {
    return this.platform.removeResourceContent(path);
  }
}

module.exports = ResourceManager;
