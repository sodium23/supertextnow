(function (W) {
    'use strict';

    define([
        'lodash',
        'jquery',
        'marionette',
        'backbone',
        'utils/layerSocket'
    ], function (_, $, Marionette, Backbone, LayerSocket) {
        var App = new Marionette.Application();
        new LayerSocket();
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
