(function () {
    'use strict';
    document.getElementById('workspace').classList.add(((new Date()).getHours() > 7 && (new Date()).getHours() < 18) ? "day-time" : "night-time");
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
