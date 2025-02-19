const ContentManager = require('./base/ContentManager');

class CubeManager extends ContentManager {
  async enumerate() {
    const list = [];
    const schemaNames = await this.platform.getSchemaNames();
    for (const schemaName of schemaNames) {
      const files = await this.platform.getFiles(schemaName, 'cubes');
      for (const file of files) {
        const fileName = typeof file === 'string' ? file : file.id;
        list.push(`/${schemaName}/cubes/${fileName}`);
      }
    }
    return list.sort();
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
