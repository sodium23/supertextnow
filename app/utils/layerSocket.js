(function (W, D) {
    'use strict';
    define([
        'backbone',
        'marionette',
        'api/layer',
        'cookie'
    ], function (Backbone, Marionette, LayerAPI, Cookie) {
        var USER_ID = 'vipul_web',
            Events = Backbone.Events,
            initiateAuthentication = function () {
                var that = this;
                _.forEach(that.timeouts, clearTimeout);
                LayerAPI.getNonce()

                // Use the nonce to get an identity token
                .then(function (nonce) {
                    return LayerAPI.getIdentityToken(nonce, USER_ID);
                })

                // Use the identity token to get a session
                .then(function (identityToken) {
                    return LayerAPI.getSession(identityToken);
                })

                .then(_.bind(createSocketConnection, that));
            },
            createSocketConnection = function (sessionToken) {
                var that = this,
                    socket = new WebSocket('wss://api.layer.com/websocket?session_token=' + sessionToken, 'layer-1.0');
                socket.onerror = function (e) {
                    Cookie.remove('layer_socket');
                    initiateAuthentication.call(that);
                };
                waitForSocketConnection.call(this, socket, onSocketConnection);
            },

            waitForSocketConnection = function (socket, callback) {
                var that = this;
                that.timeouts.push(setTimeout(
                    function () {
                        if (socket.readyState === 1) {
                            console.log("Chat Connected")
                            if (callback != null) {
                                callback.call(that, socket);
                            }
                            return;

                        } else {
                            console.log("Connecting to Chat..");
                            waitForSocketConnection.call(that, socket, callback);
                        }

                    }, 500)); // wait 500 milisecond for the connection...
            },

            onSocketConnection = function (socket) {
                socket.addEventListener('message', onMessage);
                Events.trigger('socket:connected');
            },
            /*  Websocket Message Handler */
            onMessage = function (event) {
                var msg = JSON.parse(event.data),
                    body = msg.body;
                switch (msg.type) {
                    case "change":
                        handleChange(body);
                        break;
                    case "request":
                        handleRequest(body);
                        break;
                    case "response":
                        handleResponse(body);
                        break;
                    case "signal":
                        handleSignal(body);
                        break;
                    default:
                        console.log('Unidentified message type');
                        break;
                }
            },
            /*  Change Event Handler */
            handleChange = function (msg) {
                //Events are also recieved for operations done by self
                var changeObjectType = msg.object.type.toLowerCase(),
                    operation = msg.operation;
                //Cache Operation
                switch (operation) {
                    case 'create':
                        //add to cache
                        break;
                    case 'delete':
                        //destroy flag in data determines if deletion is local or global
                        //delete from cache
                        break;
                    case 'update':
                        //update in cache
                        break;
                    default:
                        console.log('Invalid Change Response');
                        return;
                        break;
                }
                //Trigger Event
                Events.trigger('socket:' + changeObjectType + ':' + operation, msg.data);
                console.log(msg.data);
            },
            /*  Request Event Handler */
            handleRequest = function (msg) {},
            /*  Response Event Handler */
            handleResponse = function (msg) {

            },
            /*  Signal Event Handler */
            handleSignal = function (msg) {}

        return Marionette.Object.extend({
            timeouts: [],
            initialize: function () {
                var that = this,
                    sessionToken = Cookie.get('layer_token');
                if (false && sessionToken) {
                    createSocketConnection.call(that, sessionToken);
                } else {
                    initiateAuthentication.call(that);
                }
            }
        });
    });
})(window, document)
