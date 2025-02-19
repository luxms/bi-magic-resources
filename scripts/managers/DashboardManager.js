const ContentManager = require('./base/ContentManager');
const utils = require('../lib/utils');

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

        // Как и в кубах, возможно мерджинг стоит вынести в отдельную функцию
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
        // Эта штука важна, чтобы поднять индексовые файлы
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

  /**
   * Creates a new dashboard configuration
   * @param {string} path - Full config path
   * @param {Object} content - Configuration content
   * @returns {Promise<Object|null>} - Returns new entity if created on server
   */
  async createContent(path, content) {
    return this.platform.createJSONContent(path, content);
  }

  /**
   * Updates existing dashboard configuration
   * @param {string} path - Full config path
   * @param {Object} content - New configuration content
   * @returns {Promise<void>}
   */
  async updateContent(path, content) {
    return this.platform.saveJSONContent(path, content);
  }

  /**
   * Deletes a dashboard configuration
   * @param {string} path - Full config path
   * @returns {Promise<void>}
   */
  async deleteContent(path) {
    return this.platform.removeJSONContent(path);
  }

  /**
   * Creates a new topic
   * @param {Object} params
   * @returns {Promise<Object|null>}
   */
  async createTopic({ schemaName, id, content }) {
    return this.platform.createTopic({ schemaName, id, content });
  }

  /**
   * Creates a new dashboard
   * @param {Object} params
   * @returns {Promise<Object|null>}
   */
  async createDashboard({ schemaName, topicId, id, content }) {
    return this.platform.createDashboard({ schemaName, topicId, id, content });
  }

  /**
   * Creates a new dashlet
   * @param {Object} params
   * @returns {Promise<Object|null>}
   */
  async createDashlet({ schemaName, topicId, dashboardId, id, content }) {
    return this.platform.createDashlet({ schemaName, topicId, dashboardId, id, content });
  }

  /**
   * Gets all topic IDs for a schema
   * @param {string} schemaName
   * @returns {Promise<number[]>}
   */
  async getTopicIds(schemaName) {
    return this.platform.getTopicsId(schemaName);
  }
}

module.exports = DashboardManager;
