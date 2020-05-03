const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

const baseDir = path.resolve(__dirname, '..', '..', 'src');
const getSchemaPath = (schemaName) => path.resolve(baseDir, schemaName);
const getResourcePath = (schemaName, resourceId) => path.resolve(baseDir, schemaName, resourceId);

async function getSchemaNames() {
  const entries = await fsp.readdir(baseDir, { withFileTypes: true });
  const dirs = entries.filter(entry => entry.isDirectory()).map(entry => entry.name);
  return dirs;
}

async function getResources(schemaName) {
  const dirPath = getSchemaPath(schemaName);
  try {
    await fsp.stat(dirPath);
  } catch (err) {
    return [];
  }
  const entries = await fsp.readdir(dirPath, { withFileTypes: true });
  const files = entries.filter(entry => entry.isFile()).map(entry => entry.name);
  return files;
}

function splitResource(resource) {
  const match = resource.match(/^\/(\w+?)\/(.+)/);
  if (!match) throw new Error('Invalid schema name and resource ' + resource);
  let [schemaName, resourceId] = match.slice(1);
  resourceId = decodeURIComponent(resourceId);
  return [schemaName, resourceId];
}

async function getResourceContent(resource) {
  const [schemaName, resourceId] = splitResource(resource);
  const filePath = getResourcePath(schemaName, resourceId);
  try {
    await fsp.stat(filePath);
  } catch (err) {
    return null;
  }
  const content = await fsp.readFile(filePath);
  return content;
}

async function createResourceContent(resource, content) {
  const [schemaName, resourceId] = splitResource(resource);
  const dirPath = getSchemaPath(schemaName);
  try {
    await fsp.stat(dirPath);
  } catch (err) {
    await fsp.mkdir(dirPath);
  }
  const filePath = getResourcePath(schemaName, resourceId);
  await fsp.writeFile(filePath, content, 'utf8');
}

async function saveResourceContent(resource, content) {
  return createResourceContent(resource, content);
}

async function removeResourceContent(resource) {
  const [schemaName, resourceId] = splitResource(resource);
  const dirPath = getSchemaPath(schemaName);
  const filePath = getResourcePath(schemaName, resourceId);
  try {
    await fsp.stat(dirPath);
    await fsp.stat(filePath);
  } catch (err) {                                                                                   // no dir or file exists
    return;
  }
  await fsp.unlink(filePath);
  const filesLeft = await fsp.readdir(dirPath, { withFileTypes: true });
  if (filesLeft.length === 0) {
    await fsp.rmdir(dirPath);
  }
}

module.exports = {
  getSchemaNames,
  getResources,
  getResourceContent,
  createResourceContent,
  saveResourceContent,
  removeResourceContent,
};
