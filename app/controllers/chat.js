(function () {
    'use strict';

    define([
        'backbone',
        'marionette',
        'cookie',
        'api/layer',
        'utils/layerSocket'
    ], function (Backbone, Marionette, Cookie, LayerApi, LayerSocket) {
        var Events = Backbone.Events,
            userId,
            ContextService = {
                chatConnected: false,
                chatConnectionInitiated: false,
                userIdentityRequest: false
            },
            Operations = {
                help: {
                    handler: function () {
                        return ['You can type /logout to logout'];
                    }
                },
                logout: {
                    handler: function () {
                        var d = $.Deferred(),
                            isLoggedin = !!Cookie.get('layer_token');
                        if (isLoggedin) {
                            LayerApi.logout().then(function () {
                                ContextService.chatConnected = false;
                                ContextService.chatConnectionInitiated = false;
                                ContextService.userIdentityRequest = false;
                                d.resolve(['You are logged out']);
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
                }
                if (!ContextService.userIdentityRequest) {
                    ContextService.userIdentityRequest = true;
                    return ['Hey', 'Can I have your email id? Promise wont spam'];
                } else {
                    userId = isValidEmail(msg);
                    if (!ContextService.chatConnectionInitiated && userId) {
                        //connect with chat
                        that.layerSocket = new LayerSocket({
                            userId: userId
                        });
                        ContextService.chatConnectionInitiated = true;
                        reply = ['Awesome', 'You can type /logout to logout anytime'];
                    } else {
                        reply = ['I didn\'t get it, Can you type your email again'];
                        ContextService.chatConnectionInitiated && (reply = 'Hold on a sec.. setting up the stage');
                    }
                    return reply;

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
                //Check if the input is a commant(starting with "/")
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
                    }, response.length * 50);
                });

            },

            isValidEmail = function (email) {
                //Create a validation service
                var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                email && (email = email.trim());
                return re.test(email) && email;
            };
        return Marionette.Controller.extend({
            initialize: function (options) {
                var that = this;
                that.listenTo(Events, 'msg:send', processMessage);
                that.listenTo(Events, 'chat:connected', function () {
                    ContextService.chatConnected = true;
                    renderResponses.call(that, ['So whatsup!!']);
                });
            }
        });
    });
})();
