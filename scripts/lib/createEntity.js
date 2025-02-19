async function createEntity(local, server, type, schema_name, topicId, dashboard_id, content) {
  if (!schema_name) {
    console.error('You have not typed schema_name');
    return;
  }

  const topicsId = await local.getTopicsId(schema_name);
  let res;
  switch (type) {
    case 'topic': {
      const id = await server.getId({ schemaName: schema_name });
      res = await local.createTopic({ schemaName: schema_name, id, content });
      console.log(chalk.green(`\nThe topic has been created with id=${id}`));
      return res;
    }
      break;
    case 'dashboard': {
      if (!topicId) topicId = topicsId[0];
      const id = await server.getId({ schemaName: schema_name, topicId });
      res = await local.createDashboard({ schemaName: schema_name, topicId, id, content });
      console.log(chalk.green(`\nThe dashboard has been created with id=${id}`));
      return res;
    }
      break;
    default: {
      if (!topicId) topicId = topicsId[0];
      if (!dashboard_id) dashboard_id = await server.getId({ schemaName: schema_name, topicId });
      const id = await server.getId({ schemaName: schema_name, topicId, dashboardId: dashboard_id });
      res = await local.createDashlet({ schemaName: schema_name, topicId, dashboardId: dashboard_id, id, content });
      console.log(chalk.green(`\nThe dashlet has been created with id=${id}`));
      return res;
    }
  }
}

module.exports = createEntity;
