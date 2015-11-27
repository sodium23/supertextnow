(function () {
    'use strict';

    define([
        'marionette'
    ], function (Marionette) {
        return Marionette.ItemView.extend({
            modelEvents: {
                'change': 'render'
            },
            onBeforeDestroy: function () {
                this.$('[data-toggle="tooltip"]').tooltip('destroy');
            },
            onBeforeRender: function () {
                this.$('[data-toggle="tooltip"]').tooltip('destroy');
            },
            onRender: function () {
                this.$('[data-toggle="tooltip"]').tooltip();
            }
        });
    });
})();