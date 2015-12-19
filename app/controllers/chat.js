(function (W, U) {
    'use strict';

    define([
        'backbone',
        'marionette',
        'api/layer',
        'utils/dialog',
        'api/supercenter',
        'utils/layerSocket',
        'views/sections/login'
    ], function (Backbone, Marionette, LayerAPI, Dialog, SupercenterAPI, LayerSocket, LoginView) {
        var Events = Backbone.Events,
            userId,
            messageCache = [],
            ContextService = {
                chatConnected: false,
                chatInitialized: false
            },
            Operations = {
                help: {
                    handler: function () {
                        return ['You can type /logout to logout'];
                    }
                },
                logout: {
                    handler: function () {
                        var that = this,
                            d = $.Deferred();
                        if (ContextService.chatConnected) {
                            LayerAPI.logout().then(function () {
                                ContextService.chatConnected = false;
                                ContextService.chatInitialized = false;
                                that.layerSocket.destroy();
                                d.resolve(['You are logged out']);
                                SupercenterAPI.logout();
                            });
                        } else {
                            d.resolve(['You are not logged in', 'Enter your email to login']);
                        }
                        return d;
                    }
                },
                text: {
                    handler: function (data) {
                        return getResponse.call(this, data)
                    }
                },
                //Add Theme specific handling here
                activate: {
                    handler: function () {
                        var that = this,
                            d = $.Deferred();
                        !ContextService.chatInitialized && SupercenterAPI.registerUser({
                            error: function () {
                                d.resolve(['Oops!', 'Seems like we are out of magic powder', 'Please try again later']);
                            }
                        }).then(function () {
                            d.resolve();
                        });
                        return d;
                    },
                    events: {
                        login: function () {
                            var that = this;
                            processMessage.call(that, '/login');
                        }
                    }
                },
                login: {
                    handler: function () {
                        return ['<button class="login-btn" data-action="openLoginDialog" data-handler="login">Login/Signup</button>'];
                    },
                    events: {
                        openLoginDialog: function () {
                            Dialog.show(new LoginView());
                        }
                    }
                }
            },

            initializeSocket = function (userId, layerToken) {
                var that = this;
                ContextService.chatInitialized = true;
                that.layerSocket = new LayerSocket({
                    userId: userId,
                    sessionToken: layerToken
                });
            },

            connectLayerSocket = function (userId, layerToken) {
                var that = this;
                if (that.layerSocket) {
                    that.layerSocket.resetSocket().then(function () {
                        initializeSocket.call(that, userId, layerToken);
                        that.layerSocket = U;
                    });
                } else {
                    initializeSocket.call(that, userId, layerToken);
                }

            },

            getResponse = function (data) {
                var that = this,
                    msg = data[0],
                    reply;
                if (ContextService.chatConnected) {
                    //Send to layer
                    Events.trigger('layer:send', msg);
                    return;
                } else {
                    messageCache.push(msg);
                }
            },

            processMessage = function (msg) {
                var that = this,
                    parsedMsgObj = parseMsg(msg),
                    operationName = parsedMsgObj.operation,
                    operation = Operations[operationName],
                    handlerReponse = operation && operation.handler.call(that, parsedMsgObj.data);

                operationName === 'text' && !ContextService.chatConnected && Events.trigger('msg:render', msg, 'right');
                $.when(handlerReponse).done(function (responses) {
                    !_.isEmpty(responses) && renderResponses.call(that, responses);
                });
            },

            parseMsg = function (msg) {
                var operation = 'text',
                    data = [msg],
                    tokens;
                //Check if the input is a command(starting with "/")
                if (msg.charAt(0) === '/') {
                    tokens = msg.split('/')[1].split(' ');
                    operation = tokens[0];
                    data = tokens.slice(1);
                }
                return {
                    operation: operation,
                    data: data
                }
            },

            renderResponses = function (responses) {
                //Start typing
                Events.trigger('typing', 'start');
                _.forEach(responses, function (response, key) {
                    setTimeout(function () {
                        //stopTyping
                        (key === responses.length - 1) && Events.trigger('typing', 'stop');
                        //render Message
                        Events.trigger('msg:render', response, 'left');
                    }, getTypingTime(response));
                });

            },

            getTypingTime = function (msg) {
                var tmpDiv = $('<div/>').html(msg),
                    sanitisedMsg = tmpDiv.text();
                //                console.log(sanitisedMsg);
                return sanitisedMsg.length * 50;
            },

            isValidEmail = function (email) {
                //Create a validation service
                var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                email && (email = email.trim());
                return re.test(email) && email;
            },
            sanitizeMsg = function(text, isAgentMsg){
                var msg;
                if(isAgentMsg){
                    if(text === 'Ask For Authentication'){
                        Events.trigger('msg:send', '/login');
                        return;
                    }
                    msg = _.escape(text);
                }else{
                    msg = _.escape(text);
                }
                return msg;
            };
        return Marionette.Controller.extend({
            initialize: function (options) {
                var that = this;
                that.listenTo(Events, 'msg:send', processMessage);
                that.listenTo(Events, 'user:logged-in', function (data) {
                    ContextService.chatConnected = false;
                    ContextService.chatInitialized = false;
                    connectLayerSocket.call(that, data.lUId, data.lSTkn);
                });
                that.listenTo(Events, 'user:load:session', function(data){
                    connectLayerSocket.call(that, data.id, data.token);
                });
                that.listenTo(Events, 'chat:connected', function () {
                    $('#workspace').removeClass('loading');
                    ContextService.chatConnected = true;
                    Events.trigger('msg:clear');
                    _.forEach(messageCache, function (msg) {
                        Events.trigger('layer:send', msg);
                    });
                    messageCache = [];
                });
                that.listenTo(Events, 'user:logout', function () {
                    $.when(that.layerSocket && that.layerSocket.resetSocket()).always(function(){
                        SupercenterAPI.logout();
                    });
                });
                that.listenTo(Events, 'socket:message:create', function(msg){
                    var isAgentMsg = !msg.isSelf,
                    dir = !isAgentMsg ? 'right' : 'left';
                    _.forEach(msg.parts, function (part) {
                        var processedMsg = sanitizeMsg.call(that, part.body, isAgentMsg);
                        processedMsg && Events.trigger('msg:render', processedMsg, dir, msg.id);
                    });
                });
            },

            onClickAction: function (e) {
                var that = this,
                    jTarget = $(e.target),
                    action = jTarget.data('action'),
                    handler = jTarget.data('handler');
                if (action && handler) {
                    Operations[handler].events[action].call(that);
                }
            }
        });
    });
})(window);
