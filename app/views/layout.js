(function () {
    'use strict';

    define([
        'marionette'
    ], function (Marionette) {
        return Marionette.LayoutView.extend({

            onBeforeShow: function () {
                var that = this;

                _.forEach(that.regions, function (region, key) {
                    var regionView = region.regionView;
                    regionView && that.showChildView(key, new regionView());
                });
            }
        });
    });
})();