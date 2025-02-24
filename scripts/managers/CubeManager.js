const ContentManager = require('./base/ContentManager');
const utils = require('../lib/utils');

class CubeManager extends ContentManager {
  async enumerate(schemaName) {
    const list = [];
    const schemaNames = schemaName ? [schemaName] : await this.platform.getSchemaNames();
    for (const schemaName of schemaNames) {
      const folderName = this.platform.type === 'server' ? 'cubes' : '.cubes';
      const files = await this.platform.getFiles(schemaName, folderName);
      for (const file of files) {
        const fileName = typeof file === 'string' ? file : `${file.id}.json`;
        list.push(`/${schemaName}/.cubes/${fileName}`);
      }
    }
    return list.sort();
  }

  async getContent(cube) {
    if (this.platform.type === 'server') {
      const [schemaName, _, fileName] = cube.split('/').filter(Boolean);
      const cubeId = fileName.slice(0, -5);

      const cubeUrl = `api/db/${schemaName}.cubes/${cubeId}`;
      const [cubeData] = await this.platform.readFile(cubeUrl, { responseType: 'json' });

      const dimensionsUrl = `api/db/${schemaName}.dimensions/.filter(source_ident='${cubeData.source_ident}'&&cube_name='${cubeData.name}')`;
      const dimensionsData = await this.platform.readFile(dimensionsUrl, { responseType: 'json' });

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
    if (this.platform.type === 'server') {
      const [schemaName] = path.split('/').filter(Boolean);
      const { dimensions, ...cubeData } = content;

      const cubeUrl = `api/db/${schemaName}.cubes`;
      const cubeResponse = await this.platform.writeFile(cubeUrl, cubeData);

      if (cubeResponse.statusText === 'OK' && dimensions && dimensions.length) {
        const dimensionsUrl = `api/db/${schemaName}.dimensions`;
        for (const dimension of dimensions) {
          await this.platform.writeFile(dimensionsUrl, {
            ...dimension,
            source_ident: cubeData.source_ident,
            cube_id: cubeResponse.data.id,
            cube_name: cubeData.name
          });
        }
      }
    } else {
      this.platform.writeFile(path, content);
    }
  }

  async updateContent(path, content) {
    if (this.platform.type === 'server') {
      const [schemaName, _, fileName] = path.split('/').filter(Boolean);
      const cubeId = fileName.endsWith('.json') ? fileName.slice(0, -5) : fileName;
      const { dimensions: newDimensions, ...cubeData } = content;

      const dimensionsUrl = `api/db/${schemaName}.dimensions/.filter(source_ident='${cubeData.source_ident}'&&cube_name='${cubeData.name}')`;
      const currentDimensions = await this.platform.readFile(dimensionsUrl, { responseType: 'json' });
      ['id', 'is_cube_global', 'is_global', 'source_ident', 'cube_id', 'cube_name'].forEach((key) => {
        currentDimensions.forEach(dim => delete dim[key])
      });

      const cubeUrl = `api/db/${schemaName}.cubes/${cubeId}`;
      await this.platform.updateFile(cubeUrl, cubeData);

      // Дименшены можно изменить, удалить или добавить, и все в одном файле 
      const currentDimensionsMap = new Map(currentDimensions.map(dim => [dim.name, dim]));
      const newDimensionsMap = new Map(newDimensions.map(dim => [dim.name, dim]));

      const createDimensions = [];
      const updateDimensions = [];
      const deleteDimensions = [];

      for (const newDim of newDimensions) {
        const currentDim = currentDimensionsMap.get(newDim.name);
        if (!currentDim) createDimensions.push(newDim);
        else if (!utils.compareObjects(currentDim, newDim)) updateDimensions.push(newDim);
      }

      for (const currentDim of currentDimensions) {
        if (!newDimensionsMap.has(currentDim.name)) deleteDimensions.push(currentDim);
      }

      const baseUrl = `api/db/${schemaName}.dimensions`;

      for (const dim of createDimensions) {
        await this.platform.writeFile(baseUrl, {
          ...dim,
          source_ident: cubeData.source_ident,
          cube_id: cubeId,
          cube_name: cubeData.name
        });
      }

      for (const dim of updateDimensions) {
        const dimId = `${cubeData.source_ident}.${cubeData.name}.${dim.name}`;
        await this.platform.updateFile(`${baseUrl}/${dimId}`, {
          ...dim,
          source_ident: cubeData.source_ident,
          cube_id: cubeId,
          cube_name: cubeData.name
        });
      }

      for (const dim of deleteDimensions) {
        const dimId = `${cubeData.source_ident}.${cubeData.name}.${dim.name}`;
        await this.platform.deleteFile(`${baseUrl}/${dimId}`);
      }
    } else {
     this.platform.updateFile(path, content);
    }
  }

  async deleteContent(path) {
    if (this.platform.type === 'server') {
      const [schemaName, _, fileName] = path.split('/').filter(Boolean);
      const cubeId = fileName.endsWith('.json') ? fileName.slice(0, -5) : fileName;
      const cubeUrl = `api/db/${schemaName}.cubes/${cubeId}`;
      const [cubeData] = await this.platform.readFile(cubeUrl, { responseType: 'json' });
      const dimensionsUrl = `api/db/${schemaName}.dimensions/.filter(source_ident='${cubeData.source_ident}')`;
      const dimensions = await this.platform.readFile(dimensionsUrl, { responseType: 'json' });

      for (const dimension of dimensions) {
        await this.platform.deleteFile(`api/db/${schemaName}.dimensions/${dimension.id}`);
      }

      await this.platform.deleteFile(cubeUrl);
    } else {
     this.platform.deleteFile(path);
    }
  }

  async getDataSources(schemaName) {
    const url = `api/db/${schemaName}.data_sources/` + (schemaName !== 'adm' ? '.filter(is_global=0)' : '');
    return this.platform.readFile(url, { responseType: 'json' });
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
}

module.exports = CubeManager;
