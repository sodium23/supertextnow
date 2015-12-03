(function () {
    'use strict';
    define([
        'marionette'
    ], function (Marionette) {

        return Marionette.AppRouter.extend({

            appRoutes: {
                'info/:tab': "renderInfo",
                '*default': "renderView"
            }
        });

    });

})();
