(function () {
    'use strict';
    define([
        'backbone',
        'views/base',
        'views/sections/home/chatContainer',
        'text!templates/home.html'
    ], function (Backbone, BaseView, ChatContainerView, template) {
        //Global Variables
        var Events = Backbone.Events,
            textIndex = 0,
            counter = 0,
            sentences = [
                "Hey I want a Biriyani",
                "Hey, can you get my laptop screen fixed",
                "Bring me a chocolate cake by 7:30pm",
                "My door's broken, need a carpenter"
            ],
            timeouts = [],
            isDay = (new Date()).getHours() > 7 && (new Date()).getHours() < 18,
            //Private Functions
            nextLetter = function () {
                var that = this,
                    text = sentences[counter],
                    jInput = that.jInput;
                if (textIndex <= text.length) {
                    jInput.val(text.substr(0, textIndex++) + '|');
                    timeouts.push(setTimeout(function () {
                        nextLetter.call(that);
                    }, 70));
                } else {
                    textIndex = 0;
                    counter = ++counter % sentences.length;
                    timeouts.push(setTimeout(function () {
                        nextLetter.call(that);
                    }, 1500));
                }
            };
        return BaseView.extend({
            template: _.template(template),
            className: 'section-cont home-cont f-h',
            events: {
                'click input': function () {
                    _.forEach(timeouts, clearTimeout);
                    this.$el.addClass('chat-activated');
                    this.jInput.val('');
                },
                'keyup input': function (e) {
                    var that = this,
                        jTarget = $(e.target),
                        msg = jTarget.val();
                    if (msg && e.keyCode == 13) {
                        Events.trigger('msg:send', msg);
                        jTarget.val('');
                        jTarget.attr('placeholder', 'Send a message');
                        that.jChatBox.scrollTop(that.jChatBox[0].scrollHeight);

                    }
                }
            },
            templateData: function () {
                return {
                    isDay: isDay,
                    fileName: isDay ? 'day': 'night'
                };
            },
            onRender: function () {
                var that = this;
                that.chatContainerView = new ChatContainerView();
                that.jInput = that.$('input');
                nextLetter.call(that);
                that.$('.chat-cont').html(that.chatContainerView.render().$el);
                that.jChatBox = that.$('.chat-msgs-box');

            },
            onDestroy: function () {
                _.forEach(timeouts, clearTimeout);
                timeouts = [];
                this.chatContainerView.destroy();
            }
        });
    });
})();
