(function () {
    'use strict';

    define([
        'backbone',
        'collections/base',
        'api/layer',
        'utils/layerSocket',
        'utils/sound',
        'views/collection',
        'views/sections/home/chatMsg',
        'controllers/chat'
    ], function (Backbone, BaseCollection, LayerAPI, LayerSocket, Sound, CollectionView, chatMsgView, ChatController) {
        var PAGE_SIZE = 10,
            CELL_HEIGHT = 43,
            newMessages = 0,
            Events = Backbone.Events,
            addMsg = function (msg, dir) {
                var that = this,
                    isUserFocused = $('input').is(':focus');

                this.collection.add({
                    msg: msg,
                    dir: dir || 'left'
                });

                if (dir === 'left' && !isUserFocused) {
                    Sound.playSound('NEW_MESSAGE');
                    Events.trigger('msg:unread:change');
                };

                isUserFocused && _.defer(function () {
                    that.$el.scrollTop(that.el.scrollHeight)
                });
            },
            addOlderMessages = function (messages) {
                var that = this,
                    processedMessages = _.map(messages, function (message) {
                        return {
                            msg: message.parts[0].body,
                            dir: (message.sender.user_id === 'supertext') ? 'left' : 'right',
                            id: message.id
                        }
                    });
                that.collection.add(processedMessages.reverse(), {
                    at: 0
                });
                that.$el.scrollTop(PAGE_SIZE * CELL_HEIGHT);
            };
        return CollectionView.extend({
            className: 'chat-msgs-box',
            childView: chatMsgView,
            liveChatInitiated: false,
            collection: new BaseCollection(),
            events: {
                'click .load-earlier': function () {
                    var that = this,
                        lastMsg = that.collection.at(0);
                    LayerAPI.loadMessages(lastMsg && lastMsg.get('id'), PAGE_SIZE).then(function (messages) {
                        if (messages.length < PAGE_SIZE) {
                            that.$('.load-earlier').remove();
                        }
                        addOlderMessages.call(that, messages)
                    });
                },
                'scroll': _.debounce(function (e) {
                    var jChatCont = this.$el;
                    (jChatCont.scrollTop() + jChatCont.height() >= jChatCont[0].scrollHeight - 70) && Events.trigger('msg:unread:change', 'reset');
                }, 300),
                'click': function(e){
                    this.chatController.onClickAction(e);
                }
            },
            initialize: function (options) {
                var that = this;
                CollectionView.prototype.initialize.call(that, options);
                that.chatController = new ChatController();
                that.listenTo(Events, 'msg:render', function (msg, dir) {
                    addMsg.call(that, msg, dir);
                });
                that.listenTo(Events, 'typing', function (operation) {
                    that.$el.toggleClass('typing', operation === 'start');
                });
                that.listenTo(Events, 'chat:connected', function () {
                    that.$el.prepend('<div class="load-earlier">Load Earlier messages</div>');
                });
                that.listenTo(Events, 'socket:message:create', function (msg) {
                    var dir = msg.isSelf ? 'right' : 'left';
                    _.forEach(msg.parts, function (part) {
                        addMsg.call(that, _.escape(part.body), dir);
                    });
                });
            }
        });

    });
})();
