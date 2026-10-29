const auth = require('./lib/auth');
const transferDist = require('./lib/transfer-dist');

auth.init(() => transferDist('pull'));
