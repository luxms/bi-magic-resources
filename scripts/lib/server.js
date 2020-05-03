const axios = require('axios').default;
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');

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
    console.warn(`Failed request ${url}`, err);
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

module.exports = {
  setServer,
  login,
  logout,
  getSchemaNames,
  getResources,
  getResourceContent,
};
