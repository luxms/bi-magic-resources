const fs = require('fs').promises;
const path = require('path');
const Local = require('./Local');
const { decodePath } = require('../lib/utils');
const { isConfigPath, toLogicalPath, parseConfig, stringifyConfig, canonicalJson } = require('../lib/config-codec');

// Managers keep using server-shaped *.json paths; only this adapter knows source extensions.
class SourceLocal extends Local {
  _getFullPath(filePath) {
    const relative = decodePath(filePath).replace(/\\/g, '/').replace(/^\/+/, '');
    if (relative.split('/').includes('..')) throw new Error(`Invalid source path: ${filePath}`);
    const fullPath = path.resolve(this.BASE_DIR, relative);
    if (fullPath !== this.BASE_DIR && !fullPath.startsWith(this.BASE_DIR + path.sep)) {
      throw new Error(`Invalid source path: ${filePath}`);
    }
    return fullPath;
  }

  async _assertNoSymlink(fullPath) {
    let current = this.BASE_DIR;
    try {
      if ((await fs.lstat(current)).isSymbolicLink()) throw new Error(`Symlinks are not supported in source trees: ${current}`);
    } catch (error) { if (error.code === 'ENOENT') return; throw error; }
    for (const segment of path.relative(this.BASE_DIR, fullPath).split(path.sep).filter(Boolean)) {
      current = path.join(current, segment);
      try {
        if ((await fs.lstat(current)).isSymbolicLink()) {
          throw new Error(`Symlinks are not supported in source trees: ${current}`);
        }
      } catch (error) { if (error.code === 'ENOENT') return; throw error; }
    }
  }

  async _resolve(filePath) {
    const fullPath = this._getFullPath(toLogicalPath(filePath));
    await this._assertNoSymlink(fullPath);
    const directory = path.dirname(fullPath);
    let names;
    try { names = await fs.readdir(directory); }
    catch (error) { if (error.code !== 'ENOENT') throw error; names = []; }
    const candidates = isConfigPath(path.relative(this.BASE_DIR, fullPath))
      ? names.filter(name => toLogicalPath(path.relative(this.BASE_DIR, path.join(directory, name))) === path.relative(this.BASE_DIR, fullPath).split(path.sep).join('/')).map(name => path.join(directory, name))
      : names.includes(path.basename(fullPath)) ? [fullPath] : [];
    const existing = [];
    for (const candidate of candidates) {
      const stat = await fs.lstat(candidate);
      if (!stat.isFile()) throw new Error(`Source is not a regular file: ${candidate}`);
      existing.push(candidate);
    }
    if (existing.length > 1) throw new Error(`Multiple sources for ${filePath}: ${existing.join(', ')}`);
    if (existing.length) return existing[0];
    if (isConfigPath(filePath)) {
      return /\.(json5|ya?ml)$/i.test(filePath)
        ? this._getFullPath(filePath) : fullPath;
    }
    return fullPath;
  }

  async getFiles(...segments) {
    const root = this._getFullPath(segments.join('/'));
    await this._assertNoSymlink(root);
    const logicalFiles = new Map();
    const visit = async (directory, prefix = '') => {
      let entries;
      try { entries = await fs.readdir(directory, { withFileTypes: true }); }
      catch (error) { if (error.code === 'ENOENT') return; throw error; }
      for (const entry of entries) {
        if (entry.name === '.gitkeep' || entry.name === '.bi-build.json' || entry.name === '_sources.json') continue;
        const relative = prefix + entry.name;
        if (entry.isSymbolicLink()) throw new Error(`Symlinks are not supported in source trees: ${relative}`);
        if (entry.isDirectory()) { await visit(path.join(directory, entry.name), relative + '/'); continue; }
        const logical = toLogicalPath(path.relative(this.BASE_DIR, path.join(root, relative))).slice(path.relative(this.BASE_DIR, root).length + (root === this.BASE_DIR ? 0 : 1));
        if (logicalFiles.has(logical)) throw new Error(`Multiple sources for ${logical}: ${logicalFiles.get(logical)}, ${relative}`);
        logicalFiles.set(logical, relative);
      }
    };
    await visit(root);
    return [...logicalFiles.keys()];
  }

  async readFile(filePath) {
    const physicalPath = await this._resolve(filePath);
    let content;
    try { content = await fs.readFile(physicalPath); }
    catch (error) { if (error.code === 'ENOENT') return null; throw error; }
    return isConfigPath(path.relative(this.BASE_DIR, physicalPath)) ? parseConfig(content, physicalPath) : content;
  }

  async writeFile(filePath, content) {
    const physicalPath = await this._resolve(filePath);
    if (isConfigPath(path.relative(this.BASE_DIR, physicalPath))) {
      // No-op API writes preserve comments and the author's formatting exactly.
      try {
        const old = parseConfig(await fs.readFile(physicalPath, 'utf8'), physicalPath);
        if (canonicalJson(old) === canonicalJson(content)) return;
      } catch (error) { if (error.code !== 'ENOENT') throw error; }
      content = stringifyConfig(content, physicalPath);
    }
    await fs.mkdir(path.dirname(physicalPath), { recursive: true });
    await fs.writeFile(physicalPath, content ?? '');
  }

  async deleteFile(filePath) {
    const physicalPath = await this._resolve(filePath);
    return super.deleteFile('/' + path.relative(this.BASE_DIR, physicalPath).split(path.sep).map(encodeURIComponent).join('/'));
  }

  async checkFileExists(filePath) {
    const physicalPath = await this._resolve(filePath);
    try { await fs.access(physicalPath); return true; }
    catch (error) { if (error.code === 'ENOENT') return false; throw error; }
  }
}

module.exports = SourceLocal;
