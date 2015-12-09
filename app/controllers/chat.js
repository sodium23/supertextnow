(function () {
    'use strict';

    define([
        'backbone',
        'marionette',
        'cookie',
        'api/layer'
    ], function (Backbone, Marionette, Cookie, LayerApi) {
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
                        var d = $.Deferred();
                        LayerApi.logout().then(function () {
                            d.resolve(['You are logged out']);
                        });
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
                    return;
                }
                if (!ContextService.userIdentityRequest) {
                    ContextService.userIdentityRequest = true;
                    return ['Hey', 'Can I have your email id? Promise wont spam'];
                } else {
                    userId = isValidEmail(msg);
                    if (userId) {
                        //connect with chat
                        ContextService.chatConnectionInitiated = true;
                        reply = 'Awesome ' + userId;
                    } else {
                        reply = 'I didn\'t get it, Can you come again';
                        ContextService.chatConnectionInitiated && (reply = 'Hold on a sec.. setting up the stage');
                    }
                    return [reply];

                }
            },

            processMessage = function (msg) {
                var that = this,
                    parsedMsgObj = parseMsg(msg),
                    operation = Operations[parsedMsgObj.operation],
                    handlerReponse = operation && operation.handler.call(that, parsedMsgObj.data);
                
                !ContextService.chatConnected && Events.trigger('msg:render', msg, 'right');
                $.when(handlerReponse).done(function (responses) {
                    renderResponses.call(that, responses);
                    _.forEach(responses, function (response) {
                        console.log(response);
                    });
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
                _.forEach(responses, function (response) {
                    //Start typing
                    Events.trigger('typing', 'start');
                    setTimeout(function () {
                        //stopTyping
                        Events.trigger('typing');
                        //render Message
                        Events.trigger('msg:render', response, 'left');
                    }, response.length*100);
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
            }
        });
    });
})();
