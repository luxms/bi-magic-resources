/**
 * Base Platform class that defines the interface for Local and Server
 */
class Platform {
  constructor() {}

  /**
   * Gets list of available schema names
   * @returns {string[]}
   */
  async getSchemaNames() {
    throw new Error('getSchemaNames must be implemented');
  }


  /**
   * Gets list of resources for a schema
   * @param {string} schemaName
   * @returns {Promise<string[]>}
   */
  async getResources(schemaName) {
    throw new Error('getResources must be implemented');
  }

  /**
   * Gets content of a resource
   * @param {string} resource
   * @returns {Promise<Buffer>}
   */
  async getResourceContent(resource) {
    throw new Error('getResourceContent must be implemented');
  }

  /**
   * Creates a new resource
   * @param {string} resource
   * @param {Buffer} content
   * @returns {Promise<void>}
   */
  async createResourceContent(resource, content) {
    throw new Error('createResourceContent must be implemented');
  }

  /**
   * Updates existing resource content
   * @param {string} resource
   * @param {Buffer} content
   * @returns {Promise<void>}
   */
  async saveResourceContent(resource, content) {
    throw new Error('saveResourceContent must be implemented');
  }

  /**
   * Removes a resource
   * @param {string} resource
   * @returns {Promise<void>}
   */
  async removeResourceContent(resource) {
    throw new Error('removeResourceContent must be implemented');
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
}

module.exports = Platform;
