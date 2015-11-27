(function () {
    'use strict';

    define([
        'marionette'
    ], function (Marionette) {
        return Marionette.CompositeView.extend({
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
