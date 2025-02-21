const Local = require('../../platforms/Local');
const lpe = require('../../lib/lpe');
const express = require('express');

const local = new Local('src'); // src ли?

// глобальные кубы --- koob.cubes/
// локальные кубы --- :schema_name.cubes/.filter(is_global=0)
// current dimensions --- :schema_name.dimensions/.filter(source_ident='ch'&&cube_name='max_example')
// current data --- :schema_name/data?xAxis

async function cubeMiddleware(req, res, next) {
  try {
    const {method, url, params: {schema_name}} = req;
    let cube = parse(url, true).pathname;
    const validSchemas = await local.getSchemaNames();
    if (!validSchemas.includes(schema_name)) {
      next();
      return;
    }

    const paths = await local.getCubes(schema_name);
    switch (method) {
      case 'GET': {
        let content;
        if (cube === '/.filter(is_global=0)') { // локальные кубы
          content = [];
          for (let index = 0; index < paths.length; index++) {
            const cubePath = paths[index];
            const cubeContent = await local.getCubeContent(schema_name, cubePath);
            if (cubeContent.hasOwnProperty('dimensions')) delete cubeContent.dimensions;
            content.push(cubeContent);
          }

          const contentBuffer = Buffer.from(JSON.stringify(content));
          res.setHeader('Content-Type', 'application/json');
          res.end(contentBuffer);
        }
      }
        break;
      case 'PUT': {
        // todo
      }
        break;
      case 'POST': {
        // todo
      }
        break;
      case 'DELETE': {
        // todo
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

    const paths = await local.getCubes(schema_name);

    switch (method) {
      case 'GET': {
        const pattern = /source_ident='([^']+)'&&cube_name='([^']+)'/;
        const match = cube.match(pattern);
        const cubeId = match ? `${match[1]}.${match[2]}` : null;

        if (cubeId && paths.includes(cubeId)) {
          content = await local.getCubeContent(schema_name, cubeId);
          const contentBuffer = Buffer.from(JSON.stringify(content.dimensions));
          res.setHeader('Content-Type', 'application/json');
          res.end(contentBuffer);
        }
      }
        break;
      case 'PUT': {
        // todo
      }
        break;
      case 'POST': {
        // todo
      }
        break;
      case 'DELETE': {
        // todo
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
    const {method, url, body, params: {schema_name}} = req;
    const validSchemas = await local.getSchemaNames();
    if (!validSchemas.includes(schema_name)) {
      next();
      return;
    }
    switch (method) {
      case 'POST': {
        let body = [];
        req.on('data', async function (chunk) {
          body.push(chunk);
        }).on('end', async () => {
          body = Buffer.concat(body).toString();
          body = JSON.parse(body)

          const cubeId = body.with;
          if (cubeId) {
            const cubeContent = await local.getCubeContent(schema_name, cubeId);
            const cubeSql = lpe.generate_koob_sql(body, {
              _dimensions: cubeContent.dimensions.map(d => ({...d, id: `${cubeContent.source_ident}.${cubeContent.name}.${d.name}`})),
              _cube: cubeContent,
              _user_id: 1, // из ауф взять
              _user_info: {},
              _target_database: 'postgresql' // потом заполним adm.data_sources.config->_connection->>flavor
            });
            console.log(cubeSql);

            const localSources = await server.getDataSources(schema_name);
            const globalSources = await server.getDataSources("adm");
            const currentDS = [...localSources, ...globalSources].find(ds => ds.ident === cubeContent.source_ident);
            const isLocal = localSources.includes(currentDS);

            const data = await server.lalala(schema_name, cubeSql, cubeContent.source_ident, isLocal);
            const result = data.rows.map(row => {
              return data.columns.reduce((acc, col, index) => {
                acc[col.name] = row[index];
                return acc;
              }, {});
            });

            console.log(result);

            const contentBuffer = Buffer.from(result.map(JSON.stringify).join('\n'));
            res.setHeader('Content-Type', 'application/x-ndjson;charset=utf-8');
            res.end(contentBuffer);
          }});
        }
        break;
      case 'PUT': {
        // todo
      }
        break;
      case 'GET': {
        // todo
      }
        break;
      case 'DELETE': {
        // todo
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
