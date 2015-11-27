(function () {
    'use strict';
    requirejs(['app/config'], function (config) {
        requirejs.config(config);
        requirejs([
            'domReady!',
            'app'
        ], function (document, App) {
            App.start();
        });
    });
}());
