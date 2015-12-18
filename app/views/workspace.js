(function (W) {
    'use strict';

    define([
        'backbone',
        'views/layout',
        'controllers/app',
        'controllers/session',
        'routers/app',
        'views/contentViews/slide',
        'views/sections/topNav',
        'api/supercenter',
        'utils/dialog',
        'text!templates/appWorkspace.html'
    ], function (Backbone, LayoutView, Controller, SessionController, Router, SlideView, TopNavView, SupercenterAPI, Dialog, template) {
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
            },
            onSocialLogin = function (query) {
                var that = this,
                    channel = 'facebook';
                that.$el.addClass('loading');
                Dialog.close();
                query && SupercenterAPI.socialLogin(channel, query).then(function () {
                    that.$el.removeClass('loading');
                });
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
                },
                topNav: {
                    selector: '#top-nav',
                    regionView: TopNavView
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
                that.sessionController = new SessionController();

                that.listenTo(Events, 'tab:change', setContentView);
                that.listenTo(Events, 'info:open', openSlideView);
                that.listenTo(Events, 'nav:initialized', function(){
                    that.sessionController.load();
                });
                W.onSocialLogin = function (queryString) {
                    console.log('Initialize Login process with supercenter with query: ' + queryString);
                    onSocialLogin.call(that, queryString);
                }
            },
            events: {
                'click #dialog-overlay': function (e) {
                    var jTarget = $(e.target),
                        action = $(e.target).data('action');

                    action === 'close' && Dialog.close();
                }
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
