const Spinner = require('cli-spinner').Spinner;
const { SingleBar } = require('cli-progress');
const Confirm = require('prompt-confirm');
const chalk = require('chalk');
const _colors = require('colors');
const md5 = require('md5');
const { retryOnFail } = require('./utils');
const utils = require('./utils');
const config = require('./config');

class Commands {
  // Static authentication cache
  static loginPromise = null;

  constructor(sourcePlatform, targetPlatform) {
    this.source = sourcePlatform;
    this.target = targetPlatform;
  }

  // Main execution method
  async withAuth(callback) {
    config.getSUPConfigAndLog();

    try {
      await Commands._ensureAuthenticated(this.target);
      await callback();
    } catch (err) {
      this._handleError(err);
    } finally {
      await this._cleanup();
    }
  }

  // Static authentication methods
  static async _ensureAuthenticated(target) {
    if (!Commands.loginPromise) {
      Commands.loginPromise = Commands._authenticate(target);
    }
    return Commands.loginPromise;
  }

  static async _authenticate(target) {
    const { SERVER, USERNAME, PASSWORD, KERBEROS } = config.getSUPConfig();
    target.setServer(SERVER);

    const authSpinner = new Spinner('Authentication... %s');
    authSpinner.start();

    try {
      const result = KERBEROS
        ? await retryOnFail(() => target.loginSSO(KERBEROS))
        : await retryOnFail(() => target.login(USERNAME, PASSWORD));
      authSpinner.stop();
      console.log('SUCCESS\n');
      return result;
    } catch (err) {
      authSpinner.stop();
      throw err;
    }
  }

  // Synchronization methods
  async synchronize() {
    const resources = await this._loadResourceLists();

    const changes = await this._analyzeChanges(resources);
    if (!changes || this._noChangesDetected(changes)) {
      console.log(chalk.green('No changes'));
      return;
    }

    this._displayChanges(changes);

    if (!config.getForce() && !(await this._confirmChanges())) {
      return;
    }

    await this._applyChanges(changes);
  }

  // Entity creation
  async createEntity(type, schemaName, topicId, dashboardId, content) {
    if (!schemaName) {
      console.error('You have not typed schema_name');
      return;
    }

    const topicsId = await this.source.getTopicsId(schemaName);
    const resolvedTopicId = topicId || topicsId[0];

    switch (type) {
      case 'topic': {
        const id = await this.target.getId({ schemaName });
        const result = await this.source.createTopic({ schemaName, id, content });
        console.log(chalk.green(`\nThe topic has been created with id=${id}`));
        return result;
      }
      case 'dashboard': {
        const id = await this.target.getId({ schemaName, topicId: resolvedTopicId });
        const result = await this.source.createDashboard({
          schemaName,
          topicId: resolvedTopicId,
          id,
          content
        });
        console.log(chalk.green(`\nThe dashboard has been created with id=${id}`));
        return result;
      }
      default: {
        const resolvedDashboardId = dashboardId ||
          await this.target.getId({ schemaName, topicId: resolvedTopicId });
        const id = await this.target.getId({
          schemaName,
          topicId: resolvedTopicId,
          dashboardId: resolvedDashboardId
        });
        const result = await this.source.createDashlet({
          schemaName,
          topicId: resolvedTopicId,
          dashboardId: resolvedDashboardId,
          id,
          content
        });
        console.log(chalk.green(`\nThe dashlet has been created with id=${id}`));
        return result;
      }
    }
  }

  async _cleanup() {
    try {
      await this.target.logout();
      // Clear the static login promise on logout
      Commands.loginPromise = null;
    } catch (err) {
      // Ignore logout errors
    }
  }

  // Private helper methods
  async _loadResourceLists() {
    const spinner = new Spinner('Loading resources list... %s');
    spinner.start();

    try {
      let sourceResources = [], targetResources = [],
        sourceDashboards = [], targetDashboards = [],
        sourceCubes = [], targetCubes = [];

      const sourceSchemaNames = await this.source.getSchemaNames();
      const targetSchemaNames = await this.target.getSchemaNames();

      if (config.hasResources()) {
        for (const schemaName of sourceSchemaNames) {
          const resources = await this.source.resourceManager.enumerate(schemaName);
          sourceResources.push(...resources);
        }

        for (const schemaName of targetSchemaNames) {
          const resources = await this.target.resourceManager.enumerate(schemaName);
          targetResources.push(...resources);
        }
      }

      if (config.hasDashboards()) {
        for (const schemaName of sourceSchemaNames) {
          const dashboards = await this.source.dashletManager.enumerate(schemaName);
          sourceDashboards.push(...dashboards);
        }

        for (const schemaName of targetSchemaNames) {
          const dashboards = await this.target.dashletManager.enumerate(schemaName);
          targetDashboards.push(...dashboards);
        }
      }

      if (config.hasCubes()) {
        for (const schemaName of sourceSchemaNames) {
          const dashboards = await this.source.cubeManager.enumerate(schemaName);
          sourceCubes.push(...dashboards);
        }

        for (const schemaName of targetSchemaNames) {
          const dashboards = await this.target.cubeManager.enumerate(schemaName);
          sourceCubes.push(...dashboards);
        }
      }

      console.log(`SUCCESS: ${sourceResources.length} resources`);
      console.log(`SUCCESS: ${sourceDashboards.length} dashboards?dashlets?`);
      console.log(`SUCCESS: ${sourceCubes.length} cubes`);

      return {
        sourceResources, targetResources,
        sourceDashboards, targetDashboards,
        sourceCubes, targetCubes
      };
    } finally {
      spinner.stop();
    }
  }

  async _enumResources(platform) {
    const list = [];
    const schemaNames = await retryOnFail(() => platform.getSchemaNames());
    for (const schemaName of schemaNames) {
      const resources = await platform.getResources(schemaName);
      for (const resource of resources) {
        list.push(`/${schemaName}/${encodeURIComponent(resource)}`);
      }
    }
    list.sort();
    return list;
  }

  _handleError(err) {
    if (err.isAxiosError) {
      console.log(chalk.redBright('Network error'));
      if (err.response) {
        console.log('    ', err.response.config.method, err.response.config.url);
        console.log('    ', err.response.status, err.response.statusText);
        console.error(err.response.data);
      } else {
        console.error(err.stack);
      }
    } else {
      console.error(err);
    }
  }
}

module.exports = Commands;
