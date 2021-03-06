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
            CELL_HEIGHT = 41,
            newMessages = 0,
            Events = Backbone.Events,
            addMsg = function (msg, dir, id) {
                var that = this,
                    isUserFocused = $('#chat-input').is(':focus');

                this.collection.add({
                    msg: msg,
                    dir: dir || 'left',
                    id: id
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
                        var isAgentMsg = message.sender.user_id === 'supertext';
                        return {
                            msg: sanitizeMessage(message.parts[0].body, isAgentMsg),
                            dir: isAgentMsg ? 'left' : 'right',
                            id: message.id
                        }
                    });
                that.collection.add(processedMessages.reverse(), {
                    at: 0
                });
                that.$el.scrollTop(processedMessages.length * CELL_HEIGHT);
            },
            sanitizeMessage = function (msg, isAgentMsg) {
                if (isAgentMsg) {
                    if (msg === 'Ask For Authentication') {
                        msg = 'Login Requested'
                    }
                }
                return _.escape(msg);
            },
            onClickLoadEarlier = function () {
                var that = this,
                    lastMsg = that.collection.at(0),
                    jLoadEarlier = $('.load-earlier');
                return LayerAPI.loadMessages(lastMsg && lastMsg.get('id'), PAGE_SIZE).then(function (messages) {
                    jLoadEarlier.removeClass('hide');
                    if (messages.length < PAGE_SIZE) {
                        jLoadEarlier.remove();
                    }
                    addOlderMessages.call(that, messages)
                });
            };
        return CollectionView.extend({
            className: 'chat-msgs-box',
            childView: chatMsgView,
            liveChatInitiated: false,
            collection: new BaseCollection(),
            events: {
                'click .load-earlier': onClickLoadEarlier,
                'scroll': _.debounce(function (e) {
                    var jChatCont = this.$el;
                    (jChatCont.scrollTop() + jChatCont.height() >= jChatCont[0].scrollHeight - 70) && Events.trigger('msg:unread:change', 'reset');
                }, 300),
                'click': function (e) {
                    this.chatController.onClickAction(e);
                }
            },
            initialize: function (options) {
                var that = this;
                CollectionView.prototype.initialize.call(that, options);
                that.chatController = new ChatController();
                that.listenTo(Events, 'msg:render', function (msg, dir, id) {
                    addMsg.call(that, msg, dir, id);
                });
                that.listenTo(Events, 'typing', function (operation) {
                    that.$el.toggleClass('typing', operation === 'start');
                });
                that.listenTo(Events, 'chat:connected', function () {
                    that.$('.load-earlier').remove();
                    that.$el.prepend('<div class="load-earlier hide">Load Earlier messages</div>');
                    onClickLoadEarlier.call(that);
                });
                that.listenTo(Events, 'msg:clear', function () {
                    that.collection.reset();
                });
                Events.trigger('chat:initialized');
            }
        });

    });
})();
