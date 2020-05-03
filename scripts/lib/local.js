const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const { splitResource } = require('./utils');

const baseDir = path.resolve(__dirname, '..', '..', 'src');
const getSchemaPath = (schemaName) => path.resolve(baseDir, schemaName);
const getResourcePath = (schemaName, resourceName) => path.resolve(baseDir, schemaName, resourceName);

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

async function getResourceContent(resource) {
  const [schemaName, resourceName] = splitResource(resource);
  const filePath = getResourcePath(schemaName, resourceName);
  try {
    await fsp.stat(filePath);
  } catch (err) {
    return null;
  }
  const content = await fsp.readFile(filePath);
  return content;
}

/**
 * Save resource content to file
 * @param {string} resource
 * @param {ArrayBuffer} content
 * @returns {Promise<void>}
 */
async function saveResourceContent(resource, content) {
  const [schemaName, resourceName] = splitResource(resource);
  const dirPath = getSchemaPath(schemaName);
  try {
    await fsp.stat(dirPath);
  } catch (err) {
    await fsp.mkdir(dirPath);
  }
  const filePath = getResourcePath(schemaName, resourceName);
  await fsp.writeFile(filePath, content);
}


/**
 * create file for resource and store content
 * @param {string} resource
 * @param {ArrayBuffer} content
 * @returns {Promise<void>}
 */
async function createResourceContent(resource, content) {
  return saveResourceContent(resource, content);
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
