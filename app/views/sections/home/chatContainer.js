(function () {
    'use strict';

    define([
        'backbone',
        'collections/base',
        'utils/layerSocket',
        'utils/sound',
        'views/collection',
        'views/sections/home/chatMsg'
    ], function (Backbone, BaseCollection, LayerSocket, Sound, CollectionView, chatMsgView) {
        var Events = Backbone.Events,
            renderReply = function (msg) {
                var that = this,
                    userId;
                if (!that.liveChatInitiated) {
                    if (that.hasAskedForID) {
                        userId = extractUserId(msg);
                        that.hasAskedForID = true;
                        setTimeout(function () {
                            addMsg.call(that, userId ? 'Awesome, So whatsup?? ' + userId : 'I didn\'t get it, Can you come again');
                        }, 1000);
                        userId && initiateLiveChat.call(that, userId);

                    }
                    //Ask for ID if not yet asked
                    else {
                        setTimeout(function () {
                            addMsg.call(that, 'Hey');
                        }, 500);
                        setTimeout(function () {
                            addMsg.call(that, 'Can I have your email id? Promise wont spam');
                            that.hasAskedForID = true;
                        }, 2000);
                    }
                }
            },
            extractUserId = function (email) {
                //Create a validation service
                var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                email && (email = email.trim());
                return re.test(email) && email;
            },
            addMsg = function (msg, dir) {
                this.collection.add({
                    msg: msg,
                    dir: dir || 'left'
                });
            },
            initiateLiveChat = function (userId) {
                var that = this;
                new LayerSocket(userId);
                that.liveChatInitiated = true;
            };
        return CollectionView.extend({
            className: 'chat-msgs-box',
            childView: chatMsgView,
            liveChatInitiated: false,
            hasAskedForID: false,
            collection: new BaseCollection(),
            collectionEvents: {
                'add': function () {
                    var that = this;
                    _.defer(function () {
                        that.$el.scrollTop(that.el.scrollHeight)
                    });
                }
            },
            initialize: function (options) {
                var that = this;
                initiateLiveChat.call(that);
                CollectionView.prototype.initialize.call(that, options);
                that.listenTo(Events, 'msg:send', function (data) {
                    var msg = data.body;
                    !that.liveChatInitiated && addMsg.call(that, msg, 'right');
                    renderReply.call(that, msg);
                });
                that.listenTo(Events, 'socket:message:create', function (msg) {
                    var dir = msg.isSelf ? 'right' : 'left';
                    dir === 'left' && Sound.playSound('NEW_MESSAGE');
                    _.forEach(msg.parts, function (part) {
                        addMsg.call(that, part.body, dir);
                    });
                });
            }
        });

    });
})();
