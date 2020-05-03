const axios = require('axios').default;
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');
const mime = require('mime-types');
const { splitResource } = require('./utils');

axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();

let SERVER = '';

function setServer(server) {
  if (server.endsWith('/')) server = server.slice(0, -1);
  SERVER = server;
}

async function login(username, password) {
  const url = `${SERVER}/api/auth/login`;
  const result = await axios({
    method: 'post',
    url: url,
    data: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    jar: cookieJar,
    withCredentials: true,
  });
}

async function logout() {
  const url = `${SERVER}/api/auth/logout`;
  await axios.get(url, {
    jar: cookieJar,
    withCredentials: true,
  });
}

async function getSchemaNames() {
  const url = `${SERVER}/api/db/adm.datasets`;
  try {
    const response = await axios.get(url, {
      jar: cookieJar,
      withCredentials: true,
    });
    const data = response.data;
    return data.map(item => item.schema_name);
  } catch (err) {
    console.warn(`Failed request ${url}`, err);
    throw err;
  }
}

async function getResourceId(resource) {
  const [schemaName, resourceName] = splitResource(resource);
  let resourceId;
  if (resourceName.match(/^\d+$/)) {
    resourceId = +resourceName;
  } else {
    const metaUrl = `${SERVER}/api/db/${schemaName}.resources/.filter(alt_id='${encodeURIComponent(resourceName)}')`;
    resourceId = (await axios.get(metaUrl, {
      jar: cookieJar,
      withCredentials: true,
    })).data[0].id;                                                                                 // TODO: handle not found
  }
  return resourceId;
}

/**
 *
 * @param schemaName
 * @returns {Promise<string[]>} names of resources for dataset
 */
async function getResources(schemaName) {
  const url = `${SERVER}/api/db/${schemaName}.resources`;
  try {
    const response = await axios.get(url, {
      jar: cookieJar,
      withCredentials: true,
    });
    const resources = response.data.map(entry => entry.alt_id);
    return resources;
  } catch (err) {
    // console.warn(`Failed request ${url}`, err);
    throw err;
  }
}

/**
 *
 * @param resource - full id of resource form of '/ds_xxx/%20%20'
 * @returns {Promise<ArrayBuffer>} - resource content
 */
async function getResourceContent(resource) {
  const url = `${SERVER}/srv/resources${resource}`;
  const response = await axios.get(url, {
    jar: cookieJar,
    withCredentials: true,
    responseType: 'arraybuffer',
  });
  return response.data;
}

/**
 *
 * @param {string} resource
 * @param {ArrayBuffer} content
 * @returns {Promise<void>}
 */
async function saveResourceContent(resource, content) {
  const [schemaName, resourceName] = splitResource(resource);
  // let resourceId;
  // if (resourceName.match(/^\d+$/)) {
  //   resourceId = +resourceName;
  // } else {
  //   const metaUrl = `${SERVER}/api/db/${schemaName}.resources/.filter(alt_id='${encodeURIComponent(resourceName)}')`;
  //   resourceId = (await axios.get(metaUrl, {
  //     jar: cookieJar,
  //     withCredentials: true,
  //   })).data[0].id;                                                                                 // TODO: handle not found
  // }

  // const url = `${SERVER}/srv/resources/${schemaName}/${resourceId}`;
  const url = `${SERVER}/srv/resources${resource}`;
  const response = await axios({
    method: 'put',
    url: url,
    jar: cookieJar,
    withCredentials: true,
    data: content,
    headers: {
      'Content-Type': mime.lookup(resourceName) || 'application/octet-stream',
    },
  });
}

/**
 *
 * @param {string} resource
 * @param {ArrayBuffer} content
 * @returns {Promise<void>}
 */
async function createResourceContent(resource, content) {
  const [schemaName, resourceName] = splitResource(resource);
  const createMetaUrl = `${SERVER}/api/db/${schemaName}.resources/`;

  const createMetaResponse = await axios({
    method: 'post',
    url: createMetaUrl,
    jar: cookieJar,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      alt_id: resourceName,
      content_type: mime.lookup(resourceName) || 'application/octet-stream',
    },
  });
  const data = createMetaResponse.data;
  const id = data.id;
  console.log('CREATED resource with id=', id);
  await saveResourceContent(resource, content);
}

/**
 *
 * @param {string} resource
 * @returns {Promise<void>}
 */
async function removeResourceContent(resource) {
  const [schemaName, resourceName] = splitResource(resource);
  const resourceId = await getResourceId(resource);

  const deleteMetaUrl = `${SERVER}/api/db/${schemaName}.resources/${resourceId}`;
  const deleteMetaResponse = await axios({
    method: 'delete',
    url: deleteMetaUrl,
    jar: cookieJar,
    withCredentials: true,
  });
}

module.exports = {
  setServer,
  login,
  logout,
  getSchemaNames,
  getResources,
  getResourceContent,
  saveResourceContent,
  createResourceContent,
  removeResourceContent,
};
