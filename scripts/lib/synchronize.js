const md5 = require('md5');
const chalk = require('chalk');
const colors = require('colors');
const Confirm = require('prompt-confirm');
const Spinner = require('cli-spinner').Spinner;
const { SingleBar } = require('cli-progress');
const { retryOnFail } = require('./utils');
const utils = require('./utils');
const config = require('./config');
const ResourceManager = require('../managers/ResourceManager');
const DashletManager = require('../managers/DashletManager');
const CubeManager = require('../managers/CubeManager');


/**
 * Синхронизирует файлы на сервере и на диске
 * @param source
 * @param target
 * @returns {Promise<void>}
 */
async function synchronize(source, target) {
  // source managers
  const sourceResourceManager = new ResourceManager(source);
  const sourceDashletManager = new DashletManager(source);
  const sourceCubeManager = new CubeManager(source);

  // target managers
  const targetResourceManager = new ResourceManager(target);
  const targetDashletManager = new DashletManager(target);
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
      sourceDashboards = await retryOnFail(() => sourceDashletManager.enumerate());
      targetDashboards = await retryOnFail(() => targetDashletManager.enumerate());
    }

    if (config.hasCubes()) {
      sourceCubes = await retryOnFail(() => sourceCubeManager.enumerate());
      targetCubes = await retryOnFail(() => targetCubeManager.enumerate());
    }
  } finally {
    spinner.stop();
  }

  // Success, show source files count
  console.log(`SUCCESS: ${sourceResources.length} resources, ${sourceDashboards.length} dashboards, ${sourceCubes.length} cubes`);

  // Load files content
  const bar = new SingleBar({ format: 'Loading files content... |' + colors.cyan('{bar}') + '| {percentage}% || {value}/{total}' });
  bar.start(sourceResources.length + sourceDashboards.length + sourceCubes.length, 0);

  // Compare source and target
  let createItems = [], overwriteItems = [], removeItems = [];

  if (config.hasResources()) {
    for (const resource of sourceResources) {
      const sourceContent = await retryOnFail(() => source.resourceManager.getContent(resource));

      // Select between create and update
      if (targetResources.includes(resource)) {
        const targetContent = await retryOnFail(() => target.resourceManager.getContent(resource));
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
      const sourceContent = await retryOnFail(() => source.dashletManager.getContent(dashboard)); // utils.cleanPropertyMembers??

      // Select between create and update
      if (targetDashboards.includes(dashboard)) {
        const targetContent = await retryOnFail(() => target.dashletManager.getContent(dashboard)); // utils.cleanPropertyMembers??
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
      const sourceContent = await retryOnFail(() => source.cubeManager.getContent(cube));

      // Select between create and update
      if (targetCubes.includes(cube)) {
        const targetContent = await retryOnFail(() => target.dashletManager.getContent(cube)); // utils.cleanPropertyMembers??
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
      if (item.type === 'resource') await target.resourceManager.createContent(item.fileName, item.content);
      if (item.type === 'dashboard') await target.dashletManager.createContent(item.fileName, item.content);
      if (item.type === 'cube') await target.cubeManager.createContent(item.fileName, item.content);
      finalBar.increment();
    }

    for (let item of overwriteItems) {
      if (item.type === 'resource') await target.resourceManager.updateContent(item.fileName, item.content);
      if (item.type === 'dashboard') await target.dashletManager.updateContent(item.fileName, item.content);
      if (item.type === 'cube') await target.cubeManager.updateContent(item.fileName, item.content);
      finalBar.increment();
    }

    for (let item of removeItems) {
      if (item.type === 'resource') await target.resourceManager.deleteContent(item.fileName);
      if (item.type === 'dashboard') await target.dashletManager.deleteContent(item.fileName);
      if (item.type === 'cube') await target.cubeManager.deleteContent(item.fileName);
      finalBar.increment();
    }
  } finally {
    finalBar.stop();
  }
}

module.exports = synchronize;
