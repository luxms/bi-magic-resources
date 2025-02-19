const ContentManager = require('./base/ContentManager');

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
    this.platform.writeFile(path, content);
  }

  async updateContent(path, content) {
    return this.platform.saveResourceContent(path, content);
  }

  async deleteContent(path) {
    return this.platform.removeResourceContent(path);
  }
}

module.exports = ResourceManager;
