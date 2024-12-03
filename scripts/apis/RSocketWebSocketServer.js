/** Copyright (c) Facebook, Inc. and its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 */

/**
 *  [EP} скопировал из библиотеки и вытащил наружу ws.Server объект
 *
 */

'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.default = void 0;

var _events = _interopRequireDefault(require('events'));
var _ws = _interopRequireDefault(require('ws'));
var _rsocketFlowable = require('rsocket-flowable');
var _rsocketCore = require('rsocket-core');
var _rsocketTypes = require('rsocket-types');
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

/**
 * A WebSocket transport server.
 */
class RSocketWebSocketServer {
  server;

  constructor(_options, encoders, factory) {
    _defineProperty(
      this,
      '_factory',
      (options) => new _ws.default.Server(options)
    );
    this._emitter = new _events.default();
    this._encoders = encoders;
    this._options = _options;
    if (factory) {
      this._factory = factory;
    }

    // [EP] сразу создаю
    this.server = this._factory(this._options);
  }

  start() {
    return new _rsocketFlowable.Flowable((subscriber) => {
      const onClose = () => {
        if (this.server) {
          this.server.stop();
        }
        subscriber.onComplete();
      };
      const onError = (error) => subscriber.onError(error);
      const onConnection = (socket) => {
        subscriber.onNext(new WSDuplexConnection(socket, this._encoders));
      };
      subscriber.onSubscribe({
        cancel: () => {
          if (!this.server) {
            return;
          }
          this.server.removeListener('connection', onConnection);
          this.server.removeListener('error', onError);
          this._emitter.removeListener('close', onClose);
          this.server.close();
          this.server = null;
        },
        request: (n) => {
          // if (!this.server) {
          //   this.server = this._factory(this._options);
            this.server.on('connection', onConnection);
            this.server.on('error', onError);
            this._emitter.on('close', onClose);
          // }
        },
      });
    });
  }

  stop() {
    this._emitter.emit('close');
  }
}

/**
 * @private
 */ exports.default = RSocketWebSocketServer;
class WSDuplexConnection {
  constructor(socket, encoders) {
    this._active = true;
    this._encoders = encoders;
    this._socket = socket;
    this._statusSubscribers = new Set();

    if (socket) {
      this._status = _rsocketTypes.CONNECTION_STATUS.CONNECTED;
    } else {
      this._status = _rsocketTypes.CONNECTION_STATUS.NOT_CONNECTED;
    }

    // If _receiver has been `subscribe()`-ed already
    let isSubscribed = false;
    this._receiver = new _rsocketFlowable.Flowable((subscriber) => {
      if (isSubscribed) {
        throw new Error(
          'RSocketWebSocketServer: Multicast receive() is not supported. Be sure ' +
          'to receive/subscribe only once.'
        );
      }
      isSubscribed = true;

      // Whether `request()` has been called.
      let initialized = false;
      const closeSocket = () => {
        if (!initialized) {
          return;
        }
        this._socket.removeListener('close', onSocketClosed);
        this._socket.removeListener('error', onSocketError);
        this._socket.removeListener('message', onMessage);
        this._socket.close();
      };
      const onSocketClosed = () => {
        closeSocket();
        subscriber.onError(
          new Error('RSocketWebSocketServer: Socket closed unexpectedly.')
        );

        this._setConnectionStatus(_rsocketTypes.CONNECTION_STATUS.CLOSED);
      };
      const onSocketError = (error) => {
        closeSocket();
        subscriber.onError(error);
        const status = error
          ? {error, kind: 'ERROR'}
          : _rsocketTypes.CONNECTION_STATUS.CLOSED;
        this._setConnectionStatus(status);
      };
      const onMessage = (data) => {
        try {
          const frame = this._readFrame(data);
          subscriber.onNext(frame);
        } catch (error) {
          closeSocket();
          subscriber.onError(error);
        }
      };

      subscriber.onSubscribe({
        cancel: closeSocket,
        request: () => {
          if (initialized) {
            return;
          }
          initialized = true;
          this._socket.on('close', onSocketClosed);
          this._socket.on('error', onSocketError);
          this._socket.on('message', onMessage);
        },
      });
    });
  }

  connect() {
    throw new Error('not supported');
  }

  connectionStatus() {
    return new _rsocketFlowable.Flowable((subscriber) => {
      subscriber.onSubscribe({
        cancel: () => {
          this._statusSubscribers.delete(subscriber);
        },
        request: () => {
          this._statusSubscribers.add(subscriber);
          subscriber.onNext(this._status);
        },
      });
    });
  }

  receive() {
    return this._receiver;
  }

  sendOne(frame) {
    this._writeFrame(frame);
  }

  send(frames) {
    frames.subscribe({
      onError: (error) => this._handleError(error),
      onNext: (frame) => this._writeFrame(frame),
      onSubscribe(subscription) {
        subscription.request(Number.MAX_SAFE_INTEGER);
      },
    });
  }

  close() {
    this._socket.emit('close');
    this._socket.close();
  }

  _readFrame(buffer) {
    return (0, _rsocketCore.deserializeFrame)(buffer, this._encoders);
  }

  _writeFrame(frame) {
    try {
      const buffer = (0, _rsocketCore.serializeFrame)(frame, this._encoders);
      this._socket.send(buffer);
    } catch (error) {
      this._handleError(error);
    }
  }

  _handleError(error) {
    this._socket.emit('error', error);
  }

  _setConnectionStatus(status) {
    this._status = status;
    this._statusSubscribers.forEach((subscriber) => subscriber.onNext(status));
  }
}
