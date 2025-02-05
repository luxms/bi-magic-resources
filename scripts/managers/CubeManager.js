const Manager = require('./base/Manager');

/**
 * - ConcreteImplementor (bridge pattern)
 */
class CubeManager extends Manager {
  async getContent(cube) {
    const [_, schemaName, __, cubePath] = cube.split('/');
    return this.platform.getCubeContent(schemaName, cubePath);
  }

  async saveContent(cube, content) {
    return this.platform.saveJSONContent(cube, content);
  }

  async createContent(cube, content) {
    return this.platform.createJSONContent(cube, content);
  }

  async removeContent(cube) {
    return this.platform.removeJSONContent(cube);
  }

  async enumerate(schemaName) {
    const files = super.enumerate();
    const cubes = await this.platform.getCubes(schemaName);
    return cubes.map(cube => `/${schemaName}/cubes/${cube}`);
  }
}

module.exports = CubeManager;
