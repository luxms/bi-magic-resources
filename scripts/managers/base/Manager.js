/**
 * - Implementor (bridge pattern)
 */
class Manager {
  constructor(platform) {
    // Connect with Abstraction
    this.platform = platform;
  }

  async getContent(resource) {
    throw new Error('getContent must be implemented');
  }

  async saveContent(resource, content) {
    throw new Error('saveContent must be implemented');
  }

  async createContent(resource, content) {
    throw new Error('createContent must be implemented');
  }

  async removeContent(resource) {
    throw new Error('removeContent must be implemented');
  }

  async enumerate(schemaName) {
    throw new Error('enumerate must be implemented');
  }
}

module.exports = Manager;
