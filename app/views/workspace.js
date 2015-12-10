(function (W) {
    'use strict';

    define([
        'backbone',
        'views/layout',
        'controllers/app',
        'routers/app',
        'views/contentViews/slide',
        'text!templates/appWorkspace.html'
    ], function (Backbone, LayoutView, Controller, Router, SlideView, template) {
        var Events = Backbone.Events,
            DEFAULT_TAB = 'home',

            setContentView = function () {
                var that = this,
                    hashArray = W.location.hash.split('#'),
                    length = hashArray.length - 1,
                    tab = (hashArray && hashArray[length]),
                    contentView;

                if (!(hashArray && hashArray[length])) {
//                    tab = DEFAULT_TAB;
                    W.location.hash = DEFAULT_TAB;
                }
//                that.contentView = contentView = that.controller.getView(tab);
//                contentView && that.showChildView('content', contentView);
                this.$el.removeClass('info-open');
                Events.trigger('tab:rendered', tab);
            },
            openSlideView = function (tab) {
                this.$el.addClass('info-open');
                Events.trigger('info:tab:change', tab);
            };

        return LayoutView.extend({
            el: '#workspace',
            regions: {
                slide: {
                    selector: '#slide',
                    regionView: SlideView
                },
                content: {
                    selector: '#content'
                }
            },
            template: template,

            initialize: function (options) {
                var that = this,
                    controller;

                LayoutView.prototype.initialize.call(that, options);

                that.router = new Router({
                    controller: that.controller = new Controller()
                });
                that.infoView = new SlideView();

                that.listenTo(Events, 'tab:change', setContentView);
                that.listenTo(Events, 'info:open', openSlideView);
            },

            onRender: function () {
                var that = this;
                that.showChildView('content', that.controller.getView('home'));
                that.onBeforeShow();
                Backbone.history.loadUrl();
            }
        });
    });
})(window);
