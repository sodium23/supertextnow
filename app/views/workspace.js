(function (W) {
    'use strict';

    define([
        'backbone',
        'views/layout',
        'controllers/app',
        'routers/app',
        'views/navigation',
        'text!templates/appWorkspace.html'
    ], function (Backbone, LayoutView, Controller, Router, NavView, template) {
        var DEFAULT_TAB = 'home',

            setContentView = function () {
                var that = this,
                    hashArray = W.location.hash.split('#'),
                    length = hashArray.length - 1,
                    tab = (hashArray && hashArray[length]) || DEFAULT_TAB,
                    contentView;

                if (!( hashArray && hashArray[length] )) {
                    tab = DEFAULT_TAB;
                    W.location.hash = DEFAULT_TAB;
                }
                that.contentView = contentView = that.controller.getView(tab);
                that.showChildView('content', contentView);
                Backbone.Events.trigger('tab:rendered', tab);
            };

        return LayoutView.extend({
            el: '#workspace',
            regions: {
                navigation: {selector: '#navigation', regionView: NavView},
                content: {selector: '#content'}
            },
            template: template,

            initialize: function (options) {
                var that = this,
                    controller;

                LayoutView.prototype.initialize.call(that, options);

                that.router = new Router({controller: that.controller = new Controller()});
                that.navView = new NavView();

                that.listenTo(Backbone.Events, 'tab:change', setContentView);
            },

            onRender: function () {
                var that = this;
                that.onBeforeShow();
                that.controller.renderView();
            }
        });
    });
})(window);