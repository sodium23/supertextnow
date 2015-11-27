(function () {
    'use strict';
    define([
        'views/base',
        'text!templates/home.html'
    ], function (BaseView, template) {
        var textIndex = 0,
            counter = 0,
            sentences = ["Hello How Are you", "Wassip Man whasdasdas", "I am Hungry", "Blah Blah"],
            timeouts = [],
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
            }
        return BaseView.extend({
            template: _.template(template),
            className: 'section-cont home-cont f-h',
            events: {
                'click input': function () {
                    _.forEach(timeouts, clearTimeout);
                    this.$el.addClass('chat-activated');
                    this.jInput.val('');
                }
            },
            onRender: function () {
                var that = this;
                that.jInput = that.$('input');
                nextLetter.call(that);

            },
            onDestroy: function () {
                _.forEach(timeouts, clearTimeout);
                timeouts = [];
            }
        });
    });
})();
