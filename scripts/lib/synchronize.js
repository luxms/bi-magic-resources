const md5 = require('md5');
const chalk = require('chalk');
const colors = require('colors');
const Confirm = require('prompt-confirm');
const Spinner = require('cli-spinner').Spinner;
const {SingleBar} = require('cli-progress');
const {retryOnFail} = require('./utils');
const utils = require('./utils');
const config = require('./config');

const contentTypes = ['resources', 'dashboards', 'cubes'];

/**
 * Synchronize local and server files
 * @param source
 * @param target
 * @returns {Promise<void>}
 */
async function synchronize(source, target) {
  // Enumerate files
  const spinner = new Spinner('Loading resources list... %s');
  spinner.start();

  let sourceItems = {}, targetItems = {};

  try {
    for (const contentType of contentTypes) {
      if (config.hasOption(contentType)) {
        sourceItems[contentType] = await retryOnFail(() => source[contentType].enumerate());
        targetItems[contentType] = await retryOnFail(() => target[contentType].enumerate());
      } else {
        sourceItems[contentType] = [];
        targetItems[contentType] = [];
      }
    }
  } finally {
    spinner.stop();
  }

  // Success, show source files count
  console.log(`SUCCESS\n`);
  console.log(`${sourceItems.resources.length} resources, ${sourceItems.dashboards.length} dashboards, ${sourceItems.cubes.length} cubes`);

  // Load files content
  const bar = new SingleBar({ format: 'Loading files content... |' + colors.cyan('{bar}') + '| {percentage}% || {value}/{total}' });
  bar.start(sourceItems.resources.length + sourceItems.dashboards.length + sourceItems.cubes.length, 0);

  // Compare source and target
  let createItems = [], overwriteItems = [], removeItems = [];

  for (const contentType of contentTypes) {
    if (config.hasOption(contentType)) {
      for (const item of sourceItems[contentType]) {
        const sourceContent = await retryOnFail(() => source[contentType].getContent(item));

        if (targetItems[contentType].includes(item)) {
          const targetContent = await retryOnFail(() => target[contentType].getContent(item));
          const contentsMatch = item.endsWith('.json') ? utils.compareObjects(sourceContent, targetContent) : md5(String(sourceContent)) === md5(String(targetContent));
          if (!contentsMatch) overwriteItems.push({ type: contentType, path: item, content: sourceContent });
        } else {
          createItems.push({ type: contentType, path: item, content: sourceContent })
        }

        bar.increment();
      }

      if (!config.hasNoRemove()) {
        for (const item of targetItems[contentType]) {
          if (!sourceItems[contentType].includes(item)) removeItems.push({ type: contentType, path: item });
        }

        // Skip compiled tsx и jsx files
        if (removeItems.length) {
          const filteredArr = sourceItems[contentType].filter((item) => utils.getExtension(item) === 'map');
          let tempArr = [];
          filteredArr.forEach((elem) => tempArr = tempArr.concat(utils.makePathTsxJsx(elem)));
          removeItems = removeItems.filter((item) => !tempArr.includes(item.path));
        }
      }
    }
  }

  bar.stop();

  // No changes, skip
  if (createItems.length === 0 && overwriteItems.length === 0 && removeItems.length === 0) {
    console.log(chalk.green('No changes'));
    return;
  }

  // Success, enumerate files to change
  if (createItems.length) {
    console.log('CREATE:');
    createItems.forEach(item => console.log('    ', chalk.green(decodeURIComponent(item.path))));
  }

  if (overwriteItems.length) {
    console.log('OVERWRITE:');
    overwriteItems.forEach(item => console.log('    ', chalk.yellow(decodeURIComponent(item.path))));
  }

  if (removeItems.length) {
    console.log('REMOVE:');
    removeItems.forEach(item => console.log('    ', chalk.red(decodeURIComponent(item.path))));
  }

  // Confirm changes
  if (!config.getForce()) {
    const prompt = new Confirm('Continue?');
    if (!(await prompt.run())) return;
  }

  // Start changes
  const finalBar = new SingleBar({ format: 'Synchronizing... |' + colors.cyan('{bar}') + '| {percentage}% || {value}/{total} Resources' });
  finalBar.start(createItems.length + overwriteItems.length + removeItems.length, 0);

  try {
    for (const item of createItems) {
      const newEntity = await target[item.type].createContent(item.path, item.content);
      if (newEntity) await fromModule.createContent(item.path, newEntity);
      finalBar.increment();
    }

    for (const item of overwriteItems) {
      await target[item.type].updateContent(item.path, item.content);
      finalBar.increment();
    }
  
    for (const item of removeItems) {
      await target[item.type].deleteContent(item.path);
      finalBar.increment();
    }
  } finally {
    finalBar.stop();
  }
}

module.exports = synchronize;
