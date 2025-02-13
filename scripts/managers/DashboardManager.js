const Manager = require('./base/Manager');

class DashboardManager extends Manager {
  async enumerate() {
    const list = [];
    const schemaNames = await this.platform.getSchemaNames();
    for (const schemaName of schemaNames) {
      const dashboards = await this.platform.getDashboards(schemaName);
      for (const dashboard of dashboards) {
        list.push(`/${schemaName}/${dashboard}`);
      }
    }
    return list;
  }

  /**
   * Gets dashboard configuration content
   * @param {string} path - Full config path
   * @returns {Promise<Object>}
   */
  async getContent(path) {
    const content = await this.platform.getConfigContent(path);
    if (!content) return null;

    // Remove service fields that shouldn't be compared
    delete content.id;
    delete content.updated;
    
    return content;
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
