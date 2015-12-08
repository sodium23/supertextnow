(function (W) {
    'use strict';

    define([
        'lodash',
        'jquery',
        'marionette',
        'backbone'
    ], function (_, $, Marionette, Backbone) {
        var App = new Marionette.Application();
        App.on('start', function () {
            var rootView;
            Backbone.history.start();
            requirejs([
                    'app/views/workspace'
                ], function (WorkspaceView) {
                var material = $.material;
                App.rootView = rootView = new WorkspaceView();
                rootView.render();
            });
        });

        return App;
    })

})(window);
