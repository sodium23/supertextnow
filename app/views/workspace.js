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
        'contentViews/home',
        'api/supercenter',
        'utils/dialog',
        'text!templates/appWorkspace.html'
    ], function (Backbone, LayoutView, Controller, SessionController, Router, SlideView, TopNavView, HomeView, SupercenterAPI, Dialog, template) {
        var Events = Backbone.Events,
            theme = '',
            THEMES = {
                santa: 'santa'
            },

            renderHome = function () {
                var that = this,
                    hashArray = W.location.hash.split('#'),
                    index = hashArray.length - 1,
                    urlTheme = hashArray[index];
                if(urlTheme){
                    urlTheme = THEMES[urlTheme] || theme;
                    W.location.hash = urlTheme;
                }
                theme = urlTheme;
                if (!that.homeView) {
                    that.homeView = new HomeView({
                        theme: theme
                    });
                    that.showChildView('content', that.homeView);
                } else {
                    Events.trigger('load:theme', theme);
                }
                this.$el.removeClass('info-open');
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

                that.listenTo(Events, 'tab:home', renderHome);
                that.listenTo(Events, 'info:open', openSlideView);
                that.listenTo(Events, 'nav:initialized', function () {
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
                //                that.showChildView('content', that.controller.getView('home'));
                that.onBeforeShow();
                Backbone.history.loadUrl();
            }
        });
    });
})(window);
