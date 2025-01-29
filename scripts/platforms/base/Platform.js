const ResourceManager = require('../../managers/ResourceManager');
const DashletManager = require('../../managers/DashletManager');
const CubeManager = require('../../managers/CubeManager');

/**
 * Abstract base class representing a data storage platform.
 * Both Local and Server classes will inherit from this
 * - Abstraction (bridge pattern)
 */
class Platform {
  constructor() {
    this.resourceManager = new ResourceManager(this);
    this.dashletManager = new DashletManager(this);
    this.cubeManager = new CubeManager(this);
  }

  // Core platform operations that managers will use
  async getSchemaNames() {
    throw new Error('getSchemaNames must be implemented');
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

  async listFiles(path) {
    throw new Error('listFiles must be implemented');
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
