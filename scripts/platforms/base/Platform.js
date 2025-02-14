const CubeManager = require('../../managers/CubeManager');
const DashboardManager = require('../../managers/DashboardManager');
const ResourceManager = require('../../managers/ResourceManager');

class Platform {
  constructor() {
    this.dashboards = new DashboardManager(this);
    this.resources = new ResourceManager(this);
    this.cubes = new CubeManager(this);
  }

  async getSchemaNames() {
    throw new Error('Method getSchemaNames must be implemented');
  }

  async getFiles(schemaNames) {
    throw new Error('Method getFiles must be implemented');
  }

  async readFile(path) {
    throw new Error('Method readFile must be implemented');
  }

  async writeFile(path, content) {
    throw new Error('Method writeFile must be implemented');
  }

  async deleteFile(path) {
    throw new Error('Method deleteFile must be implemented');
  }

  async makeDirectory(path) {
    throw new Error('Method makeDirectory must be implemented');
  }
}

module.exports = Platform;
