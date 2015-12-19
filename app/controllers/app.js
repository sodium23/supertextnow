(function (W) {
    'use strict';
    define([
        'marionette',
        'backbone',
        'factory/contentViewFactory'
    ], function (Marionette, Backbone, ContentViewFactory) {

        return Marionette.Controller.extend({

            renderHome: function () {
                Backbone.Events.trigger('tab:home');
            },
            renderInfo: function (tab) {
                Backbone.Events.trigger('info:open', tab);
            },

            getView: function (tab, options) {
                return (new ContentViewFactory).getView(tab, options);
            }
        });

    });

})(window);
