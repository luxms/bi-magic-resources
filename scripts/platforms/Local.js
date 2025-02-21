const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const { filterSchemaNames } = require('../lib/utils');
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
    const entries = await fsp.readdir(this.BASE_DIR, { withFileTypes: true });
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

    try {
      await fsp.access(fullPath);
    } catch (error) {
      return [];
    }

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
        const content = await fsp.readFile(fullPath, 'utf8');
        return JSON.parse(content);
      }

      return await fsp.readFile(fullPath);
    } catch (err) {
      return null;
    }
  }

  async writeFile(filePath, content) {
    try {
      const normalizedPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
      const fullPath = path.join(this.BASE_DIR, normalizedPath);
      const dirPath = path.dirname(fullPath);
      await fsp.mkdir(dirPath, { recursive: true });

      if (normalizedPath.endsWith('.json')) {
        await fsp.writeFile(fullPath, JSON.stringify(content, null, 2), 'utf-8');
      } else {
        await fsp.writeFile(fullPath, content);
      }
    } catch (error) {
      console.error('WriteFile failed:', error);
      throw error;
    }
  }

  async updateFile(filePath, content) {
    this.writeFile(filePath, content);
  }

  async deleteFile(filePath) {
    try {
      const fullPath = path.join(this.BASE_DIR, filePath);
      const fileStats = await fsp.stat(fullPath);

      if (!dirStats.isDirectory()) {
        await fsp.rmdir(fullPath);
      } else if (fileStats.isFile()) {
        await fsp.unlink(fullPath);
      } else {
        throw new Error('Specified path is not a file');        
      }

      const dirPath = path.dirname(fullPath);
      const dirContents = await fsp.readdir(dirPath);

      if (dirContents.length === 0 && dirPath !== this.BASE_DIR) {
        try {
          await fsp.rmdir(dirPath);
          let parentDir = path.dirname(dirPath);
          while (parentDir !== this.BASE_DIR) {
            const parentContents = await fsp.readdir(parentDir);
            if (parentContents.length === 0) {
              await fsp.rmdir(parentDir);
              parentDir = path.dirname(parentDir);
            } else {
              break;
            }
          }
        } catch (error) {
          console.warn('Failed to remove empty directory:', error.message);
        }
      }
    } catch (err) {
      // File doesn't exist, ignore
    }
  }
}

module.exports = Local;
