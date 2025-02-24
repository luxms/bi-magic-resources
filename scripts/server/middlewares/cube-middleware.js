const parse = require('url-parse')
const { v4: uuidv4 } = require('uuid');
const Local = require('../../platforms/Local');
const Server = require('../../platforms/Server');
const auth = require('../../lib/auth');
const lpe = require('../../lib/lpe');

const local = new Local('src');
const server = new Server();

async function cubeMiddleware(req, res, next) {
  try {
    const { method, url, params: {schema_name} } = req;
    let cube = parse(url, true).pathname;
    const validSchemas = await local.getSchemaNames();
    if (!validSchemas.includes(schema_name)) {
      next();
      return;
    }

    const paths = await local.cubes.enumerate(schema_name);
    switch (method) {
      case 'GET': {
        // глобальные кубы --- koob.cubes/
        // локальные кубы --- :schema_name.cubes/.filter(is_global=0)
        let content;
        if (cube === '/.filter(is_global=0)') {
          content = [];
          for (let path of paths) {
            const cubeContent = await local.cubes.getContent(path);
            if (cubeContent && cubeContent.hasOwnProperty('dimensions')) delete cubeContent.dimensions;
            let id = path.split('/');
            content.push({
              ...cubeContent,
              is_global: 0,
              id: id[id.length - 1].slice(0, -5),
            });
          }
          const contentBuffer = Buffer.from(JSON.stringify(content));
          res.setHeader('Content-Type', 'application/json');
          res.end(contentBuffer);
        }
      }
        break;
      case 'PUT': {
        req.on('data', async function (chunk) {
          const jsonBody = JSON.parse(chunk);
          const cubeId = cube.slice(1);
          const cubePath = `/${schema_name}/.cubes/${cubeId}.json`;
          if (paths.includes(cubePath)) {
            const cubeContent = await local.cubes.getContent(cubePath);
            const newContent = {...cubeContent, ...jsonBody};
            const dimensions = [...cubeContent.dimensions];
            await local.cubes.updateContent(cubePath, {...newContent, dimensions});
            if (newContent.hasOwnProperty('dimensions')) delete newContent.dimensions;
            const contentBuffer = Buffer.from(JSON.stringify(newContent));
            res.setHeader('Content-Type', 'application/json');
            res.end(contentBuffer);
          }
        });
      }
        break;
      case 'POST': {
        req.on('data', async function (chunk) {
          const jsonBody = JSON.parse(chunk);
          const newCubePath = `/${schema_name}/.cubes/${jsonBody.source_ident}.${jsonBody.name}.json`;
          const guid = uuidv4();
          const createContent = {...jsonBody, guid, dimensions: []};
          await local.cubes.createContent(newCubePath, createContent);
          const newContent = {
            ...jsonBody,
            id: `${jsonBody.source_ident}.${jsonBody.name}`,
            is_global: 0,
            is_source_global: 0,
            guid,
          };
          const contentBuffer = Buffer.from(JSON.stringify(newContent));
          res.setHeader('Content-Type', 'application/json');
          res.end(contentBuffer);
        });
      }
        break;
      case 'DELETE': {
        const cubeId = cube.slice(1);
        const cubePath = `/${schema_name}/.cubes/${cubeId}.json`;
        if (paths.includes(cubePath)) {
          const cubeContent = await local.cubes.getContent(cubePath);
          await local.cubes.deleteContent(cubePath);
          if (cubeContent.hasOwnProperty('dimensions')) delete cubeContent.dimensions;
          const contentBuffer = Buffer.from(JSON.stringify(cubeContent));
          res.setHeader('Content-Type', 'application/json');
          res.end(contentBuffer);
        } else {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain');
          res.end(`Not found: ${cubeId}`);
        }
      }
        break;
      default: {
        throw new Error(`Method ${method} not implemented`);
      }
    }
  } catch (err) {
    res.statusCode = 500;
    res.end('Error: ' + err.message);
    console.error(err);
  }
}

async function dimensionMiddleware(req, res, next) {
  try {
    const {method, url, params: {schema_name}} = req;
    let cube = parse(url, true).pathname;
    const validSchemas = await local.getSchemaNames();
    if (!validSchemas.includes(schema_name)) {
      next();
      return;
    }

    const paths = await local.cubes.enumerate(schema_name);
    switch (method) {
      case 'GET': {
        const pattern = /source_ident='([^']+)'&&cube_name='([^']+)'/;
        const match = cube.match(pattern);
        const cubeId = match ? `${match[1]}.${match[2]}` : null;
        const cubePath = `/${schema_name}/.cubes/${cubeId}.json`;
        if (cubeId && paths.includes(cubePath)) {
          content = await local.cubes.getContent(cubePath);
          const dimensions = content.dimensions.map(d => ({
            ...d,
            source_ident: content.source_ident,
            cube_id: cubeId,
            cube_name: content.name,
            is_cube_global: 0,
            is_global: 0,
            id: `${cubeId}.${d.name}`
          }));
          const contentBuffer = Buffer.from(JSON.stringify(dimensions));
          res.setHeader('Content-Type', 'application/json');
          res.end(contentBuffer);
        } else {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain');
          res.end(`Cube not found: ${cubeId}`);
        }
      }
        break;
      case 'PUT': {
        req.on('data', async function (chunk) {
          const jsonBody = JSON.parse(chunk);
          const dims = Array.isArray(jsonBody) ? jsonBody : [jsonBody];
          let result = [];
          for (let dim of dims) {
            const [source_ident, cube_name, dimension_name] = dim.id.split('.');
            const cube_id = `${source_ident}.${cube_name}`;
            const cubePath = `/${schema_name}/.cubes/${cube_id}.json`;
            if (paths.includes(cubePath)) {
              const cubeContent = await local.cubes.getContent(cubePath);
              const dimensions = cubeContent.dimensions.map(d => {
                if (d.name !== dimension_name) return d;
                result.push({...d, ...dim, id: dim.id, source_ident, cube_name, cube_id, is_global: 0, is_cube_global: 0});
                return {...d, ...dim};
              });
              await local.cubes.updateContent(cubePath, {...cubeContent, dimensions}); 
            }
          }
          const contentBuffer = Buffer.from(JSON.stringify(result));
          res.setHeader('Content-Type', 'application/json');
          res.end(contentBuffer);
        });
      }
        break;
      case 'POST': {
        req.on('data', async function (chunk) {
          const jsonBody = JSON.parse(chunk);
          const dims = Array.isArray(jsonBody) ? jsonBody : [jsonBody];
          let result = [];
          for (let dim of dims) {
            const cube_id = `${dim.source_ident}.${dim.cube_name}`;
            const cubePath = `/${schema_name}/.cubes/${cube_id}.json`;
            if (paths.includes(cubePath)) {
              const cubeContent = await local.cubes.getContent(cubePath);
              const newDim = {...dim};
              ['source_ident', 'cube_name'].forEach((key) => delete newDim[key]);
              await local.cubes.updateContent(cubePath, {...cubeContent, dimensions: [
                ...cubeContent.dimensions, newDim
              ]});
              result.push({
                ...dim,
                cube_id,
                id: `${cube_id}.${dim.name}`,
                is_cube_global: 0,
                is_global: 0,
              });
            }
          }
          const contentBuffer = Buffer.from(JSON.stringify(result));
          res.setHeader('Content-Type', 'application/json');
          res.end(contentBuffer);
        });
      }
        break;
      case 'DELETE': {
        const [source_ident, cube_name, dim_name] = (cube.startsWith('/') ? cube.slice(1) : cube).split('.');
        const cube_id = `${source_ident}.${cube_name}`;
        const cubePath = `/${schema_name}/.cubes/${cube_id}.json`;
        let result = null;
        if (paths.includes(cubePath)) {
          const cubeContent = await local.cubes.getContent(cubePath);
          const dimensions = cubeContent.dimensions.filter(d => {
            if (d.name !== dim_name) return true;
            else {
              result = {
                ...d,
                source_ident,
                cube_name,
                cube_id,
                id: `${cube_id}.${dim.name}`,
                is_cube_global: 0,
                is_global: 0,
              }
              return false;
            }
          });
          await local.cubes.updateContent(cubePath, {...cubeContent, dimensions });
        }
        const contentBuffer = Buffer.from(JSON.stringify(result));
        res.setHeader('Content-Type', 'application/json');
        res.end(contentBuffer);
      }
        break;
      default: {
        throw new Error(`Method ${method} not implemented`);
      }
    }
  } catch (err) {
    res.statusCode = 500;
    res.end('Error: ' + err.message);
    console.error(err);
  }
}

async function dataMiddleware(req, res, next) {
  try {
    const {method, params: {schema_name}} = req;
    const validSchemas = await local.getSchemaNames();
    if (!validSchemas.includes(schema_name)) {
      next();
      return;
    }

    switch (method) {
      case 'POST': {
        req.on('data', async function (chunk) {
          const body = JSON.parse(chunk)
          const cubeId = body.with;
          if (cubeId) {
            const cubeContent = await local.cubes.getContent(`${schema_name}/.cubes/${cubeId}.json`);
            const localSources = await server.cubes.getDataSources(schema_name);
            const globalSources = await server.cubes.getDataSources('adm');
            const currentDS = [...localSources, ...globalSources].find(ds => ds.ident === cubeContent.source_ident);
            const isLocal = localSources.includes(currentDS);
            const cubeSql = lpe.generate_koob_sql(body, {
              _dimensions: cubeContent.dimensions.map(d => ({...d, id: `${cubeContent.source_ident}.${cubeContent.name}.${d.name}`})),
              _cube: cubeContent,
              _user_id: auth.USER_ID,
              _user_info: {},
              _target_database: currentDS.config._connection.flavor,
            });
            const data = await server.cubes.getDataSourceData(schema_name, cubeSql, cubeContent.source_ident, isLocal);
            const result = data.rows.map(row => data.columns.reduce((acc, col, index) => {
              acc[col.name] = row[index];
              return acc;
            }, {}));
            const contentBuffer = Buffer.from(result.map(JSON.stringify).join('\n'));
            res.setHeader('Content-Type', 'application/x-ndjson;charset=utf-8');
            res.end(contentBuffer);
          }});
        }
        break;
      default: {
        throw new Error(`Method ${method} not implemented`);
      }
    }
  } catch (err) {
    res.statusCode = 500;
    res.end('Error: ' + err.message);
    console.error(err);
  }
}

module.exports = {
  cubeMiddleware,
  dimensionMiddleware,
  dataMiddleware,
};
