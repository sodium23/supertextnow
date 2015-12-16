(function (W) {
    'use strict';

    define([
        'backbone',
        'marionette',
        'cookie',
        'api/layer',
        'api/supercenter',
        'utils/layerSocket'
    ], function (Backbone, Marionette, Cookie, LayerAPI, SupercenterAPI, LayerSocket) {
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
                        var that = this,
                            d = $.Deferred();
                        if (ContextService.chatConnected) {
                            LayerAPI.logout().then(function () {
                                ContextService.chatConnected = false;
                                ContextService.chatConnectionInitiated = false;
                                ContextService.userIdentityRequest = false;
                                that.layerSocket.destroy();
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
                },
                activate: {
                    handler: function () {
                        var that = this,
                            d = $.Deferred();
                        SupercenterAPI.registerUser().then(function (response) {
                            var userId = response.customerId,
                                layerToken = response.layerToken;
                            //connect with chat
                            that.layerSocket = new LayerSocket({
                                userId: userId,
                                sessionToken: layerToken
                            });
                            that.listenTo(Events, 'chat:connected', function(){
                                d.resolve(['Connected to chat']);
                            });
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
                        return ['<button class="fb" data-action="fbLogin" data-handler="login">Facebook</button><button class="gplus" data-action="googleLogin" data-handler="login">Google</button>'];
                    },
                    events: {
                        fbLogin: function () {
                            var that = this;
                            openChildWindow('facebook');
                        },
                        googleLogin: function () {
                            var that = this;
                            openChildWindow('google');
                        }
                    }
                }
            },

            openChildWindow = function (param) {
                W.open('signIn.html#' + param, 'social sign-in', 'height=550,width=700,status=yes,toolbar=no,menubar=no,location=no');
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
                    return ['Can I have your email id?'];
                } else {
                    userId = isValidEmail(msg);
                    if (!ContextService.chatConnectionInitiated && userId) {
                        ContextService.chatConnectionInitiated = true;
                        reply = ['Connecting you with our wizard'];
                    } else {
                        reply = ['I didn\'t get it, Can you type your email again'];
                        ContextService.chatConnectionInitiated && (reply = ['Hold on a sec.. setting up the stage']);
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
            onSocialLogin = function (query) {
                var channel = 'facebook';
                query && SupercenterAPI.login(channel, query);
            };
        return Marionette.Controller.extend({
            initialize: function (options) {
                var that = this;
                that.listenTo(Events, 'msg:send', processMessage);
                that.listenTo(Events, 'chat:connected', function () {
                    ContextService.chatConnected = true;
                    ContextService.chatConnectionInitiated = true;
                    renderResponses.call(that, ['All set. Connected with wizard!', 'Type /logout to logout anytime']);
                });
                W.onSocialLogin = function (queryString) {
                    console.log('Initialize Login process with supercenter with query: ' + queryString);
                    onSocialLogin(queryString);
                }
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
