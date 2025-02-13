const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const JSON5 = require('json5');
const { splitResource, filterSchemaNames } = require('../lib/utils');
const Platform = require('./base/Platform');

class Local extends Platform {
  constructor(baseDir = 'src') {
    super();
    this.baseDir = path.resolve(__dirname, '..', '..', baseDir);
  }

  setBaseDir(dir) {
    this.baseDir = path.resolve(__dirname, '..', '..', dir);
  }

  _getSchemaPath(schemaName) {
    return path.resolve(this.baseDir, schemaName);
  }

  _getResourcePath(schemaName, resourceName) {
    return path.resolve(this.baseDir, schemaName, path.join(...resourceName.split('/')));
  }

  _isReservedDirectory(dirName) {
    return dirName.startsWith('topic.') || dirName.startsWith('.cubes');
  }

  /**
   * Gets all files in directory recursively
   * @private
   */
  async _getFiles(dir, prefix = '') {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries
        .filter(entry => !(entry.isDirectory() && this._isReservedDirectory(entry.name)) && entry.name !== '.gitkeep')
        .map(async entry => {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            const subFiles = await this._getFiles(fullPath, prefix + entry.name + '/');
            return subFiles;
          }
          return prefix + entry.name;
        })
    );
    return files.flat();
  }

  async getSchemaNames() {
    const entries = await fsp.readdir(this.baseDir, {withFileTypes: true});
    return filterSchemaNames(
      entries
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name)
    );
  }

  async getResources(schemaName) {
    const dirPath = this._getSchemaPath(schemaName);
    try {
      const files = await this._getFiles(dirPath);
      return files;
    } catch (err) {
      if (err.code === 'ENOENT') {
        return [];
      }
      throw err;
    }
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

  async getFiles(schemaName, dirName) {
    const fullPath = path.resolve(this.baseDir, schemaName, dirName);

    try {
      const dirents = await fsp.readdir(fullPath, { withFileTypes: true });
      const files = await Promise.all(
        dirents
          .filter((dirent) => !(dirent.isDirectory() && dirent.name === '.gitkeep'))
          .map((dirent) =>
            dirent.isDirectory()
              ? this.getFiles(schemaName, path.join(dirName, dirent.name))
              : dirent.name
          )
      );
      return Array.prototype.concat(...files);
    } catch (error) {
      if (error.code === 'ENOENT') return [];
      throw error; // Re-throw other errors
    }
  }

  async readFile(filePath) {
    try {
      const fullPath = path.join(this.baseDir, filePath);
      await fsp.stat(fullPath);
      return await fsp.readFile(fullPath);
    } catch (err) {
      return null;
    }
  }

  async writeFile(filePath, content) {
    const fullPath = path.join(this.baseDir, filePath);
    const dir = path.dirname(fullPath);

    try {
      await fsp.stat(dir);
    } catch (err) {
      await fsp.mkdir(dir, { recursive: true });
    }

    await fsp.writeFile(fullPath, content);
  }

  async deleteFile(filePath) {
    const fullPath = path.join(this.baseDir, filePath);
    try {
      await fsp.unlink(fullPath);
    } catch (err) {
      // File doesn't exist, ignore
    }
  }

  async makeDirectory(dirPath) {
    const fullPath = path.join(this.baseDir, dirPath);
    await fsp.mkdir(fullPath, { recursive: true });
  }

  async listFiles(dirPath) {
    const fullPath = path.join(this.baseDir, dirPath);
    const entries = await fsp.readdir(fullPath, { withFileTypes: true });
    return entries.map(entry => ({
      name: entry.name,
      isDirectory: entry.isDirectory(),
    }));
  }
}

module.exports = Local;
