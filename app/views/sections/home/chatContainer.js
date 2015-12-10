(function () {
    'use strict';

    define([
        'backbone',
        'collections/base',
        'utils/layerSocket',
        'utils/sound',
        'views/collection',
        'views/sections/home/chatMsg',
        'controllers/chat'
    ], function (Backbone, BaseCollection, LayerSocket, Sound, CollectionView, chatMsgView, ChatController) {
        var Events = Backbone.Events,
            addMsg = function (msg, dir) {
                dir === 'left' && Sound.playSound('NEW_MESSAGE');
                this.collection.add({
                    msg: msg,
                    dir: dir || 'left'
                });
            };
        return CollectionView.extend({
            className: 'chat-msgs-box',
            childView: chatMsgView,
            liveChatInitiated: false,
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
                that.chatController = new ChatController();
                that.listenTo(Events, 'msg:render', function(msg, dir){
                    addMsg.call(that, msg, dir);
                });
                that.listenTo(Events, 'typing', function(operation){
                    that.$el.toggleClass('typing', operation === 'start');
                });
                that.listenTo(Events, 'socket:message:create', function (msg) {
                    var dir = msg.isSelf ? 'right' : 'left';
                    _.forEach(msg.parts, function (part) {
                        addMsg.call(that, part.body, dir);
                    });
                });
            }
        });

    });
})();
