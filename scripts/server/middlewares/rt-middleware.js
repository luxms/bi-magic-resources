const WebSocket = require('ws');


const Text_Decoder = new TextDecoder();
const Text_Encoder = new TextEncoder();

const NATS_PROTOCOL_MESSAGES = {
  SUB: 'SUB',
  UNSUB: 'UNSUB',

  PING: 'PING',
  PONG: 'PONG',

  PUB: 'PUB',
  HPUB: 'HPUB',

  MSG: 'MSG',
  HMSG: 'HMSG',
};

const NATS_PROTOCOL = '\r\n';
const START_MESSAGE = 'INFO {"server_id":"NDMLATIAFFSCKBQV7RLKIAPNXFDVYPMGF26KXFAMXSKL7WZETVROTPTF","server_name":"luxmsbi-nats","version":"2.10.11","proto":1,"go":"go1.21.1","host":"::","port":3003,"headers":true,"auth_required":true,"max_payload":16777216,"jetstream":false,"client_id":51338,"client_ip":"127.0.0.1","xkey":"XDZD5ED7TKEEKUDNTQZWMJXBJ667J3YIMHO46YEXMSMMYKPUXG3FME4M"}';


class RtMiddleware {
  _wsServer;

  constructor(server) {
    // this._wsServer = new WebSocket.Server({server, autoPong: true, path: '/srv/bI/'});
    this._wsServer = new WebSocket.Server({noServer: true, autoPong: true, path: '/srv/bI/'});
    this._natsConnect();
  }

  _natsConnect = () => {
    this._wsServer.on('connection', wsConnection => {
      wsConnection._schemaSubscriptions = {}
      wsConnection._schemaSubscriptionsNatsSids = {}

      this._natsErrorHandler(wsConnection);
      this._natsCloseHandler(wsConnection);
      this._natsMessageHandler(wsConnection);

      this._natsSendMessage(START_MESSAGE, wsConnection);
    });
  }

  _natsCloseHandler = (wsConnection) => {
    wsConnection.on('close', (code) => {
      console.log('CLOSE CONNECTION', code);
    });
  };

  _natsErrorHandler(wsConnection) {
    wsConnection.on('error', console.error);
  }

  _natsSendMessage = (message, wsConnection) => {
    wsConnection.send(Text_Encoder.encode(message + NATS_PROTOCOL));
  }

  _natsSendMessageToAllClients = (message) => {
    this._wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) this._natsSendMessage(message, client);
    });
  }

  _natsMessageHandler = (wsConnection) => {
    wsConnection.on('message', (data) => {
      const message = Text_Decoder.decode(data)?.trim();
      const commandArray = message.split('\r\n').filter(Boolean);


      commandArray.forEach((message, index) => {
        const [command, subjectOrSid, sidOrBytes] = message.split(' ');
        const isPUB = command === NATS_PROTOCOL_MESSAGES.PUB;
        let data = [];

        if (!NATS_PROTOCOL_MESSAGES[command]) return;
        if (isPUB && !!commandArray[index + 1]) data = commandArray[index + 1];


        switch (command) {
          case NATS_PROTOCOL_MESSAGES.SUB:
            wsConnection._schemaSubscriptions[subjectOrSid] = sidOrBytes;
            wsConnection._schemaSubscriptionsNatsSids[sidOrBytes] = subjectOrSid;
            break;
          case NATS_PROTOCOL_MESSAGES.PUB:
            const subjectSid = wsConnection._schemaSubscriptions[subjectOrSid];
            const msgMessage = `${NATS_PROTOCOL_MESSAGES.MSG} ${subjectOrSid} ${subjectSid} ${sidOrBytes}` + NATS_PROTOCOL + data;

            this._natsSendMessageToAllClients(msgMessage);
            break;
          case NATS_PROTOCOL_MESSAGES.UNSUB:
            const subj = wsConnection._schemaSubscriptionsNatsSids[subjectOrSid];

            delete wsConnection._schemaSubscriptions[subj];
            delete wsConnection._schemaSubscriptionsNatsSids[subjectOrSid];
            break;
          case NATS_PROTOCOL_MESSAGES.PING:
            this._natsSendMessage(NATS_PROTOCOL_MESSAGES.PONG, wsConnection);
            break;
          default:
            console.log('Unknown message type');
        }
      });
    });
  }


  _notifySchemaBut(excludeConnectionId, schema_name, payload) {
    this._wsServer.clients.forEach((client) => {
      const subject = `bi.rt.${schema_name}`;
      if (!(subject in client._schemaSubscriptions)) return;
      if (client.readyState !== WebSocket.OPEN) return;

      const
        sid = client._schemaSubscriptions[subject],
        data = JSON.stringify(payload),
        bytes = Text_Encoder.encode(data).length,
        msgMessage = `${NATS_PROTOCOL_MESSAGES.MSG} ${subject} ${sid} ${bytes}` + NATS_PROTOCOL + data;

      this._natsSendMessage(msgMessage, client);
    });
  }

  publishSchemaMessage(schema_name, data) {
    this._notifySchemaBut(null, schema_name, data);
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
