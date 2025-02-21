const RSocketWebsocketServer = require('rsocket-websocket-server').default;
const {RSocketServer, BufferEncoders} = require('rsocket-core');
const {getService, getMethod} = require("rsocket-rpc-frames");
const {RequestHandlingRSocket} = require('rsocket-rpc-core');
const {Flowable} = require('rsocket-flowable');

const APP = 'com.luxms.bi.rt';

class RtMiddleware {
  constructor(server) {
    const transportOpts = {server: server, path: '/srv/rt/'};
    const transport = new RSocketWebsocketServer(transportOpts, BufferEncoders);

    const serverConfig = {
      getRequestHandler: this._getRequestHandler,
      // serializers: JsonSerializers,
      transport,
      setup: {
        keepAlive: 60000,                                                                         // ms btw sending keepalive to server
        lifetime: 180000,                                                                         // ms timeout if no keepalive response
        dataMimeType: 'application/json',                                                         // format of `data`
        // metadataMimeType: 'application/json',                                                     // format of `metadata`
        metadataMimeType: 'message/x.rsocket.routing.v0',
      },
      errorHandler: (error) => {
        console.error('[realtime  ] Server: error', error);
      },
    };
    const rSocketServer = new RSocketServer(serverConfig);
    rSocketServer.start();
  }

  _schemaSubscriptions = {};

  _addSchemaSubscription = (schema_name, connectionId, callback) => {
    if (!(schema_name in this._schemaSubscriptions)) {
      this._schemaSubscriptions[schema_name] = [];
      console.log(`[realtime  ] Creating first subscription on ${schema_name}`);
      // this._options.subscribeSchema(schema_name);
    }
    let schemaSubscription = {
      dispose: () => {
        console.log(`[realtime  ] Disposing ${schema_name} subscription`);
        if (!(schema_name in this._schemaSubscriptions)) return;
        let idx = this._schemaSubscriptions[schema_name].indexOf(schemaSubscription);
        if (idx !== -1) {
          this._schemaSubscriptions[schema_name].splice(idx, 1);
        }
        if (this._schemaSubscriptions[schema_name].length === 0) {
          console.log(`[realtime  ] No more subscriptions on ${schema_name}`);
          delete this._schemaSubscriptions[schema_name];
          // this._options.unsubscribeSchema(schema_name);
        }
      },
      connectionId,
      callback,
    };
    this._schemaSubscriptions[schema_name].push(schemaSubscription);

    console.log(`[realtime  ] Now ${this._schemaSubscriptions[schema_name].length} subscriptions on ${schema_name}`);
    return schemaSubscription;
  }


  connectionsCount = 0;

  _getRequestHandler = () => {
    const connectionId = ++this.connectionsCount;
    const service = new RequestHandlingRSocket();
    service.addService(APP, {
      fireAndForget: (frame) => {
        const {metadata, data} = frame;
        const service = getService(metadata), method = getMethod(metadata);
        const body = JSON.parse(String(data));
        console.log('[realtime  ] fireAndForget, service=', service, ' method=', method);
      },
      requestResponse: (frame) => {
        console.log('[realtime  ] requestResponse');
      },
      requestStream: (frame) => {
        const {metadata, data} = frame;
        const service = getService(metadata), method = getMethod(metadata);
        console.log('[realtime  ] requestStream', service, method);

        let rSubscriber = null;
        let schemaSubscription = this._addSchemaSubscription(method, connectionId, message => {
          if (rSubscriber === null) {
            // Maybe error?!
            return;
          }
          rSubscriber.onNext({
            data: Buffer.from(JSON.stringify(message)),
          });
          // rSubscriber.onComplete();
        });

        return new Flowable(subscriber => {
          subscriber.onSubscribe({
            request: n => {
              rSubscriber = subscriber;
            },
            cancel: () => {
              schemaSubscription.dispose();
              schemaSubscription = null;
            }
          });
        });

      },
      requestChannel: (payloads) => {
        console.log('[realtime  ] requestChannel');
      },
      metadataPush: (payload) => {
        console.log('[realtime  ] metadataPush');
      }
    });

    return service;
  }

  _notifySchemaBut(excludeConnectionId, schema_name, payload) {
    if (!(schema_name in this._schemaSubscriptions)) return;
    const subscriptions = this._schemaSubscriptions[schema_name];
    for (let s of subscriptions) {
      if (s.connectionId !== excludeConnectionId) {
        try {
          s.callback(payload);
        } catch (err) {
          console.log('[realtime  ] Error notifying', err);
        }
      }
    }
  }

  publishSchemaMessage(schema_name, data) {
    this._notifySchemaBut(null, schema_name, data);
  }

  deleteResources(schema_name, resources) {
    if (!resources.length) return;
    // TODO
  }

  addResources(schema_name, resources) {
    if (!resources.length) return;
    // console.log('addResources', schema_name, resources);
    this.publishSchemaMessage(schema_name, resources.map(resource => ({
      type: 'ADD_RESOURCES',
      payload: resource,
    })));
  }

  modifyResources(schema_name, resources) {
    if (!resources.length) return;
    // console.log('modifyResources', schema_name, resources);
    this.publishSchemaMessage(schema_name, resources.map(resource => ({
      type: 'ADD_RESOURCES',
      payload: resource,
    })));
  }
}

module.exports = RtMiddleware;
