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



module.exports = {
  splitResource,
  filterSchemaNames,
  retryOnFail,
};
