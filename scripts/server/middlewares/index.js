const authMiddleware = require('./auth-middleware');
const { cubeMiddleware, dimensionMiddleware, dataMiddleware } = require('./cube-middleware');
const { topicMiddleware, dashboardMiddleware, dashletMiddleware } = require('./dashboard-middleware');
const RtMiddleware = require('./rt-middleware');

module.exports = {
  authMiddleware,
  cubeMiddleware,
  dimensionMiddleware,
  dataMiddleware,
  topicMiddleware,
  dashboardMiddleware,
  dashletMiddleware,
  RtMiddleware,
};
