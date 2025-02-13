const Platform = require('../../platforms/base/Platform');

/**
 * Base Manager class that defines common functionality for all managers
 */
class Manager {
  /**
   * @param {Platform} platform - Platform instance (Local or Server)
   */
  constructor(platform) {
    this.platform = platform;
  }

  /**
   * Lists all items managed by this manager
   * @returns {Promise<string[]>}
   */
  async enumerate() {
    throw new Error('enumerate must be implemented');
  }

  /**
   * Gets content of an item
   * @param {string} path
   * @returns {Promise<any>}
   */
  async getContent(path) {
    throw new Error('getContent must be implemented');
  }

  /**
   * Creates a new item
   * @param {string} path
   * @param {any} content
   * @returns {Promise<void>}
   */
  async createContent(path, content) {
    throw new Error('createContent must be implemented');
  }

  /**
   * Updates existing item
   * @param {string} path
   * @param {any} content
   * @returns {Promise<void>}
   */
  async updateContent(path, content) {
    throw new Error('updateContent must be implemented');
  }

  /**
   * Deletes an item
   * @param {string} path
   * @returns {Promise<void>}
   */
  async deleteContent(path) {
    throw new Error('deleteContent must be implemented');
  }
}

module.exports = Manager;
