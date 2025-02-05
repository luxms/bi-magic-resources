/**
 * - Implementor (bridge pattern)
 */
class Manager {
  constructor(platform) {
    this.platform = platform;
  }

  /**
   * Перечислить все файлы
   * @returns {string[]}
   */
  async enumerate() {
    const resources = [];
    const schemaNames = await this.platform.getSchemaNames();

    for (const schemaName of schemaNames) {
      const fileNames = await this.platform.getFiles(schemaName);
      for (const fileName of fileNames) {
        resources.push(`/${schemaName}/${fileName}`);
      }
    }

    resources.sort();
    return resources;
  }

  async getContent(resource) {
    throw new Error('getContent must be implemented');
  }

  async createContent(resource, content) {
    throw new Error('createContent must be implemented');
  }

  async updateContent(resource, content) {
    throw new Error('saveContent must be implemented');
  }

  async deleteContent(resource) {
    throw new Error('removeContent must be implemented');
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
