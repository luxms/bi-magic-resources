const md5 = require('md5');
const chalk = require('chalk');
const colors = require('colors');
const Confirm = require('prompt-confirm');
const Spinner = require('cli-spinner').Spinner;
const {SingleBar} = require('cli-progress');
const {retryOnFail} = require('./utils');
const utils = require('./utils');
const config = require('./config');
const ResourceManager = require('../managers/ResourceManager');
const DashboardManager = require('../managers/DashboardManager');
const CubeManager = require('../managers/CubeManager');

/**
 * Synchronize local and server files
 * @param source
 * @param target
 * @returns {Promise<void>}
 */
async function synchronize(source, target) {
  // Create manager instances
  const sourceResourceManager = new ResourceManager(source);
  const sourceDashboardManager = new DashboardManager(source);
  const sourceCubeManager = new CubeManager(source);
  const targetResourceManager = new ResourceManager(target);
  const targetDashboardManager = new DashboardManager(target);
  const targetCubeManager = new CubeManager(target);

  // Enumerate files
  const spinner = new Spinner('Loading resources list... %s');
  spinner.start();

  let sourceResources = [], targetResources = [],
      sourceDashboards = [], targetDashboards = [],
      sourceCubes = [], targetCubes = [];

  try {
    if (config.hasResources()) {
      sourceResources = await retryOnFail(() => sourceResourceManager.enumerate());
      targetResources = await retryOnFail(() => targetResourceManager.enumerate());
    }

    if (config.hasDashboards()) {
      sourceDashboards = await retryOnFail(() => sourceDashboardManager.enumerate());
      targetDashboards = await retryOnFail(() => targetDashboardManager.enumerate());
    }

    if (config.hasCubes()) {
      sourceCubes = await retryOnFail(() => sourceCubeManager.enumerate());
      targetCubes = await retryOnFail(() => targetCubeManager.enumerate());
    }
  } finally {
    spinner.stop();
  }

  // Success, show source files count
  console.log(`SUCCESS\n`);
  console.log(`${sourceResources.length} resources, ${sourceDashboards.length} dashboards, ${sourceCubes.length} cubes\n`);

  // Load files content
  const bar = new SingleBar({ format: 'Loading files content... |' + colors.cyan('{bar}') + '| {percentage}% || {value}/{total}' });
  bar.start(sourceResources.length + sourceDashboards.length + sourceCubes.length, 0);

  // Compare source and target
  let createItems = [], overwriteItems = [], removeItems = [];

  if (config.hasResources()) {
    for (const resource of sourceResources) {
      const sourceContent = await retryOnFail(() => sourceResourceManager.getContent(resource));

      // Select between create and update
      if (targetResources.includes(resource)) {
        const targetContent = await retryOnFail(() => targetResourceManager.getContent(resource));
        if (md5(sourceContent) !== md5(targetContent)) overwriteItems.push({ type: 'resource', fileName: resource, content: sourceContent });
      } else {
        createItems.push({ type: 'resource', fileName: resource, content: sourceContent })
      }

      bar.increment();
    }

    // Add items to remove
    if (!config.getNoRemove()) {
      for (const resource of targetResources) {
        if (!sourceResources.includes(resource)) removeItems.push({ type: 'resource', fileName: resource });
      }

      // Skip compiled tsx и jsx files
      if (removeItems.length) {
        const filteredArr = sourceResources.filter((item) => utils.getExtension(item) === 'map');
        let tempArr = [];
        filteredArr.forEach((elem) => tempArr = tempArr.concat(utils.makePathTsxJsx(elem)));
        removeItems = removeItems.filter((item) => !tempArr.includes(item.fileName));
      }
    }
  }

  if (config.hasDashboards()) {
    for (const dashboard of sourceDashboards) {
      const sourceContent = await retryOnFail(() => sourceDashboardManager.getContent(dashboard)); // utils.cleanPropertyMembers??

      // Select between create and update
      if (targetDashboards.includes(dashboard)) {
        const targetContent = await retryOnFail(() => targetDashboardManager.getContent(dashboard)); // utils.cleanPropertyMembers??
        if (!utils.compareObjects(sourceContent, targetContent)) overwriteItems.push({ type: 'dashboard', fileName: dashboard, content: sourceContent });
      } else {
        createItems.push({ type: 'dashboard', fileName: dashboard, content: sourceContent })
      }

      bar.increment();
    }

    // Add items to remove
    if (!config.getNoRemove()) {
      for (const dashboard of targetDashboards) {
        if (!sourceDashboards.includes(dashboard)) removeItems.push({ type: 'dashboard', fileName: dashboard });
      }
    }
  }

  if (config.hasCubes()) {
    for (const cube of sourceCubes) {
      const sourceContent = await retryOnFail(() => sourceCubeManager.getContent(cube));

      // Select between create and update
      if (targetCubes.includes(cube)) {
        const targetContent = await retryOnFail(() => targetCubeManager.getContent(cube)); // utils.cleanPropertyMembers??
        if (!utils.compareObjects(sourceContent, targetContent)) overwriteItems.push({ type: 'cube', fileName: cube, content: sourceContent });
      } else {
        createItems.push({ type: 'cube', fileName: cube, content: sourceContent })
      }

      bar.increment();
    }

    // Add items to remove
    if (!config.getNoRemove()) {
      for (const cube of targetCubes) {
        if (!sourceCubes.includes(cube)) removeItems.push({ type: 'cube', fileName: cube });
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
    createItems.forEach(item => console.log('    ', chalk.green(decodeURIComponent(item.fileName))));
  }

  if (overwriteItems.length) {
    console.log('OVERWRITE:');
    overwriteItems.forEach(item => console.log('    ', chalk.yellow(decodeURIComponent(item.fileName))));
  }

  if (removeItems.length) {
    console.log('REMOVE:');
    removeItems.forEach(item => console.log('    ', chalk.red(decodeURIComponent(item.fileName))));
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
      if (item.type === 'resource') await targetResourceManager.createContent(item.fileName, item.content);
      if (item.type === 'dashboard') await targetDashboardManager.createContent(item.fileName, item.content);
      if (item.type === 'cube') await targetCubeManagerr.createContent(item.fileName, item.content);
      finalBar.increment();
    }

    for (let item of overwriteItems) {
      if (item.type === 'resource') await targetResourceManager.updateContent(item.fileName, item.content);
      if (item.type === 'dashboard') await targetDashboardManager.updateContent(item.fileName, item.content);
      if (item.type === 'cube') await targetCubeManager.updateContent(item.fileName, item.content);
      finalBar.increment();
    }

    for (let item of removeItems) {
      if (item.type === 'resource') await targetResourceManager.deleteContent(item.fileName);
      if (item.type === 'dashboard') await targetDashboardManager.deleteContent(item.fileName);
      if (item.type === 'cube') await targetCubeManager.deleteContent(item.fileName);
      finalBar.increment();
    }
  } finally {
    finalBar.stop();
  }
}

module.exports = synchronize;
