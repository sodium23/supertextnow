(function () {
    'use strict';

    define([
        'backbone',
        'collections/base',
        'utils/layerSocket',
        'views/collection',
        'views/sections/home/chatMsg'
    ], function (Backbone, BaseCollection, LayerSocket, CollectionView, chatMsgView) {
        var Events = Backbone.Events,
            renderReply = function (msg) {
                var that = this,
                    userId;
                if (that.liveChatInitiated) {
                    //Handover chat to Layer
                } else {
                    if (that.hasAskedForID) {
                        userId = extractUserId(msg);
                        that.hasAskedForID = true;
                        setTimeout(function () {
                            addReply.call(that, userId ? 'Awesome, So whatsup?? '+userId : 'I didn\'t get it, Can you come again');
                        }, 1000);
                        userId && initiateLiveChat.call(that, userId);

                    } else {
                        setTimeout(function () {
                            addReply.call(that, 'Hey');
                        }, 500);
                        setTimeout(function () {
                            addReply.call(that, 'Can I have your email id? Promise wont spam');
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
            addReply = function (reply) {
                this.collection.add({
                    msg: reply,
                    dir: 'left'
                });
            },
            initiateLiveChat = function (userId) {
                var that = this;
                //                new LayerSocket(userId);
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
                CollectionView.prototype.initialize.call(that, options);
                that.listenTo(Events, 'msg:send', function (msg) {
                    that.collection.add({
                        msg: msg,
                        dir: 'right'
                    });
                    renderReply.call(that, msg);
                })
            }
        });

    });
})();
