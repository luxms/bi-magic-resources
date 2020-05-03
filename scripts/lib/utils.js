const md5 = require('md5');
const Spinner = require('cli-spinner').Spinner;
const { SingleBar } = require('cli-progress');
const _colors = require('colors');
const chalk = require('chalk');
const Confirm = require('prompt-confirm');


async function enumResources(origin) {
  const list = [];
  const schemaNames = await origin.getSchemaNames();
  for (let schemaName of schemaNames) {
    const resources = await origin.getResources(schemaName);
    for (let resource of resources) {
      list.push(`/${schemaName}/${encodeURIComponent(resource)}`);
    }
  }
  list.sort();
  return list;
}

async function synchronize(fromModule, toModule) {
  const resSpinner = new Spinner('Loading resources list... %s');
  resSpinner.start();

  let fromResources, toResources;

  try {
    fromResources = await enumResources(fromModule);
    toResources = await enumResources(toModule);
  } finally {
    resSpinner.stop();
  }
  console.log(` SUCCESS: ${fromResources.length} resources`);

  //
  // collect new, modified and removed resources

  let createItems = [];
  let overwriteItems = [];
  let removeItems = [];

  const bar1 = new SingleBar({
    format: 'Loading resources content... |' + _colors.cyan('{bar}') + '| {percentage}% || {value}/{total} Resources',
  });
  bar1.start(fromResources.length, 0);

  for (let resource of fromResources) {
    let fromContent = await fromModule.getResourceContent(resource);

    if (toResources.includes(resource)) {                                     // may be overwrite
      let toContent = await toModule.getResourceContent(resource);
      if (md5(fromContent) !== md5(toContent)) {
        overwriteItems.push({resource, content: fromContent});
      }
    } else {
      createItems.push({resource, content: fromContent})
    }

    bar1.increment();
  }

  bar1.stop();

  for (let resource of toResources) {
    if (!fromResources.includes(resource)) {
      removeItems.push({resource});
    }
  }

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
  if (removeItems) {
    console.log('REMOVE:');
    removeItems.forEach(item => console.log('    ', chalk.red(decodeURIComponent(item.resource))));
  }

  const prompt = new Confirm('Continue?');
  if (!(await prompt.run())) {
    return;
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


  // const schemaNames = await server.getSchemaNames();
  // for (let schemaName of schemaNames) {
  //   const resources = await server.getResources(schemaName);
  //   for (let resource of resources) {
  //     const {alt_id} = resource;
  //     const content = await server.getResource(schemaName, alt_id);
  //     local.saveResourceContent(schemaName, alt_id, content);
  //     console.log(`Created file src/${schemaName}/${alt_id}`);
  //   }
  // }

}

module.exports = {
  enumResources,
  synchronize,
}
