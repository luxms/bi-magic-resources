const Manager = require("./Manager");

/**
 * - ConcreteImplementor (bridge pattern)
 */
class DashletManager extends Manager {
  async getContent(config) {
    return this.platform.getConfigContent(config);
  }

  async saveContent(config, content) {
    return this.platform.saveJSONContent(config, content);
  }

  async createContent(config, content) {
    return this.platform.createJSONContent(config, content);
  }

  async removeContent(config) {
    return this.platform.removeJSONContent(config);
  }

  async enumerate(schemaName) {
    const configs = await this.platform.getConfigs(schemaName);
    return configs.filter(config => !config.includes('index.json'))
      .map(config => `/${schemaName}/${config}`);
  }
}

module.exports = DashletManager;
