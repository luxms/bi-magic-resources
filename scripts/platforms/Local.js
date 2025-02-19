const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const JSON5 = require('json5');
const { splitResource, filterSchemaNames } = require('../lib/utils');
const Platform = require('./base/Platform');

class Local extends Platform {
  constructor(baseDir = 'src') {
    super();
    this.BASE_DIR = path.resolve(__dirname, '..', '..', baseDir);
    this.type = 'local';
  }

  setBaseDir(dir) {
    this.BASE_DIR = path.resolve(__dirname, '..', '..', dir);
  }

  async getSchemaNames() {
    const entries = await fsp.readdir(this.BASE_DIR, {withFileTypes: true});
    const schemaNames = filterSchemaNames(
      entries
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name)
    );
    return schemaNames;
  }

  async getFiles(...pathSegments) {
    const dirPath = path.join(...pathSegments);
    const fullPath = path.join(this.BASE_DIR, dirPath);
    const entries = await fsp.readdir(fullPath, { withFileTypes: true });
    
    const filePromises = entries.map(async entry => {
      if (entry.isDirectory()) {
        const subResults = await this.getFiles(dirPath, entry.name);
        return subResults.map(file => path.join(entry.name, file));
      }
      
      return entry.name === '.gitkeep' ? null : entry.name;
    });

    const results = await Promise.all(filePromises);
    return results.flat().filter(Boolean);
  }

  async readFile(filePath) {
    try {
      const fullPath = path.join(this.BASE_DIR, filePath);
      await fsp.stat(fullPath);

      if (filePath.endsWith('.json')) {
        const content = await fsp.readFile(fullPath, { encoding: 'utf8' });
        return JSON.parse(content);
      }

      return await fsp.readFile(fullPath);
    } catch (err) {
      return null;
    }
  }

  _getSchemaPath(schemaName) {
    return path.resolve(this.BASE_DIR, schemaName);
  }

  _getResourcePath(schemaName, resourceName) {
    return path.resolve(this.BASE_DIR, schemaName, path.join(...resourceName.split('/')));
  }

  _isReservedDirectory(dirName) {
    return dirName.startsWith('topic.') || dirName.startsWith('.cubes');
  }

  async getResourceContent(resource) {
    const [schemaName, resourceName] = splitResource(resource);
    const filePath = this._getResourcePath(schemaName, resourceName);

    try {
      await fs.stat(filePath);
      return fs.readFile(filePath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        return null;
      }
      throw err;
    }
  }

  async createResourceContent(resource, content) {
    const [schemaName, resourceName] = splitResource(resource);
    const filePath = resourceName.split('/');
    const fileName = filePath.pop();
    const dirPath = path.join(this._getSchemaPath(schemaName), ...filePath);

    try {
      await fs.mkdir(dirPath, { recursive: true });
      await fs.writeFile(path.join(dirPath, fileName), content);
    } catch (err) {
      throw new Error(`Failed to create resource ${resource}: ${err.message}`);
    }
  }

  async saveResourceContent(resource, content) {
    return this.createResourceContent(resource, content);
  }

  async removeResourceContent(resource) {
    const [schemaName, resourceName] = splitResource(resource);
    const filePath = this._getResourcePath(schemaName, resourceName);
    const dirPath = this._getSchemaPath(schemaName);

    try {
      await fs.unlink(filePath);

      // Clean up empty directories
      const filesLeft = await fs.readdir(dirPath);
      if (filesLeft.length === 0) {
        await fs.rmdir(dirPath);
      }
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }
  }

  async writeFile(filePath, content) {
    const fullPath = path.join(this.BASE_DIR, filePath);
    const dir = path.dirname(fullPath);

    try {
      await fsp.stat(dir);
    } catch (err) {
      await fsp.mkdir(dir, { recursive: true });
    }

    await fsp.writeFile(fullPath, content);
  }

  async deleteFile(filePath) {
    const fullPath = path.join(this.BASE_DIR, filePath);
    try {
      await fsp.unlink(fullPath);
    } catch (err) {
      // File doesn't exist, ignore
    }
  }

  async makeDirectory(dirPath) {
    const fullPath = path.join(this.BASE_DIR, dirPath);
    await fsp.mkdir(fullPath, { recursive: true });
  }
}

module.exports = Local;
