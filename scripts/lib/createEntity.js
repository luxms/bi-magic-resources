const chalk = require('chalk');

async function createEntity(local, server, type, schemaName, topicId, dashboardId, content) {
  if (!schemaName) {
    console.error('You have not typed schema_name');
    return;
  }

  const topicsId = await local.dashboards.getTopicsId(schemaName);
  let res;

  switch (type) {
    case 'topic': {
      const id = await server.dashboards.getId({ schemaName });
      res = await local.dashboards.createTopic({ schemaName, id, content });
      console.log(chalk.green(`\nThe topic has been created with id=${id}`));
      return res;
    }
    case 'dashboard': {
      if (!topicId) topicId = topicsId[0];
      const id = await server.dashboards.getId({ schemaName, topicId });
      res = await local.dashboards.createDashboard({ schemaName, topicId, id, content });
      console.log(chalk.green(`\nThe dashboard has been created with id=${id}`));
      return res;
    }
    default: {
      if (!topicId) topicId = topicsId[0];
      if (!dashboardId) dashboardId = await server.dashboards.getId({ schemaName, topicId });
      const id = await server.dashboards.getId({ schemaName, topicId, dashboardId });
      res = await local.dashboards.createDashlet({ schemaName, topicId, dashboardId, id, content });
      console.log(chalk.green(`\nThe dashlet has been created with id=${id}`));
      return res;
    }
  }
}

module.exports = createEntity;
