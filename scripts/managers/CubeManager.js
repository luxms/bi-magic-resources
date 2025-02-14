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

  async getContent(path) {
    const [schemaName, cubesFolder, cubePath] = path.split('/').filter(Boolean);

    if (this.platform.type === 'server') {
      return this.platform.getCubesContent(path);
    }

    return await this.platform.readFile(path);
  }

  async createContent(path, content) {
    return this.platform.createJSONContent(path, content);
  }

  async updateContent(path, content) {
    return this.platform.saveJSONContent(path, content);
  }

  async deleteContent(path) {
    return this.platform.removeJSONContent(path);
  }
}

module.exports = CubeManager;
