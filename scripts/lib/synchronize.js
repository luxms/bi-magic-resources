const chalk = require('chalk');
const colors = require('colors');
const Confirm = require('prompt-confirm');
const Spinner = require('cli-spinner').Spinner;
const {SingleBar} = require('cli-progress');
const {retryOnFail} = require('./utils');
const utils = require('./utils');
const config = require('./config');
const {normalizeResourceContent, equalContentBytes} = require('./resource-content');

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

  // Validate every downloaded path and existing destination before comparison or
  // mutation. A server resource name must never escape the local dist tree.
  if (target.type === 'local') {
    const { safePath, assertNoSymlinks } = require('./restore');
    for (const item of [...Object.values(sourceItems).flat(), ...Object.values(targetItems).flat()]) {
      const relative = safePath(utils.decodePath(item).replace(/^\//, ''));
      await assertNoSymlinks(target.BASE_DIR, relative);
    }
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

        // Нормализуем переводы строк текстового содержимого в LF.
        const normalizeSourcesContent = normalizeResourceContent(item, sourceContent);

        if (targetItems[contentType].includes(item)) {
          const targetContent = await retryOnFail(() => target[contentType].getContent(item));
          const normalizeTargetsContent = normalizeResourceContent(item, targetContent);
          const contentsMatch = contentType === 'resources'
            ? (equalContentBytes(normalizeSourcesContent, normalizeTargetsContent) ||
              (!Buffer.isBuffer(normalizeSourcesContent) && typeof normalizeSourcesContent === 'object' &&
                !Buffer.isBuffer(normalizeTargetsContent) && typeof normalizeTargetsContent === 'object' &&
                utils.compareObjects(normalizeSourcesContent, normalizeTargetsContent)))
            : utils.compareObjects(normalizeSourcesContent, normalizeTargetsContent);
          if (!contentsMatch) overwriteItems.push({ type: contentType, path: item, content: normalizeSourcesContent });
        } else {
          createItems.push({ type: contentType, path: item, content: normalizeSourcesContent })
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
    return { status: 'nochanges', paths: Object.values(sourceItems).flat() };
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
    if (!(await prompt.run())) return { status: 'cancelled', paths: [] };
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
  return { status: 'applied', paths: Object.values(sourceItems).flat() };
}

/**
 * Разбирает путь к JSON-файлу дашлета и извлекает схему и идентификатор из имени файла.
 * Для других путей и файла index.json возвращает null.
 *
 * @param {string} path - Путь к файлу ресурса.
 * @returns {{schema: string, id: number} | null} Схема и идентификатор дашлета либо null.
 */
function parseDashletPath(path) {
  const m = path.match(/^\/([^/]+)\/topic\.\d+\/dashboard\.\d+\/([^/]+)\.json$/);
  if (!m || m[2] === 'index') return null;
  return { schema: m[1], id: Number(m[2]) };
}

/**
 * Проверяет, что элемент синхронизации относится к файлу дашлета.
 *
 * @param {{type: string, path: string}} item - Элемент синхронизации.
 * @returns {boolean} true для файла дашлета, иначе false.
 */
function isDashletItem(item) {
  return item.type === 'dashboards' && parseDashletPath(item.path) !== null;
}

/**
 * Располагает дочерние дашлеты после их родителей по полю parent_id.
 * Позиции остальных элементов в массиве сохраняются.
 *
 * @param {Array<{type: string, path: string, content?: Object}>} items - Элементы для создания или обновления.
 * @returns {Array<Object>} Массив с упорядоченными дашлетами.
 */
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

module.exports = synchronize;
