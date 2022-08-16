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


function filterSchemaNames(schema_names) {
  const include = config.getInclude();
  if (include) {
    const rInclude = new RegExp(include);
    schema_names = schema_names.filter(schema_name => schema_name.match(rInclude));
  }

  const exclude = config.getExclude();
  if (exclude) {
    const rExclude = new RegExp(exclude);
    schema_names = schema_names.filter(schema_name => !schema_name.match(rExclude));
  }

  return schema_names;
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

function compareObjests(x, y) {
  if (x === y) return true;
  if (!(x instanceof Object) || !(y instanceof Object)) return false;
  if (x.constructor !== y.constructor) return false;

  for (const p in x) {
    if (!x.hasOwnProperty(p)) continue;
    if (!y.hasOwnProperty(p)) return false;
    if (x[p] === y[p]) continue;
    if (typeof (x[p]) !== "object") return false;
    if (!compareObjests(x[p], y[p])) return false;
  }

  for (const p in y) {
    if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
      return false;
    }
  }

  return true;
}

async function fixResourceIdToName(resource) {
  const [schemaName, resourceIdOrName] = splitResource(resource);
  if (resourceIdOrName.match(/^\d+$/)) {
    // TODO
    throw new Error('Not implemented');
  } else {
    return `/${schemaName}/${encodeURIComponent(resourceIdOrName)}`;
  }
}

function getExtension (str) {
  const arr = str.split('.')
  return arr[arr.length - 1];
}

function getFileNameWithoutExt (str) {
  const temp = str.split('.');
  if (temp.length) {
    temp.length--;
  }
  return temp.join('.');
}

function makePathTsxJsx (str) {
  let temp = str;
  if (getExtension(temp) === 'map') temp = getFileNameWithoutExt(temp);
  return [getFileNameWithoutExt(temp) + '.tsx', getFileNameWithoutExt(temp) + '.jsx'];
}

module.exports = {
  splitResource,
  filterSchemaNames,
  retryOnFail,
  compareObjests,
  fixResourceIdToName,
  getExtension,
  getFileNameWithoutExt,
  makePathTsxJsx
};
