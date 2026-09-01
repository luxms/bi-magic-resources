const ENTITY_TYPES = {
  topic: {upsert: 'ADD_DASHBOARD_TOPICS', delete: 'DELETE_DASHBOARD_TOPICS'},
  dashboard: {upsert: 'ADD_DASHBOARDS', delete: 'DELETE_DASHBOARDS'},
  dashlet: {upsert: 'ADD_DASHLETS', delete: 'DELETE_DASHLETS'},
};

function parseDashboardPath(relativePath) {
  const [schema, topicSegment, ...rest] = relativePath.replace(/\\/g, '/').split('/');
  if (!schema || !topicSegment || !topicSegment.startsWith('topic.')) return null;

  const topicId = Number(topicSegment.slice(6));
  if (!Number.isInteger(topicId)) return null;

  if (rest.length === 1 && rest[0] === 'index.json') {
    return {kind: 'topic', schema, id: topicId};
  }

  if (rest.length !== 2 || !rest[0].startsWith('dashboard.')) return null;

  const dashboardId = Number(rest[0].slice(10));
  if (!Number.isInteger(dashboardId)) return null;

  if (rest[1] === 'index.json') {
    return {kind: 'dashboard', schema, id: dashboardId, topic_id: topicId};
  }

  const dashletMatch = rest[1].match(/^(\d+)\.json$/);
  if (!dashletMatch) return null;

  return {
    kind: 'dashlet',
    schema,
    id: Number(dashletMatch[1]),
    dashboard_id: dashboardId,
  };
}

function unpackDashlet(dashlet) {
  return {
    ...dashlet,
    config: {
      ...dashlet.config,
      title: dashlet.title,
      description: dashlet.description,
      view_class: dashlet.view_class,
    },
  };
}

function makeDashboardRtMessage(event, parsed, content) {
  const isDelete = event === 'unlink';
  let payload = {id: parsed.id};

  if (parsed.topic_id !== undefined) payload.topic_id = parsed.topic_id;
  if (parsed.dashboard_id !== undefined) payload.dashboard_id = parsed.dashboard_id;

  if (!isDelete) {
    payload = {...content, ...payload};
    if (parsed.kind === 'dashlet') payload = unpackDashlet(payload);
  }

  const types = ENTITY_TYPES[parsed.kind];
  return [{type: isDelete ? types.delete : types.upsert, payload}];
}

module.exports = {
  makeDashboardRtMessage,
  parseDashboardPath,
  unpackDashlet,
};
