const md5 = require('md5');
const Spinner = require('cli-spinner').Spinner;
const _colors = require('colors');
const { SingleBar } = require('cli-progress');
const Confirm = require('prompt-confirm');
const chalk = require('chalk');
const { retryOnFail } = require('./utils');
const server = require('./server');
const config = require('./config');
const utils = require('./utils');

async function _loginWithSpinner() {
  const {SERVER, USERNAME, PASSWORD} = config.getSUPConfig();
  server.setServer(SERVER);

  // authentication
  const authSpinner = new Spinner('Authentication... %s');
  authSpinner.start();
  try {
    const result = await retryOnFail(() => server.login(USERNAME, PASSWORD));
    authSpinner.stop();
    console.log('SUCCESS\n');
    return result;
  } catch (err) {
    authSpinner.stop();
    console.log(chalk.red('\nERROR:'));
    console.error(chalk.red(err.message));
    throw err;
  }
}

let loginPromise = null;                                                                            // just to run only once
const loginWithSpinner = () => loginPromise || (loginPromise = _loginWithSpinner());


async function pullPushInit(fnCallback) {
  config.getSUPConfigAndLog();

  try {
    await loginWithSpinner();
  } catch (err) {
    return;
  }

  try {
    await fnCallback();                                                                             // run callback

  } catch (err) {
    if (err.isAxiosError) {
      console.log(chalk.redBright('Network error'));
      if (err.response) {
        console.log('    ', err.response.config.method, err.response.config.url);
        console.log('    ', err.response.status, err.response.statusText);
        console.error(err.response.data);
      } else {
        console.error(err.stack);
      }
    } else {
      console.error(err);
    }
  } finally {
    try {
      await server.logout();
    } catch (err2) {
      // ignore
    }
  }
}


/**
 * load full list of resources
 * @param origin - imported from server or local
 * @returns {Promise<[]>}
 */
async function enumResources(origin, type) {
  const list = [];
  const schemaNames = await retryOnFail(() => origin.getSchemaNames());
  for (let schemaName of schemaNames) {
    try {
      let resources = [];
      switch (type) {
        case 'config': resources = await origin.getConfigs(schemaName);
        break;
        default: resources = await origin.getResources(schemaName);
      }
      for (let resource of resources) {
        if (type !== 'config') list.push(`/${schemaName}/${encodeURIComponent(resource)}`);
        else list.push(`/${schemaName}/${resource}`);
      }
    } catch (err) {
      if (err.isAxiosError) {
        console.log(chalk.red('Error: ' + JSON.stringify(err.response ? err.response.data : null)));
      }
      throw err;
    }
  }
  if (type !== 'config') list.sort();
  return list;
}

async function synchronize(fromModule, toModule) {
  const resSpinner = new Spinner('Loading resources list... %s');
  resSpinner.start();

  let fromResources, toResources;

  try {
    fromResources = await retryOnFail(() => enumResources(fromModule));
    toResources = await retryOnFail(() => enumResources(toModule));
  } finally {
    resSpinner.stop();
  }
  console.log(` SUCCESS: ${fromResources.length} resources`);

  //
  // collect new, modified and removed resources
  //
  let createItems = [];
  let overwriteItems = [];
  let removeItems = [];

  const bar1 = new SingleBar({
    format: 'Loading resources content... |' + _colors.cyan('{bar}') + '| {percentage}% || {value}/{total}',
  });
  bar1.start(fromResources.length, 0);

  for (let resource of fromResources) {
    let fromContent = await retryOnFail(() => fromModule.getResourceContent(resource));

    if (toResources.includes(resource)) {                                                           // may be overwrite
      let toContent = await retryOnFail(() => toModule.getResourceContent(resource));
      if (md5(fromContent) !== md5(toContent)) {                                                    // check if content changed
        overwriteItems.push({resource, content: fromContent});
      }
    } else {                                                                                        // has new resource
      createItems.push({resource, content: fromContent})
    }

    bar1.increment();
  }

  if (!config.getNoRemove()) {
    for (let resource of toResources) {
      if (!fromResources.includes(resource)) {                                                      // extra resources should be removed
        removeItems.push({resource});
      }
    }
  }

  bar1.stop();

  if (createItems.length === 0 && overwriteItems.length === 0 && removeItems.length === 0) {
    console.log(chalk.green('No changes'));
    return;
  }

  if (createItems.length) {
    console.log('NEW RESOURCES:');
    createItems.forEach(item => console.log('    ', chalk.green(decodeURIComponent(item.resource))));
  }
  if (overwriteItems.length) {
    console.log('OVERWRITE:');
    overwriteItems.forEach(item => console.log('    ', chalk.yellow(decodeURIComponent(item.resource))));
  }
  if (removeItems.length) {
    console.log('REMOVE:');
    removeItems.forEach(item => console.log('    ', chalk.red(decodeURIComponent(item.resource))));
  }

  if (!config.getForce()) {
    const prompt = new Confirm('Continue?');
    if (!(await prompt.run())) {
      return;
    }
  }

  const bar2 = new SingleBar({
    format: 'Synchronizing resource... |' + _colors.cyan('{bar}') + '| {percentage}% || {value}/{total} Resources',
  });
  bar2.start(createItems.length + overwriteItems.length + removeItems.length, 0);

  try {
    for (let item of createItems) {
      await toModule.createResourceContent(item.resource, item.content);
      bar2.increment();
    }
    for (let item of overwriteItems) {
      await toModule.saveResourceContent(item.resource, item.content);
      bar2.increment();
    }
    for (let item of removeItems) {
      await toModule.removeResourceContent(item.resource);
      bar2.increment();
    }
  } finally {
    bar2.stop();
  }
}

async function synchronizeII(fromModule, toModule) {
  const resSpinner = new Spinner('Loading resources list... %s');
  resSpinner.start();

  let fromResources, toResources, fromConfigs, toConfigs;

  try {
    fromResources = await retryOnFail(() => enumResources(fromModule, undefined));
    toResources = await retryOnFail(() => enumResources(toModule, undefined));
    fromConfigs = await retryOnFail(() => enumResources(fromModule, 'config'));
    toConfigs = await retryOnFail(() => enumResources(toModule, 'config'));
  } finally {
    resSpinner.stop();
  }
  console.log(` SUCCESS: ${fromResources.length} resources`);

  //
  // collect new, modified and removed resources
  //
  let createItems = [];
  let overwriteItems = [];
  let removeItems = [];

  let createConfigItems = [];
  let overwriteConfigItems = [];
  let removeConfigItems = [];

  const bar1 = new SingleBar({
    format: 'Loading resources content... |' + _colors.cyan('{bar}') + '| {percentage}% || {value}/{total}',
  });
  bar1.start(fromResources.length, 0);

  for (let resource of fromResources) {
    let fromContent = await retryOnFail(() => fromModule.getResourceContent(resource));

    if (toResources.includes(resource)) {                                                           // may be overwrite
      let toContent = await retryOnFail(() => toModule.getResourceContent(resource));
      if (md5(fromContent) !== md5(toContent)) {                                                    // check if content changed
        overwriteItems.push({resource, content: fromContent});
      }
    } else {                                                                                        // has new resource
      createItems.push({resource, content: fromContent})
    }

    bar1.increment();
  }

  if (config.mustSaveDashboardConfigToDisk()) {
    for (let config of fromConfigs) {
      let fromContent = await retryOnFail(() => fromModule.getConfigContent(config));

      if (toConfigs.includes(config)) {                                                               // may be overwrite
        let toContent = await retryOnFail(() => toModule.getConfigContent(config));
        if (!utils.compareObjests(fromContent, toContent)) {                                             // check if config changed
          overwriteConfigItems.push({config, content: fromContent});
        }
      } else {                                                                                        // has new config
        createConfigItems.push({config, content: fromContent})
      }
    }
    // if (createConfigItems.length) createConfigItems.length = 1;
    if (!config.getNoRemove()) {
      for (let config of toConfigs) {
        if (!fromConfigs.includes(config)) {
          removeConfigItems.push({config});
        }
      }
    }
  }

  if (!config.getNoRemove()) {
    for (let resource of toResources) {
      if (!fromResources.includes(resource)) {                                                      // extra resources should be removed
        removeItems.push({resource});
      }
    }
    // пропускаем скомпилированные файлы tsx и jsx
    if (removeItems.length) {
      const filteredArr = fromResources.filter((item) => utils.getExtension(item) === 'map');
      let tempArr = [];
      filteredArr.forEach((elem) => tempArr = tempArr.concat(utils.makePathTsxJsx(elem)));
      removeItems = removeItems.filter((item) => !tempArr.includes(item.resource));
    }
  }

  bar1.stop();

  if (createItems.length === 0 && overwriteItems.length === 0 && removeItems.length === 0 &&
    createConfigItems.length === 0 && overwriteConfigItems.length === 0 && removeConfigItems.length === 0) {
    console.log(chalk.green('No changes'));
    return;
  }

  if (createItems.length || createConfigItems.length) {
    console.log('NEW RESOURCES:');
    createItems.forEach(item => console.log('    ', chalk.green(decodeURIComponent(item.resource))));
    createConfigItems.forEach(item => console.log('    ', chalk.green(decodeURIComponent(item.config))));
  }
  if (overwriteItems.length || overwriteConfigItems.length) {
    console.log('OVERWRITE:');
    overwriteItems.forEach(item => console.log('    ', chalk.yellow(decodeURIComponent(item.resource))));
    overwriteConfigItems.forEach(item => console.log('    ', chalk.yellow(decodeURIComponent(item.config))));
  }
  if (removeItems.length || removeConfigItems.length) {
    console.log('REMOVE:');
    removeItems.forEach(item => console.log('    ', chalk.red(decodeURIComponent(item.resource))));
    removeConfigItems.forEach(item => console.log('    ', chalk.red(decodeURIComponent(item.config))));
  }

  if (!config.getForce()) {
    const prompt = new Confirm('Continue?');
    if (!(await prompt.run())) {
      return;
    }
  }

  const bar2 = new SingleBar({
    format: 'Synchronizing resource... |' + _colors.cyan('{bar}') + '| {percentage}% || {value}/{total} Resources',
  });
  bar2.start(createItems.length + overwriteItems.length + removeItems.length, 0);

  try {
    for (let item of createItems) {
      await toModule.createResourceContent(item.resource, item.content);
      bar2.increment();
    }
    for (let item of overwriteItems) {
      await toModule.saveResourceContent(item.resource, item.content);
      bar2.increment();
    }
    for (let item of removeItems) {
      await toModule.removeResourceContent(item.resource);
      bar2.increment();
    }
    for (let item of createConfigItems) {
      const newEntity = await toModule.createJSONContent(item.config, item.content);
      if (newEntity) {
        // так давайте не ругаться матом
        item.content = newEntity;
        await fromModule.createJSONContent(item.config, item.content);
      }
      bar2.increment();
    }
    for (let item of overwriteConfigItems) {
      await toModule.saveJSONContent(item.config, item.content);
      bar2.increment();
    }
    for (let item of removeConfigItems) {
      await toModule.removeJSONContent(item.config, item.content);
      bar2.increment();
    }
  } finally {
    bar2.stop();
  }
}

async function createEntity (local, server, type, schema_name, topicId, dashboard_id, content) {
  if (!schema_name) {
    console.error('You have not typed schema_name');
    return;
  }

  const topicsId = await local.getTopicsId(schema_name);
  let res;
  switch (type) {
    case 'topic': {
      const id = await server.getId({schemaName: schema_name});
      res = await local.createTopic({schemaName: schema_name, id, content});
      console.log(chalk.green(`\nThe topic has been created with id=${id}`));
      return res;
    }
      break;
    case 'dashboard': {
      if (!topicId) topicId = topicsId[0];
      const id = await server.getId({schemaName: schema_name, topicId});
      res = await local.createDashboard({schemaName: schema_name, topicId, id, content});
      console.log(chalk.green(`\nThe dashboard has been created with id=${id}`));
      return res;
    }
      break;
    default: {
      if (!topicId) topicId = topicsId[0];
      if (!dashboard_id) dashboard_id = await server.getId({schemaName: schema_name, topicId});
      const id = await server.getId({schemaName: schema_name, topicId, dashboardId: dashboard_id});
      res = await local.createDashlet({schemaName: schema_name, topicId, dashboardId: dashboard_id, id, content});
      console.log(chalk.green(`\nThe dashlet has been created with id=${id}`));
      return res;
    }
  }
}

module.exports = {
  loginWithSpinner,
  pullPushInit,
  synchronize,
  synchronizeII,
  createEntity
};
