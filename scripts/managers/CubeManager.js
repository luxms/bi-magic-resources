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

  async getContent(cube) {
    if (this.platform.type === 'server') {
      const [schemaName, cubeFolder, cubeId] = cube.split('/').filter(Boolean);
      const cubeUrl = `api/db/${schemaName}.cubes/${cubeId}`;
      const cubeData = await this.platform.readFile(cubeUrl);
      const dimensionsUrl = `api/db/${schemaName}.dimensions/.filter(source_ident='${cubeData[0].source_ident}')`;
      const dimensionsData = await this.platform.readFile(dimensionsUrl);

      // Чистим от всего лишнего, todo возможно стоит вынести в хэлпер
      ['id', 'is_source_global', 'is_global'].forEach(key => delete cubeData[key]);
      ['id', 'is_cube_global', 'is_global', 'source_ident', 'cube_id', 'cube_name'].forEach((key) => {
        dimensionsData.forEach(dim => delete dim[key])
      });

      return { ...cubeData, dimensions: dimensionsData };
    }

    return await this.platform.readFile(cube);
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
