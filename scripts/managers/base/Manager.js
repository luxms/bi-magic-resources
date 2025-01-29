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

  // Common utility methods for managers
  async readJSONFile(path) {
    const content = await this.platform.readFile(path);
    return content ? JSON.parse(content) : null;
  }

  async writeJSONFile(path, content) {
    await this.platform.writeFile(path, JSON.stringify(content, null, 2));
  }
}

module.exports = Manager;
