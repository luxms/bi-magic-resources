const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const { splitResource, filterSchemaNames } = require('./utils');
const JSON5 = require('json5');

const DEFAULT_TOPIC = {
  title: ''
}

const DEFAULT_DASHBOARD = {
  title: '',
  config: {}
}

const DEFAULT_DASHLET = {
  dashboard_id: 0,
  view_class: ''
}

let baseDir = path.resolve(__dirname, '..', '..', 'src');

function setBaseDir(dir) {
  baseDir = path.resolve(__dirname, '..', '..', dir);
}

const getSchemaPath = (schemaName) => path.resolve(baseDir, schemaName);
const getResourcePath = (schemaName, resourceName) => path.resolve(baseDir, schemaName, path.join(...resourceName.split('/')));

function getFiles(dir, prefix = '') {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = dirents
    .filter((dirent) => !(dirent.isDirectory() && dirent.name.includes('topic.')))
    .map((dirent) => {
    return dirent.isDirectory() ? getFiles(path.resolve(dir, dirent.name), prefix + dirent.name + '/') : prefix + dirent.name;
  });
  return Array.prototype.concat(...files);
}

async function getSchemaNames() {
  const entries = await fsp.readdir(baseDir, { withFileTypes: true });
  const dirs = filterSchemaNames(entries.filter(entry => entry.isDirectory()).map(entry => entry.name));
  return dirs;
}

async function getResources(schemaName) {
  const dirPath = getSchemaPath(schemaName);
  const files = getFiles(dirPath);
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
  const [schema_name, alt_id] = splitResource(resource);
  const filePath = alt_id.split('/').slice(0, -1);
  const dir = path.join(getSchemaPath(schema_name), ...filePath);

  try {
    await fsp.stat(dir);
  } catch (err) {
    await fsp.mkdir(dir, { recursive: true });
  }

  await fsp.writeFile(getResourcePath(schema_name, alt_id), content);
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

function getJSONFiles(dir, prefix = '') {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = dirents
    .filter((d) => d.name.includes('.json') || d.isDirectory())
    .map((dirent) => {
      return dirent.isDirectory() ? getJSONFiles(path.resolve(dir, dirent.name), prefix + dirent.name + '/') : prefix + dirent.name;
    });
  return Array.prototype.concat(...files.reverse());
}

function getConfigsFromDisk(dir, prefix = '') {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = dirents
    .filter((d) => d.name.includes('topic.'))
    .map((dirent) => {
      return dirent.isDirectory() ? getJSONFiles(path.resolve(dir, dirent.name), prefix + dirent.name + '/') : prefix + dirent.name;
    });
  return Array.prototype.concat(...files.reverse());
}

async function getConfigs(schemaName) {
  const dirPath = getSchemaPath(schemaName);
  const files = getConfigsFromDisk(dirPath);
  return files;
}

async function getTopicsId(schemaName) {
  const dirPath = getSchemaPath(schemaName);
  const files = getConfigsFromDisk(dirPath);
  const arrIds = files.filter((f) =>  f.includes('topic.')).map((f) => getIdfromStr(f, 'topic.'));
  const result = Array.from(new Set(arrIds)).sort();
  return result;
}

async function getConfigContent(config) {
  const [schemaName, resourceName] = splitResource(config);
  const filePath = getResourcePath(schemaName, resourceName);
  try {
    await fsp.stat(filePath);
  } catch (err) {
    return null;
  }
  const str = (await fsp.readFile(filePath)).toString();
  const content = JSON5.parse(str);
  if (content.hasOwnProperty('id')) delete content.id;
  if (content.hasOwnProperty('updated')) delete content.updated;
  return content;
}

function makeIdfromString(config, type = 'dashboard') {
  const [schema_name, alt_id] = splitResource(config);
  const tempArr = alt_id.split('/');
  const nameFile = tempArr[tempArr.length-1];
  const nameDashboard = tempArr[tempArr.length-2];
  switch (type) {
    case 'dashlet': return parseInt(nameFile.substring(0, nameFile.indexOf('.')));
      break;
    default: return parseInt(nameDashboard.substring(nameDashboard.indexOf('.') + 1, nameDashboard.length))
  }
}

function getIdfromStr (str, search) {
  const tempArr = str.split('/');
  const tempStr = tempArr.find((t) => t.includes(search));
  return parseInt(tempStr.substring(tempStr.indexOf('.') + 1, tempStr.length));
}

async function getDashboards(schemaName) {
  const paths = (await getConfigs(schemaName))
    .filter((c) => (c.includes('index.json') && c.includes('dashboard.')))
    .map((c) => `/${schemaName}/${c}`);
  const promises = [];
  paths.forEach((con) => promises.push(getConfigContent(con)));
  const files = await Promise.all(promises);
  const result = [];
  for (let i = 0; i < paths.length; i++) {
    const id = makeIdfromString(paths[i]);
    result.push({config: paths[i], content: {id, ...files[i]}});
  }
  return result.length ? result : null;
}

async function getDashlets(schemaName) {
  const configs = (await getConfigs(schemaName))
    .filter((c) => !c.includes('index.json'))
    .map((c) => `/${schemaName}/${c}`);
  const promises = [];
  configs.forEach((con) => promises.push(getConfigContent(con)));
  const files = await Promise.all(promises);
  const result = [];
  for (let i = 0; i < configs.length; i++) {
    const id = makeIdfromString(configs[i], 'dashlet');
    result.push({config: configs[i], content: {id, ...files[i]}});
  }
  return result.length ? result : null;
}

/**
 * create file for resource and store content
 * @param {string} config
 * @param {Object} content
 * @returns {Promise<void>}
 */
async function createJSONContent(config, content) {
  return saveJSONContent(config, content);
}

/**
 * create file for resource and store content
 * @param {string} config
 * @param {Object} content
 * @returns {Promise<void>}
 */
async function saveJSONContent(config, content) {
  const [schema_name, alt_id] = splitResource(config);
  const filePath = alt_id.split('/').slice(0, -1);
  const dir = path.join(getSchemaPath(schema_name), ...filePath);
  const data = {...content};
  if (data.hasOwnProperty('id')) delete data.id;

  try {
    await fsp.stat(dir);
  } catch (err) {
    await fsp.mkdir(dir, { recursive: true });
  }

  await fsp.writeFile(getResourcePath(schema_name, alt_id), JSON.stringify(data, null, 2) , 'utf-8');
}

async function removeJSONContent(config) {
  const [schemaName, configId] = splitResource(config);
  const dirPath = getSchemaPath(schemaName);
  const filePath = getResourcePath(schemaName, configId);
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

async function removeFolder(config) {
  const [schemaName, configId] = splitResource(config);
  const filePath = getResourcePath(schemaName, configId);
  const folderPath = path.dirname(filePath);
  try {
    await fsp.stat(folderPath);
  } catch (err) {                                                                                   // no dir or file exists
    return;
  }
  fs.readdir(folderPath, async (err, files) => {
    for (let file of files) {
      await fsp.unlink(folderPath + '/' + file);
    };
    await fsp.rmdir(folderPath);
  });
}

async function createTopic(payload) {
  const {schemaName, id, content} = payload;
  const alt_id = `topic.${id}/index.json`;
  const filePath = alt_id.split('/').slice(0, -1);
  const dir = path.join(getSchemaPath(schemaName), ...filePath);

  try {
    await fsp.stat(dir);
  } catch (err) {
    await fsp.mkdir(dir, {recursive: true});
  }

  if (!fs.existsSync(getResourcePath(schemaName, alt_id))) {
    const jsonBody = {...DEFAULT_TOPIC,...content};
    await fsp.writeFile(getResourcePath(schemaName, alt_id), JSON.stringify(jsonBody, null, 2), 'utf-8');
    return {id, ...jsonBody};
  } else {
    console.log(`The index.json has already exist in the folder /${schemaName}/topic.${id}/`,'\n');
    return null;
  }
}

async function createDashboard(payload) {
  const {schemaName, topicId, id, content} = payload;
  const alt_id = `topic.${topicId}/dashboard.${id}/index.json`;
  const filePath = alt_id.split('/').slice(0, -1);
  const dir = path.join(getSchemaPath(schemaName), ...filePath);

  try {
    await fsp.stat(dir);
  } catch (err) {
    await fsp.mkdir(dir, {recursive: true});
  }

  if (!fs.existsSync(getResourcePath(schemaName, `topic.${topicId}/index.json`)))  {
    await createTopic({schemaName, id: topicId});
  }

  if (!fs.existsSync(getResourcePath(schemaName, alt_id))) {
    const jsonBody = {...DEFAULT_DASHBOARD,...content, topic_id: topicId};
    await fsp.writeFile(getResourcePath(schemaName, alt_id), JSON.stringify(jsonBody, null, 2), 'utf-8');
    return {id, ...jsonBody};
  } else {
    console.log(`The index.json has already exist in the folder /topic.${topicId}/${schemaName}/dashboard.${id}/`,'\n');
    return null;
  }
}

async function createDashlet (payload) {
  const {schemaName, topicId, dashboardId, id, content} = payload;
  const alt_id = `topic.${topicId}/dashboard.${dashboardId}/${id}.json`;
  const filePath = alt_id.split('/').slice(0, -1);
  const dir = path.join(getSchemaPath(schemaName), ...filePath);

  try {
    await fsp.stat(dir);
  } catch (err) {
    await fsp.mkdir(dir, {recursive: true});
  }

  if (!fs.existsSync(getResourcePath(schemaName, `topic.${topicId}/dashboard.${dashboardId}/index.json`))) await createDashboard({schemaName, topicId, id: dashboardId});

  if (!fs.existsSync(getResourcePath(schemaName, alt_id))) {
    const configDash = {...DEFAULT_DASHLET, ...content, dashboard_id: parseInt(dashboardId)};
    await fsp.writeFile(getResourcePath(schemaName, alt_id), JSON.stringify(configDash, null, 2), 'utf-8');
    return {id, ...configDash};
  } else {
    console.log(`The ${id}.json has already exist in the folder /${schemaName}/topic.${topicId}/dashboard.${dashboardId}/`,'\n');
    return null;
  }
}

module.exports = {
  setBaseDir,
  getSchemaNames,
  getResources,
  getResourceContent,
  createResourceContent,
  saveResourceContent,
  removeResourceContent,
  getConfigs,
  getConfigContent,
  createJSONContent,
  saveJSONContent,
  removeJSONContent,
  getDashboards,
  removeFolder,
  getDashlets,
  createDashboard,
  createDashlet,
  createTopic,
  getTopicsId
};
