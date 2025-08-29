const parse = require('url-parse')
const Local = require('../../platforms/Local');
const Server = require('../../platforms/Server');
const auth = require('../../lib/auth');
const lpe = require('../../lib/lpe');

const local = new Local('src');
const server = new Server();

async function cubeMiddleware(req, res, next) {
  try {
    const { method, url, params: {schema_name} } = req;
    const path = parse(url, true).pathname;

    const validSchemas = await local.getSchemaNames();
    if (!validSchemas.includes(schema_name)) {
      next();
      return;
    }

    switch (method) {
      case 'GET': {
        let result = [];
        const cubes = await local.cubes.enumerate(schema_name);

        for (let cube of cubes) {
          let cubeContent = await local.cubes.getContent(cube);
          [cubeContent] = local.cubes.toServerFormat(cubeContent);
          result.push(cubeContent);
        }

        res.setHeader('Content-Type', 'application/json');
        res.end(Buffer.from(JSON.stringify(result)));
      }
        break;
      case 'PUT': {
        req.on('data', async function (body) {
          const jsonBody = JSON.parse(body);
          const cubeId = path.slice(1);
          const cubes = await local.cubes.enumerate(schema_name);
          const cubePath = local.cubes.createPath(schema_name, cubeId);

          if (cubes.includes(cubePath)) {
            const cubeContent = await local.cubes.getContent(cubePath);
            const newContent = {...cubeContent, ...jsonBody};
            const dimensions = [...cubeContent.dimensions];
            await local.cubes.updateContent(cubePath, {...newContent, dimensions});
            if (newContent.hasOwnProperty('dimensions')) delete newContent.dimensions;

            res.setHeader('Content-Type', 'application/json');
            res.end(Buffer.from(JSON.stringify(newContent)));
          } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end(`Not found: ${cubeId}`);
          }
        });
      }
        break;
      case 'POST': {
        req.on('data', async function (body) {
          const jsonBody = JSON.parse(body);
          const cubePath = local.cubes.createPath(schema_name, jsonBody);
          const newContent = await local.cubes.createContent(cubePath, jsonBody);
          const [cube] = local.cubes.toServerFormat(newContent);
          res.setHeader('Content-Type', 'application/json');
          res.end(Buffer.from(JSON.stringify(cube)));
        });
      }
        break;
      case 'DELETE': {
        const cubeId = path.slice(1);
        const cubes = await local.cubes.enumerate(schema_name);
        const cubePath = local.cubes.createPath(schema_name, cubeId);

        if (cubes.includes(cubePath)) {
          const cubeContent = await local.cubes.getContent(cubePath);
          await local.cubes.deleteContent(cubePath);
          const [cube] = local.cubes.toServerFormat(cubeContent);
          res.setHeader('Content-Type', 'application/json');
          res.end(Buffer.from(JSON.stringify(cube)));
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
    const path = parse(url, true).pathname;

    const validSchemas = await local.getSchemaNames();
    if (!validSchemas.includes(schema_name)) {
      next();
      return;
    }

    switch (method) {
      case 'GET': {
        const pattern = /source_ident='([^']+)'&&cube_name='([^']+)'/;
        const match = path.match(pattern);
        const cubeId = match ? `${match[1]}.${match[2]}` : null;
        const cubePath = local.cubes.createPath(schema_name, cubeId);
        const cubes = await local.cubes.enumerate(schema_name);

        if (cubeId && cubes.includes(cubePath)) {
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
        req.on('data', async function (body) {
          const jsonBody = JSON.parse(body);
          const dims = Array.isArray(jsonBody) ? jsonBody : [jsonBody];
          const cubes = await local.cubes.enumerate(schema_name);
          let result = [];

          for (let dim of dims) {
            const [source_ident, cube_name, dimension_name] = dim.id.split('.');
            const cube_id = `${source_ident}.${cube_name}`;
            const cubePath = local.cubes.createPath(schema_name, cube_id);

            if (cubes.includes(cubePath)) {
              const cubeContent = await local.cubes.getContent(cubePath);
              const dimensions = cubeContent.dimensions.map(d => {
                if (d.name !== dimension_name) return d;
                result.push({...d, ...dim, id: dim.id, source_ident, cube_name, cube_id, is_global: 0, is_cube_global: 0});
                return {...d, ...dim};
              });
              await local.cubes.updateContent(cubePath, {...cubeContent, dimensions});
            }
          }

          res.setHeader('Content-Type', 'application/json');
          res.end(Buffer.from(JSON.stringify(result)));
        });
      }
        break;
      case 'POST': {
        req.on('data', async function (body) {
          const jsonBody = JSON.parse(body);
          const dimensions = Array.isArray(jsonBody) ? jsonBody : [jsonBody];
          const cubes = await local.cubes.enumerate(schema_name);
          let result = [];

          for (let dim of dimensions) {
            const cubeId = `${dim.source_ident}.${dim.cube_name}`;
            const cubePath = local.cubes.createPath(schema_name, cubeId);

            if (cubes.includes(cubePath)) {
              const cubeContent = await local.cubes.getContent(cubePath);
              const newDimensions = {...dim};
              ['source_ident', 'cube_name'].forEach((key) => delete newDimensions[key]);
              await local.cubes.updateContent(cubePath, {
                ...cubeContent,
                dimensions: [...cubeContent.dimensions, newDimensions],
              });

              result.push({
                ...dim,
                cube_id: cubeId,
                id: `${cubeId}.${dim.name}`,
                is_cube_global: 0,
                is_global: 0,
              });
            }
          }

          res.setHeader('Content-Type', 'application/json');
          res.end(Buffer.from(JSON.stringify(result)));
        });
      }
        break;
      case 'DELETE': {
        const [source_ident, cube_name, dim_name] = path.slice(1).split('.');
        const cube_id = `${source_ident}.${cube_name}`;
        const cubePath = local.cubes.createPath(schema_name, cube_id);
        const cubes = await local.cubes.enumerate(schema_name);
        let result = null;

        if (cubes.includes(cubePath)) {
          const cubeContent = await local.cubes.getContent(cubePath);
          const dimensions = cubeContent.dimensions.filter(d => {
            if (d.name !== dim_name) return true;
            else {
              result = {
                ...d,
                source_ident,
                cube_name,
                cube_id,
                id: `${cube_id}.${dim_name}`,
                is_cube_global: 0,
                is_global: 0,
              }
              return false;
            }
          });
          await local.cubes.updateContent(cubePath, {...cubeContent, dimensions });
        }

        res.setHeader('Content-Type', 'application/json');
        res.end(Buffer.from(JSON.stringify(result)));
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
    const {method, url, params: {schema_name}} = req;

    if (url.endsWith('DatePickerMaxMin')) {
      res.statusCode = 500;
      res.end('Request failed');
      console.warn('Cannot get DatePickerMaxMin');
      return;
    }

    const validSchemas = await local.getSchemaNames();
    if (!validSchemas.includes(schema_name)) {
      next();
      return;
    }

    switch (method) {
      case 'POST': {
        req.on('data', async function (body) {
          const jsonBody = JSON.parse(body)
          const cubeId = jsonBody.with;

          if (cubeId) {
            const cubePath = local.cubes.createPath(schema_name, cubeId);
            const cubeContent = await local.cubes.getContent(cubePath);
            const [cube, dimensions] = local.cubes.toServerFormat(cubeContent);

            const localSources = await server.cubes.getDataSources(schema_name);
            const globalSources = await server.cubes.getDataSources('adm');
            const currentDS = [...localSources, ...globalSources].find(ds => ds.ident === cubeContent.source_ident);
            const isLocal = localSources.includes(currentDS);

            const cubeSql = lpe.generate_koob_sql(jsonBody, {
              _dimensions: dimensions,
              _cube: cube,
              _user_id: auth.USER_ID,
              _user_info: {},
              _target_database: currentDS.config._connection.flavor,
            });

            try {
              const data = await server.cubes.getDataSourceData(schema_name, cubeSql, cubeContent.source_ident, isLocal);
              const result = data.rows.map(row => data.columns.reduce((acc, col, index) => {
                acc[col.name] = row[index];
                return acc;
              }, {}));

              const contentBuffer = Buffer.from(result.map(JSON.stringify).join('\n'));
              res.setHeader('Content-Type', 'application/x-ndjson;charset=utf-8');
              res.end(contentBuffer);
            } catch (err) {
              res.statusCode = 500;
              res.end('Error: ' + err.message);
              console.error(err);
            }
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
