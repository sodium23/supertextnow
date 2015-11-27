(function () {
    'use strict';

    define([
        'marionette'
    ], function (Marionette) {
        return Marionette.ItemView.extend({
            modelEvents: {
                'change': 'render'
            }
        });
    });
})();