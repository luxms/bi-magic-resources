const authMiddleware = require('./auth-middleware');
const { cubeMiddleware, dimensionMiddleware, dataMiddleware } = require('./cube-middleware');
const { dashboardMiddleware, dashletMiddleware } = require('./dashboard-middleware');
const RtMiddleware = require('./rt-middleware');
const RtMiddlewareRSocket = require('./rt-middleware-r-socket');

module.exports = {
  authMiddleware,
  cubeMiddleware,
  dimensionMiddleware,
  dataMiddleware,
  dashboardMiddleware,
  dashletMiddleware,
  RtMiddleware,
  RtMiddlewareRSocket,
};
