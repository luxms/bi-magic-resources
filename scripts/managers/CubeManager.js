const { v4: uuidv4 } = require('uuid');
const utils = require('../lib/utils');
const ContentManager = require('./base/ContentManager');

class CubeManager extends ContentManager {
  async getContent(cubePath) {
    if (this.platform.type === 'server') {
      const [schemaName, cubeId] = this.splitPath(cubePath);
      const cubeUrl = `api/db/${schemaName}.cubes/${cubeId}`;
      const [cube] = await this.platform.readFile(cubeUrl, { responseType: 'json' });
      const dimensionsUrl = `api/db/${schemaName}.dimensions/.filter(source_ident='${cube.source_ident}'&&cube_name='${cube.name}')`;
      const dimensions = await this.platform.readFile(dimensionsUrl, { responseType: 'json' });
      const result = this.toLocalFormat(cube, dimensions);
      return utils.cleanPropertyMembers(result);
    }

    const result = await this.platform.readFile(cubePath);
    return utils.cleanPropertyMembers(result);
  }

  async createContent(cubePath, content) {
    const newContent = {...content};
    if (!content.guid) newContent.guid = uuidv4();
    if (!content.dimensions) newContent.dimensions = [];

    if (this.platform.type === 'server') {
      const [schemaName] = this.splitPath(cubePath);
      const [cube, dimensions] = this.toServerFormat(newContent);
      const cubeUrl = `api/db/${schemaName}.cubes`;
      await this.platform.writeFile(cubeUrl, cube);
      const dimensionsUrl = `api/db/${schemaName}.dimensions`;
      for (const dimension of dimensions) {
        await this.platform.writeFile(dimensionsUrl, dimension);
      }
    } else {
      await this.platform.writeFile(cubePath, newContent);
    }

    return newContent;
  }

  async updateContent(cubePath, content) {
    if (this.platform.type === 'server') {
      const [schemaName, cubeId] = this.splitPath(cubePath);
      const [newCube, newDimensions] = this.toServerFormat(content);

      // Запрашваем текущие данные для сравнения
      const currentContent = await this.getContent(cubePath);
      const [_, currentDimensions] = this.toServerFormat(currentContent);

      // Обновляем сам куб
      const cubeUrl = `api/db/${schemaName}.cubes/${cubeId}`;
      await this.platform.updateFile(cubeUrl, newCube);

      // Создаем, обновляем или удаляем дименшены куба
      const createDimensions = [], updateDimensions = [], deleteDimensions = [];
      const currentDimensionsMap = new Map(currentDimensions.map(dim => [dim.name, dim]));
      const newDimensionsMap = new Map(newDimensions.map(dim => [dim.name, dim]));

      for (const newDim of newDimensions) {
        const currentDim = currentDimensionsMap.get(newDim.name);
        if (!currentDim) createDimensions.push(newDim);
        else if (!utils.compareObjects(currentDim, newDim)) updateDimensions.push(newDim);
      }

      for (const currentDim of currentDimensions) {
        if (!newDimensionsMap.has(currentDim.name)) deleteDimensions.push(currentDim);
      }

      const dimensionsUrl = `api/db/${schemaName}.dimensions`;
      for (const dim of createDimensions) {
        await this.platform.writeFile(dimensionsUrl, dim);
      }

      for (const dim of updateDimensions) {
        await this.platform.updateFile(`${dimensionsUrl}/${cubeId}.${dim.name}`, dim);
      }

      for (const dim of deleteDimensions) {
        await this.platform.deleteFile(`${dimensionsUrl}/${cubeId}.${dim.name}`);
      }
    } else {
      await this.platform.updateFile(cubePath, content);
    }
  }

  async deleteContent(cubePath) {
    if (this.platform.type === 'server') {
      const [schemaName, cubeId] = this.splitPath(cubePath);
      const currentContent = await this.getContent(cubePath);
      const [_, dimensions] = this.toServerFormat(currentContent);
      
      for (const dimension of dimensions) {
        await this.platform.deleteFile(`api/db/${schemaName}.dimensions/${dimension.id}`);
      }

      const cubeUrl = `api/db/${schemaName}.cubes/${cubeId}`;
      await this.platform.deleteFile(cubeUrl);
    } else {
      await this.platform.deleteFile(cubePath);
    }
  }

  async getDataSources(schemaName) {
    const url = `api/db/${schemaName}.data_sources/` + (schemaName !== 'adm' ? '.filter(is_global=0)' : '');
    return await this.platform.readFile(url, { responseType: 'json' });
  }

  async getDataSourceData(schemaName, sql, ident, isLocal) {
    const url = 'api/ipc/service';
    const response = await this.platform.writeFile(url, {
      args: [
        isLocal ? `source://connector/${ident}?atlas=${schemaName}` : `source://connector/${ident}`,
        sql,
        1024,
        0
      ],
      service: "DataSourceInspectorService.sampleFirstRows"
    });
    return response.data;
  }

  getDirName() {
    return this.platform.type === 'server' ? 'cubes' : '.cubes';
  }

  createPath(schemaName, cube) {
    const fileName = typeof cube === 'string'
      ? cube.endsWith('.json') ? cube : `${cube}.json`
      : cube.hasOwnProperty('id') ? `${cube.id}.json` : `${cube.source_ident}.${cube.name}.json`;
    return `/${schemaName}/.cubes/${fileName}`;
  }

  splitPath(path) {
    const [schemaName, dirName, fileName] = path.split('/').filter(Boolean);
    const cubeId = fileName.endsWith('.json') ? fileName.slice(0, -5) : fileName;
    return [schemaName, cubeId];
  }

  toLocalFormat(cube, dimensions) {
    ['id', 'is_source_global', 'is_global', '_has_model'].forEach((key) => delete cube[key]);
    ['id', 'is_cube_global', 'is_global', 'source_ident', 'cube_id', 'cube_name'].forEach((key) => dimensions.forEach(dim => delete dim[key]));
    return { ...cube, dimensions };
  }

  toServerFormat(content) {
    let { dimensions, ...cubeData } = content;
    const cubeId = `${cubeData.source_ident}.${cubeData.name}`;
    const cube = {
      ...cubeData,
      id: cubeId,
      is_source_global: 0,
      is_global: 0,
    };
    dimensions = dimensions ? dimensions.map((dim) => {
      return {
        ...dim,
        id: `${cubeId}.${dim.name}`,
        is_cube_global: 0,
        is_global: 0,
        source_ident: cubeData.source_ident,
        cube_name: cubeData.name,
        cube_id: cubeId,
      };
    }) : [];
    return [cube, dimensions];
  }
}

module.exports = CubeManager;
