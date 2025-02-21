const ContentManager = require('./base/ContentManager');
const utils = require('../lib/utils');

class DashboardManager extends ContentManager {
  constructor(platform) {
    super(platform);
    this.TREE_FF = {};
  }

  async enumerate(schemaName) {
    const list = [];
    const schemaNames = schemaName ? [schemaName] : await this.platform.getSchemaNames();

    for (const schemaName of schemaNames) {
      if (this.platform.type === 'server') {
        const [topics, dashboards, dashlets] = await Promise.all([
          this.platform.getFiles(schemaName, 'dashboard_topics'),
          this.platform.getFiles(schemaName, 'dashboards'),
          this.platform.getFiles(schemaName, 'dashlets')
        ]);

        const fileNames = [];
        const snFolders = this.TREE_FF[schemaName] = {};

        for (let topic of topics) {
          const topicId = topic.id;
          const topicPath = `topic.${topicId}/index.json`;
          fileNames.push(topicPath);
          const { id, updated, ...topicData } = topic;
          const snf = snFolders[`topic.${topicId}`] = { index: topicData };

          for (let db of dashboards) {
            if (db.topic_id === topicId) {
              const dashboardId = db.id;
              const dashboardPath = `topic.${topicId}/dashboard.${dashboardId}/index.json`;
              fileNames.push(dashboardPath);
              const { id, updated, ...dbData } = db;
              const cd = snf[`dashboard.${dashboardId}`] = { index: dbData };

              dashlets.forEach(d => {
                if (d.dashboard_id === dashboardId) {
                  const dashletId = d.id;
                  fileNames.push(`topic.${topicId}/dashboard.${dashboardId}/${dashletId}.json`);
                  
                  const { id, updated, ...dashletData } = d;
                  cd[dashletId] = dashletData;
                }
              });
            }
          }
        }

        for (const fileName of fileNames) {
          list.push(`/${schemaName}/${fileName}`);
        }
      } else {
        const fileNames = await this.platform.getFiles(schemaName);
        for (const fileName of fileNames) {
          if (fileName.startsWith('topic.')) {
            list.push(`/${schemaName}/${fileName}`);
          }
        }
      }
    }
    return list.reverse();
  }

  async getContent(path) {
    if (this.platform.type === 'server') {
      if (!path?.startsWith('/')) {
        console.error('Invalid path format in getContent');
        return null;
      }

      const [, schemaName, topic, dashboard, dash] = path.split('/');

      if (!schemaName || !topic || !dashboard) {
        console.error('Missing required path components in getContent');
        return null;
      }

      let result = null;

      try {
        if (!this.TREE_FF[schemaName][topic]) {
          console.error(`Missing tree structure for ${schemaName}/${topic}`);
          return null;
        }

        if (dash) {
          const dashletId = dash.split('.')[0];
          result = this.TREE_FF[schemaName][topic][dashboard]?.[dashletId];
        } else {
          const dashboardId = dashboard.split('.')[0];
          result = this.TREE_FF[schemaName][topic][dashboardId];
        }

        if (!result) {
          console.warn(`Content not found for path: ${path}`);
          return null;
        }

        return utils.cleanPropertyMembers(result);
      } catch (error) {
        console.error('Error in getContent:', error);
        return null;
      }
    }

    const result = await this.platform.readFile(path);
    return utils.cleanPropertyMembers(result);
  }

  async createContent(path, content) {
    if (this.platform.type === 'server') {
      [path, content] = this._prepareData(path, content);
    }
    const response = await this.platform.writeFile(path, content);
    return response && response.statusText === 'OK' ? response.data : null;
  }

  async updateContent(path, content) {
    if (this.platform.type === 'server') {
      [path, content] = this._prepareData(path, content);
    }
    await this.platform.updateFile(path, content);
  }

  async deleteContent(path) {
    if (this.platform.type === 'server') {
      [path] = this._prepareData(path);
    }
    await this.platform.deleteFile(path);
  }

  _prepareData(path, content) {
    const [schemaName, altId] = utils.splitResource(path);
    const tempArr = altId.split('/');
    const [topicName, dashboardName, fileName] = tempArr;

    let relativePath, id;
    if (fileName && !fileName.includes('index.json')) {
      id = fileName.substring(0, fileName.indexOf('.'));
      relativePath = `dashlets/${id}`;
    } else if (fileName && fileName.includes('index.json')) {
      id = dashboardName.substring(dashboardName.indexOf('.') + 1, dashboardName.length);
      relativePath = `dashboards/${id}`;
    } else if (dashboardName.includes('index.json')) {
      id = topicName.substring(topicName.indexOf('.') + 1, topicName.length);
      relativePath = `dashboard_topics/${id}`;
    }

    return [
      `api/db/${schemaName}.${relativePath}`,
      {...content, id: parseInt(id)},
    ];
  }

  async getId(payload) {
    const {schemaName, topicId, dashboardId} = payload;
    let metaUrl = `api/db/${schemaName}.dashboard_topics?next_id`;
    if (topicId) metaUrl = `api/db/${schemaName}.dashboards?next_id`;
    if (dashboardId) metaUrl = `api/db/${schemaName}.dashlets?next_id`;
    const data = await this.platform.readFile(metaUrl);
    return data.hasOwnProperty('id') ? data.id : null;
  }

  async getTopicsId(schemaName) {
    const files = await this.enumerate(schemaName);
    const ids = files.filter((f) => f.includes('topic.')).map((f) => this._getIdfromStr(f, 'topic.'));
    return Array.from(new Set(ids)).sort();
  }

  async getDashboards(schemaName) {
    const paths = (await this.enumerate(schemaName))
      .filter((c) => c.includes('index.json') && c.includes('dashboard.'))
      .map((c) => `/${schemaName}/${c}`);
    const promises = [];
    paths.forEach((path) => promises.push(this.getContent(path)));
    const files = await Promise.all(promises);
    const result = [];
    for (let i = 0; i < paths.length; i++) {
      const id = this._makeIdfromString(paths[i]);
      result.push({config: paths[i], content: {id, ...files[i]}});
    }
    return result.length ? result : null;
  }

  async getDashlets(schemaName) {
    const configs = (await this.enumerate(schemaName))
      .filter((c) => !c.includes('index.json'))
      .map((c) => `/${schemaName}/${c}`);
    const promises = [];
    configs.forEach((con) => promises.push(this.getContent(con)));
    const files = await Promise.all(promises);
    const result = [];
    for (let i = 0; i < configs.length; i++) {
      const id = this._makeIdfromString(configs[i], 'dashlet');
      result.push({config: configs[i], content: {id, ...files[i]}});
    }
    return result.length ? result : null;
  }

  async createTopic(payload) {
    const {schemaName, id, content} = payload;
    const altId = `topic.${id}/index.json`;
    const filePath = altId.split('/').slice(0, -1);
    const dir = path.join(getSchemaPath(schemaName), ...filePath);
  
    try {
      await fsp.stat(dir);
    } catch (err) {
      await fsp.mkdir(dir, {recursive: true});
    }
  
    if (!fs.existsSync(getResourcePath(schemaName, altId))) {
      const jsonBody = {...DEFAULT_TOPIC,...content};
      await fsp.writeFile(getResourcePath(schemaName, altId), JSON.stringify(jsonBody, null, 2), 'utf-8');
      return {id, ...jsonBody};
    } else {
      console.log(`The index.json has already exist in the folder /${schemaName}/topic.${id}/`,'\n');
      return null;
    }
  }

  async createDashboard(payload) {
    const {schemaName, topicId, id, content} = payload;
    const altId = `topic.${topicId}/dashboard.${id}/index.json`;
    const filePath = altId.split('/').slice(0, -1);
    const dir = path.join(getSchemaPath(schemaName), ...filePath);
  
    try {
      await fsp.stat(dir);
    } catch (err) {
      await fsp.mkdir(dir, {recursive: true});
    }
  
    if (!fs.existsSync(getResourcePath(schemaName, `topic.${topicId}/index.json`)))  {
      await createTopic({schemaName, id: topicId});
    }
  
    if (!fs.existsSync(getResourcePath(schemaName, altId))) {
      const jsonBody = {...DEFAULT_DASHBOARD,...content, topic_id: topicId};
      await fsp.writeFile(getResourcePath(schemaName, altId), JSON.stringify(jsonBody, null, 2), 'utf-8');
      return {id, ...jsonBody};
    } else {
      console.log(`The index.json has already exist in the folder /topic.${topicId}/${schemaName}/dashboard.${id}/`,'\n');
      return null;
    }
  }
  
  async createDashlet(payload) {
    const {schemaName, topicId, dashboardId, id, content} = payload;
    const altId = `topic.${topicId}/dashboard.${dashboardId}/${id}.json`;
    const filePath = altId.split('/').slice(0, -1);
    const dir = path.join(getSchemaPath(schemaName), ...filePath);
  
    try {
      await fsp.stat(dir);
    } catch (err) {
      await fsp.mkdir(dir, {recursive: true});
    }
  
    if (!fs.existsSync(getResourcePath(schemaName, `topic.${topicId}/dashboard.${dashboardId}/index.json`))) await createDashboard({schemaName, topicId, id: dashboardId});
  
    if (!fs.existsSync(getResourcePath(schemaName, altId))) {
      const configDash = {...DEFAULT_DASHLET, ...content, dashboard_id: parseInt(dashboardId)};
      await fsp.writeFile(getResourcePath(schemaName, altId), JSON.stringify(configDash, null, 2), 'utf-8');
      return {id, ...configDash};
    } else {
      console.log(`The ${id}.json has already exist in the folder /${schemaName}/topic.${topicId}/dashboard.${dashboardId}/`,'\n');
      return null;
    }
  }  

  _getIdfromStr (str, search) {
    const tempArr = str.split('/');
    const tempStr = tempArr.find((t) => t.includes(search));
    return parseInt(tempStr.substring(tempStr.indexOf('.') + 1, tempStr.length));
  }

  _makeIdfromString(config, type = 'dashboard') {
    const [_, altId] = utils.splitResource(config);
    const tempArr = altId.split('/');
    const nameFile = tempArr[tempArr.length-1];
    const nameDashboard = tempArr[tempArr.length-2];
    switch (type) {
      case 'dashlet': return parseInt(nameFile.substring(0, nameFile.indexOf('.')));
      default: return parseInt(nameDashboard.substring(nameDashboard.indexOf('.') + 1, nameDashboard.length))
    }
  }
}

module.exports = DashboardManager;
