const ContentManager = require('./base/ContentManager');
const utils = require('../lib/utils');

class CubeManager extends ContentManager {
  async enumerate() {
    const list = [];
    const schemaNames = await this.platform.getSchemaNames();

    for (const schemaName of schemaNames) {
      const files = await this.platform.getFiles(schemaName, 'cubes');

      for (const file of files) {
        const fileName = typeof file === 'string' ? file : `${file.id}.json`;
        list.push(`/${schemaName}/cubes/${fileName}`);
      }
    }

    return list.sort();
  }

  async getContent(cube) {
    if (this.platform.type === 'server') {
      const [schemaName, _, fileName] = cube.split('/').filter(Boolean);
      const cubeId = fileName.endsWith('.json') ? fileName.slice(0, -5) : fileName;

      const cubeUrl = `api/db/${schemaName}.cubes/${cubeId}`;
      const [cubeData] = await this.platform.readFile(cubeUrl, { responseType: 'json' });

      const dimensionsUrl = `api/db/${schemaName}.dimensions/.filter(source_ident='${cubeData.source_ident}')`;
      const dimensionsData = await this.platform.readFile(dimensionsUrl, { responseType: 'json' });

      // Чистим от всего лишнего, todo возможно стоит вынести в хэлпер
      ['id', 'is_source_global', 'is_global'].forEach(key => delete cubeData[key]);
      ['id', 'is_cube_global', 'is_global', 'source_ident', 'cube_id', 'cube_name'].forEach((key) => {
        dimensionsData.forEach(dim => delete dim[key])
      });

      const result = { ...cubeData, dimensions: dimensionsData };
      return utils.cleanPropertyMembers(result);
    }

    const result = await this.platform.readFile(cube);
    return utils.cleanPropertyMembers(result);
  }

  async createContent(path, content) {
    return this.platform.writeFile(path, content);
  }

  async updateContent(path, content) {
    return this.platform.updateFile(path, content);
  }

  async deleteContent(path) {
    return this.platform.removeJSONContent(path);
  }
}

module.exports = CubeManager;
