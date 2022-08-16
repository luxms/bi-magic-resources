const WebSocketServer = require('websocket').server;
const BaseServer = require('webpack-dev-server/lib/servers/BaseServer');
const ws = require('ws');

module.exports = class CustomServer extends BaseServer {

  constructor(server) {
    super(server);
    this.wsServer = new ws.Server({
      noServer: true,
      // path: '/srv/rt',
      path: this.server.sockPath,
    });

    this.server.listeningApp.on('upgrade', (req, sock, head) => {
      console.log('UPGRADE');
      if (!this.wsServer.shouldHandle(req)) {
        console.log('Should NOT handle', req.url);
        return;
      }

      this.wsServer.handleUpgrade(req, sock, head, (connection) => {
        this.wsServer.emit('connection', connection, req);
      });
    });

    this.wsServer.on('error', (err) => {
      console.log('error', err);
      this.server.log.error(err.message);
    });

    const noop = () => {};

    setInterval(() => {
      this.wsServer.clients.forEach((socket) => {
        if (socket.isAlive === false) {
          return socket.terminate();
        }

        socket.isAlive = false;
        socket.ping(noop);
      });
    }, this.server.heartbeatInterval);

    const addHooks = (compiler) => {
      const { compile, invalid, done } = compiler.hooks;

      done.tap('webpack-dev-server', (stats) => {
        // console.log('Done HOOK');
      });
    };


    if (server.compiler.compilers) {
      server.compiler.compilers.forEach(addHooks);
    } else {
      addHooks(server.compiler);
    }

  }

  send(connection, message) {
    console.log('SEND', message);
    // prevent cases where the server is trying to send data while connection is closing
    if (connection.readyState !== 1) {
      return;
    }

    connection.send(message);
  }

  close(connection) {
    connection.close();
  }

  // f should be passed the resulting connection and the connection headers
  onConnection(f) {
    this.wsServer.on('connection', (connection, req) => {
      console.log('NEW CONNECTION');
      connection.isAlive = true;
      connection.on('pong', () => {
        connection.isAlive = true;
      });
      f(connection, req.headers);
    });
  }

  onConnectionClose(connection, f) {
    console.log('CLOSE CONNECTION');
    connection.on('close', f);
  }
};
