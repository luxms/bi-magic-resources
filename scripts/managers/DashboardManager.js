const ContentManager = require('./base/ContentManager');
const utils = require('../lib/utils');

// TODO Доработать
class DashboardManager extends ContentManager {
  constructor(platform) {
    super(platform);
    this.TREE_FF = {};
  }

  async enumerate() {
    const list = [];
    const schemaNames = await this.platform.getSchemaNames();

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
        fileNames.reverse();
        for (const fileName of fileNames) {
          if (fileName.startsWith('topic.')) {
            list.push(`/${schemaName}/${fileName}`);
          }
        }
      }
    }
    return list;
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
    return response.statusText === 'OK' ? response.data : null;
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
}

module.exports = DashboardManager;
