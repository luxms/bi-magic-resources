/**
 * Abstract base class representing a data storage platform
 */
class Platform {
  constructor() {}

  /**
   * Получить список schemaNames
   * @returns {string[]}
   */
  async getSchemaNames() {
    throw new Error('getSchemaNames must be implemented');
  }

  /**
   * Получить список файлов по schemaName
   * @returns {any[]}
   */
  async getFiles(schemaNames) {
    throw new Error('getFiles must be implemented');
  }

  // Each platform should implement only these core methods
  // that are used by managers
  async readFile(path) {
    throw new Error('readFile must be implemented');
  }

  async writeFile(path, content) {
    throw new Error('writeFile must be implemented');
  }

  async deleteFile(path) {
    throw new Error('deleteFile must be implemented');
  }

  async makeDirectory(path) {
    throw new Error('makeDirectory must be implemented');
  }

  // Authentication methods for ServerPlatform
  async login(username, password) {
    throw new Error('login must be implemented');
  }

  async logout() {
    throw new Error('logout must be implemented');
  }
}

module.exports = Platform;
