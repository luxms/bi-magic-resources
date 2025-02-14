const ContentManager = require('./base/ContentManager');

class CubeManager extends ContentManager {
  async enumerate() {
    const list = [];
    const schemaNames = await this.platform.getSchemaNames();
    for (const schemaName of schemaNames) {
      const cubes = await this.platform.getCubes(schemaName);
      for (const cube of cubes) {
        list.push(`/${schemaName}/cubes/${cube}`);
      }
    }
    return list;
  }

  /**
   * Gets cube configuration content
   * @param {string} path - Full cube path
   * @returns {Promise<Object>}
   */
  async getContent(path) {
    const [schemaName, _, cubePath] = path.split('/').filter(Boolean);

    // For Local platform
    if (this.platform.constructor.name === 'Local') {
      return this.platform.getCubeContent(schemaName, cubePath);
    }

    // For Server platform
    return this.platform.getCubesContent(path);
  }

  /**
   * Creates a new cube configuration
   * @param {string} path - Full cube path
   * @param {Object} content - Cube configuration
   * @returns {Promise<Object|null>}
   */
  async createContent(path, content) {
    return this.platform.createJSONContent(path, content);
  }

  /**
   * Updates existing cube configuration
   * @param {string} path - Full cube path
   * @param {Object} content - New cube configuration
   * @returns {Promise<void>}
   */
  async updateContent(path, content) {
    return this.platform.saveJSONContent(path, content);
  }

  /**
   * Deletes a cube configuration
   * @param {string} path - Full cube path
   * @returns {Promise<void>}
   */
  async deleteContent(path) {
    return this.platform.removeJSONContent(path);
  }
}

module.exports = CubeManager;
