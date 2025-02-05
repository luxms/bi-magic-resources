const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const JSON5 = require('json5');
const { splitResource, filterSchemaNames } = require('../lib/utils');
const Platform = require('./base/Platform');

/**
 * - RefinedAbstraction (bridge pattern)
 */
class Local extends Platform {
  constructor(baseDirectory = path.resolve(__dirname, '..', '..', 'src')) {
    super();
    this.baseDir = baseDirectory;
  }

  setBaseDir(dir) {
    this.baseDir = path.resolve(__dirname, '..', '..', dir);
  }

  async getSchemaNames() {
    const entries = await fsp.readdir(this.baseDir, { withFileTypes: true });
    return filterSchemaNames(entries.filter(entry => entry.isDirectory()).map(entry => entry.name));
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
