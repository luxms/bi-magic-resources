const utils = require('../../lib/utils');

/**
 * Базовый класс для работы с файлами
 */
class ContentManager {
  constructor(platform) {
    this.platform = platform;
  }

  async enumerate(schemaName) {
    const list = [];
    const schemaNames = schemaName ? [schemaName] : await this.platform.getSchemaNames();
    for (const schemaName of schemaNames) {
      const files = await this.platform.getFiles(schemaName, this.getDirName());
      for (const file of files) {
        list.push(this.createPath(schemaName, file));
      }
    }
    return list.filter(Boolean).sort();
  }

  async getContent(path) {
    throw new Error('Method getContent must be implemented');
  }

  async createContent(path, content) {
    throw new Error('Method createContent must be implemented');
  }

  async updateContent(path, content) {
    throw new Error('Method updateContent must be implemented');
  }

  async deleteContent(path) {
    throw new Error('Method deleteContent must be implemented');
  }

  getDirName() {
    throw new Error('Method getDirName must be implemented');
  }

  createPath(schemaName, fileName) {
    return `/${schemaName}/${utils.encodePath(fileName)}`;
  }
}

module.exports = ContentManager;
