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

// Dashlet paths look like /<schema>/topic.X/dashboard.Y/<id>.json (id is the file basename, not 'index')
function parseDashletPath(path) {
  const m = path.match(/^\/([^/]+)\/topic\.\d+\/dashboard\.\d+\/([^/]+)\.json$/);
  if (!m || m[2] === 'index') return null;
  return { schema: m[1], id: Number(m[2]) };
}

function isDashletItem(item) {
  return item.type === 'dashboards' && parseDashletPath(item.path) !== null;
}

// Topologically sort dashlet items so parents come before children (FK constraint on parent_id).
// Non-dashlet items keep their positions; dashlet positions are filled in topo order.
function sortDashletsByParent(items) {
  const dashletIndices = [];
  const dashlets = [];
  items.forEach((item, idx) => {
    if (isDashletItem(item)) {
      dashletIndices.push(idx);
      dashlets.push(item);
    }
  });
  if (dashlets.length < 2) return items;

  const key = (schema, id) => `${schema}:${id}`;
  const idToItem = new Map();
  for (const d of dashlets) {
    const p = parseDashletPath(d.path);
    idToItem.set(key(p.schema, p.id), d);
  }

  const sorted = [];
  const visited = new Set();
  const visiting = new Set();

  function visit(item) {
    const p = parseDashletPath(item.path);
    const k = key(p.schema, p.id);
    if (visited.has(k) || visiting.has(k)) return;
    visiting.add(k);
    const parentId = item.content && item.content.parent_id;
    if (parentId != null) {
      const parentKey = key(p.schema, parentId);
      if (idToItem.has(parentKey)) visit(idToItem.get(parentKey));
    }
    visiting.delete(k);
    visited.add(k);
    sorted.push(item);
  }

  for (const d of dashlets) visit(d);

  if (sorted.length !== dashlets.length) return items; // safety net — shouldn't happen, but don't corrupt array

  const result = items.slice();
  dashletIndices.forEach((idx, i) => { result[idx] = sorted[i]; });
  return result;
}

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
    createItems.forEach(item => console.log('    ', chalk.green(utils.decodePath(item.path))));
  }

  if (overwriteItems.length) {
    console.log('OVERWRITE:');
    overwriteItems.forEach(item => console.log('    ', chalk.yellow(utils.decodePath(item.path))));
  }

  if (removeItems.length) {
    console.log('REMOVE:');
    removeItems.forEach(item => console.log('    ', chalk.red(utils.decodePath(item.path))));
  }

  // Confirm changes
  if (!config.getForce()) {
    const prompt = new Confirm('Continue?');
    if (!(await prompt.run())) return;
  }

  // Dashlets have a self-referential FK on parent_id — make sure parents are created before children.
  createItems = sortDashletsByParent(createItems);
  overwriteItems = sortDashletsByParent(overwriteItems);

  // Start changes
  const finalBar = new SingleBar({ format: 'Synchronizing... |' + colors.cyan('{bar}') + '| {percentage}% || {value}/{total} Resources' });
  finalBar.start(createItems.length + overwriteItems.length + removeItems.length, 0);

  try {
    for (const item of createItems) {
      const newEntity = await target[item.type].createContent(item.path, item.content);
      // TODO: fromModule is undefined - this code was never working
      // if (item.type === 'dashboards' && newEntity) await fromModule.createContent(item.path, newEntity);
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
