const md5 = require('md5');
const Spinner = require('cli-spinner').Spinner;
const { SingleBar } = require('cli-progress');
const _colors = require('colors');
const chalk = require('chalk');
const Confirm = require('prompt-confirm');
const config = require('./config');

/**
 * extract schemaName and resource name from resource identifier
 * @param {string} resource
 * @returns {[string, string]}
 */
function splitResource(resource) {
  const match = resource.match(/^\/(\w+?)\/(.+)/);
  if (!match) throw new Error('Invalid schema name and resource ' + resource);
  let [schemaName, resourceName] = match.slice(1);
  return [schemaName, decodeURIComponent(resourceName)];
}

/**
 * load full list of resources
 * @param origin - imported from server or local
 * @returns {Promise<[]>}
 */
async function enumResources(origin) {
  const list = [];
  const schemaNames = await retryOnFail(() => origin.getSchemaNames());
  for (let schemaName of schemaNames) {
    try {
      const resources = await origin.getResources(schemaName);
      for (let resource of resources) {
        list.push(`/${schemaName}/${encodeURIComponent(resource)}`);
      }
    } catch (err) {
      if (err.isAxiosError) {
        console.log(chalk.red('Error: ' + JSON.stringify(err.response ? err.response.data : null)));
      }
      throw err;
    }
  }
  list.sort();
  return list;
}

async function retryOnFail(fn) {
  let error = null;
  for (let i = 0; i < 5; i++) {
    try {
      let result = await fn();
      return result;
    } catch (err) {
      console.log('retryOnFail: error, retrying... ');
      error = err;
    }
  }
  throw error;
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

  for (let resource of toResources) {
    if (!fromResources.includes(resource)) {                                                        // extra resources should be removed
      removeItems.push({resource});
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


async function loginWithSpinner() {
  const server = require('./server');

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


async function pullPushInit(fnCallback) {
  config.getSUPConfigAndLog()
  const server = require('./server');

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


module.exports = {
  splitResource,
  synchronize,
  loginWithSpinner,
  pullPushInit,
  retryOnFail,
};
