const axios = require('axios').default;
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');
const mime = require('mime-types');
const { splitResource, filterSchemaNames } = require('./utils');

axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();
const treeFF = {}; // a virtual tree of folders and files on the disk

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
  return result.data;
}

async function logout() {
  const url = `${SERVER}/api/auth/logout`;
  await axios.get(url, {
    jar: cookieJar,
    withCredentials: true,
  });
}

async function getResourceId(resource) {
  const [schema_name, alt_id] = splitResource(resource);
  const metaUrl = `${SERVER}/api/db/${schema_name}.resources/.filter(alt_id='${encodeURIComponent(alt_id)}')`;
  const response = await axios.get(metaUrl, {
    jar: cookieJar,
    withCredentials: true,
  });
  if (!response.data.length) {
    throw new Error(`Not found resource in ${schema_name} with alt_id=${alt_id} (${metaUrl})`);
  }
  const id = response.data[0].id;
  return id;
}

async function getResourceName(resource) {
  const [schemaName, resourceId] = splitResource(resource);
  let resourceName;
  if (resourceId.match(/^\d+$/)) {
    const metaUrl = `${SERVER}/api/db/${schemaName}.resources/${resourceId}`;
    resourceName = (await axios.get(metaUrl, {
      jar: cookieJar,
      withCredentials: true,
    })).data[0].alt_id;                                                                                 // TODO: handle not found
  } else {
    resourceName = resourceId;
  }
  return resourceName;
}

async function getSchemaNames() {
  const url = `${SERVER}/api/db/adm.datasets`;
  try {
    const response = await axios.get(url, {
      jar: cookieJar,
      withCredentials: true,
    });
    const data = response.data;
    return filterSchemaNames(data.map(item => item.schema_name));
  } catch (err) {
    console.warn(`Failed request ${url}`, err.message);
    throw err;
  }
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
  const [schema_name, alt_id] = splitResource(resource);
  const id = await getResourceId(resource);

  const url = `${SERVER}/srv/resources/${schema_name}/${id}`;
  const response = await axios({
    method: 'put',
    url: url,
    jar: cookieJar,
    withCredentials: true,
    data: content,
    headers: {
      // Server issue with application/json content
      'Content-Type': (mime.lookup(alt_id) || 'application/octet-stream').replace('application/json', 'text/plain'),
    },
  });

  if (response.statusText === 'OK' && mime.lookup(alt_id).includes('application/json')) {
    const url = `${SERVER}/api/db/${schema_name}.resources/${id}`;
    const r = await axios({
      method: 'put',
      url: url,
      jar: cookieJar,
      withCredentials: true,
      data: {"content_type": "application/json"},
    });
  }
}

/**
 *
 * @param {string} resource
 * @param {ArrayBuffer} content
 * @returns {Promise<void>}
 */
async function createResourceContent(resource, content) {
  const [schema_name, alt_id] = splitResource(resource);
  const createMetaUrl = `${SERVER}/api/db/${schema_name}.resources/`;

  const createMetaResponse = await axios({
    method: 'post',
    url: createMetaUrl,
    jar: cookieJar,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      alt_id: alt_id,
      // Server issue with application/json content
      content_type: (mime.lookup(alt_id) || 'application/octet-stream').replace('application/json', 'text/plain'),
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

function getCookies() {
  return cookieJar.getCookiesSync(SERVER).join('; ');
}

async function getConfigs(schemaName) {
  let result = [];
  const promises = [];

  promises.push(axios({
    method: 'get',
    url: `${SERVER}/api/db/${schemaName}.dashboard_topics`,
    jar: cookieJar,
    withCredentials: true,
  }));
  promises.push(axios({
    method: 'get',
    url: `${SERVER}/api/db/${schemaName}.dashboards`,
    jar: cookieJar,
    withCredentials: true,
  }));
  promises.push(axios({
    method: 'get',
    url: `${SERVER}/api/db/${schemaName}.dashlets`,
    jar: cookieJar,
    withCredentials: true,
  }));

  const response = await Promise.all(promises);
  const topics = response[0].data;
  const dashboards = response[1].data;
  const dashlets = response[2].data;
  const snFolders = treeFF[schemaName] = {};
  for (let topic of topics) {
    const topicId = topic.id
    result.push(`topic.${topicId}/index.json`);
    if (topic.hasOwnProperty('id')) delete topic.id;
    if (topic.hasOwnProperty('updated')) delete topic.updated;
    const snf = snFolders[`topic.${topicId}`] = {
      index: topic,
    };
    for (let db of dashboards) {
      if (db.topic_id == topicId) {
        const dashboardId = db.id
        result.push(`topic.${topicId}/dashboard.${dashboardId}/index.json`);
        if (db.hasOwnProperty('id')) delete db.id;
        if (db.hasOwnProperty('updated')) delete db.updated;
        const cd = snf[`dashboard.${dashboardId}`] = {
          index: db,
        };
        dashlets.forEach((d) => {
          if (d.dashboard_id == dashboardId) {
            const dashId = d.id;
            result.push(`topic.${topicId}/dashboard.${dashboardId}/${dashId}.json`);
            if (d.hasOwnProperty('id')) delete d.id;
            if (d.hasOwnProperty('updated')) delete d.updated;
            cd[dashId] = d;
          }
        })
      }
    }
  }
  return result;
}

/**
 *
 * @param config - full id of resource form of '/ds_xxx/%20%20'
 * @returns {Promise<Object>} - resource content
 */
async function getConfigContent(config) {
  const tempArr = config.split('/');
  let r, schemaName, topic, dashboard, dash;
  if (tempArr[0] === '') {
    [r, schemaName, topic, dashboard, dash] = tempArr;
    if (dash) {
      const i = dash.indexOf('.');
      dash = dash.substring(0, i);
    }
  } else {
    console.error('There is an error in getConfigContent')
  }
  if (dash) return treeFF[schemaName][topic][dashboard][dash];
  const i = dashboard.indexOf('.');
  dashboard = dashboard.substring(0, i);
  return treeFF[schemaName][topic][dashboard];
}

/**
 *
 * @param {string} config
 * @param {Object} content
 * @returns {Promise<void>}
 */
async function createJSONContent(config, content) {
  const [schema_name, alt_id] = splitResource(config);
  const tempArr = alt_id.split('/');
  const [topicName, dashboardName, fileName] = tempArr;
  let createMetaUrl;
  let id;
  if (fileName && !fileName.includes('index.json')) {
    id = fileName.substring(0, fileName.indexOf('.'));
    createMetaUrl = `${SERVER}/api/db/${schema_name}.dashlets`;
  } else if (fileName && fileName.includes('index.json')) {
    id = dashboardName.substring(dashboardName.indexOf('.') + 1, dashboardName.length);
    createMetaUrl = `${SERVER}/api/db/${schema_name}.dashboards`;
  } else if (dashboardName.includes('index.json')) {
    id = topicName.substring(topicName.indexOf('.') + 1, topicName.length);
    createMetaUrl = `${SERVER}/api/db/${schema_name}.dashboard_topics`;
  }
  const data = {...content, id: parseInt(id)};

  const response = await axios({
    method: 'post',
    url: createMetaUrl,
    jar: cookieJar,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
    data,
  });
  return response.statusText === 'OK' ? response.data : null;
}

/**
 *
 * @param {string} config
 * @param {Object} content
 * @returns {Promise<void>}
 */
async function saveJSONContent(config, content) {
  const [schema_name, alt_id] = splitResource(config);
  const tempArr = alt_id.split('/');
  const [topicName, dashboardName, fileName] = tempArr;
  let createMetaUrl;
  let id;
  if (fileName && !fileName.includes('index.json')) {
    id = fileName.substring(0, fileName.indexOf('.'));
    createMetaUrl = `${SERVER}/api/db/${schema_name}.dashlets/${id}`;
  } else if (fileName && fileName.includes('index.json')) {
    id = dashboardName.substring(dashboardName.indexOf('.') + 1, dashboardName.length);
    createMetaUrl = `${SERVER}/api/db/${schema_name}.dashboards/${id}`;
  } else if (dashboardName.includes('index.json')) {
    id = topicName.substring(topicName.indexOf('.') + 1, topicName.length);
    createMetaUrl = `${SERVER}/api/db/${schema_name}.dashboard_topics/${id}`;
  }
  const data = {...content, id};

  await axios({
    method: 'put',
    url: createMetaUrl,
    jar: cookieJar,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
    data,
  });
}

/**
 *
 * @param {string} config
 * @returns {Promise<void>}
 */
async function removeJSONContent(config) {
  const [schema_name, alt_id] = splitResource(config);
  const tempArr = alt_id.split('/');
  const [topicName, dashboardName, fileName] = tempArr;
  let createMetaUrl;
  let id;
  if (fileName && !fileName.includes('index.json')) {
    id = fileName.substring(0, fileName.indexOf('.'));
    createMetaUrl = `${SERVER}/api/db/${schema_name}.dashlets/${id}`;
  } else if (fileName && fileName.includes('index.json')) {
    id = dashboardName.substring(dashboardName.indexOf('.') + 1, dashboardName.length);
    createMetaUrl = `${SERVER}/api/db/${schema_name}.dashboards/${id}`;
  } else if (dashboardName.includes('index.json')) {
    id = topicName.substring(topicName.indexOf('.') + 1, topicName.length);
    createMetaUrl = `${SERVER}/api/db/${schema_name}.dashboard_topics/${id}`;
  }

  await axios({
    method: 'delete',
    url: createMetaUrl,
    jar: cookieJar,
    withCredentials: true,
  });
}

async function getId (payload) {
  const {schemaName, topicId, dashboardId} = payload;
  let createMetaUrl = `${SERVER}/api/db/${schemaName}.dashboard_topics?next_id`;
  if (topicId) createMetaUrl = `${SERVER}/api/db/${schemaName}.dashboards?next_id`;
  if (dashboardId) createMetaUrl = `${SERVER}/api/db/${schemaName}.dashlets?next_id`;

  const response = await axios({
    method: 'get',
    url: createMetaUrl,
    jar: cookieJar,
    withCredentials: true,
  });

  return response.statusText === 'OK' && response.data.hasOwnProperty('id') ? response.data.id : null;
}

module.exports = {
  setServer,
  login,
  logout,
  getCookies,
  getSchemaNames,
  getResources,
  getResourceContent,
  saveResourceContent,
  createResourceContent,
  removeResourceContent,
  getConfigs,
  getConfigContent,
  createJSONContent,
  saveJSONContent,
  removeJSONContent,
  getId,
};
