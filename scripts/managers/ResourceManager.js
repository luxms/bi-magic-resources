const ContentManager = require('./base/ContentManager');

class ResourceManager extends ContentManager {
  async enumerate() {
    const list = [];
    const schemaNames = await this.platform.getSchemaNames();
    for (const schemaName of  schemaNames) {
      // Очень красиво получается если сложить ресурсы в отдельную папку
      const files = await this.platform.getFiles(schemaName, 'resources');
      for (const file of files) {
        const fileName = typeof file === 'string' ? file : file.alt_id;
        list.push(`/${schemaName}/resources/${fileName}`);
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
