(function () {
    'use strict';

    var NODE_PATH = 'node_modules/',
        BOWER_PATH = 'bower_components/';
    define({
        //Libraries
        jquery: BOWER_PATH + 'jquery/dist/jquery',
        backbone: BOWER_PATH + 'backbone/backbone',
        marionette: BOWER_PATH + 'marionette/lib/backbone.marionette',
        lodash: BOWER_PATH + 'lodash/lodash',
        underscore: BOWER_PATH + 'underscore/underscore',

        //RequireJs Plugins
        text: BOWER_PATH + 'requirejs-text/text',
        domReady: BOWER_PATH + 'domReady/domReady',
        
        //Application paths
        views: 'app/views',
        templates: 'app/templates',
        models: 'app/models',
        collections: 'app/collections',
        controllers: 'app/controllers',
        routers: 'app/routers',
        factory: 'app/factory',
        contentViews: 'app/views/contentViews'
    });
})();
