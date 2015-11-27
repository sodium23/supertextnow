(function () {
    'use strict';

    define([
        'marionette'
    ], function (Marionette) {
        return Marionette.View.extend({
            render: function () {
                var that = this,
                    templateData = that.templateData;

                that.$el.html(that.template(_.isFunction(templateData) ? templateData.call(that) : templateData));
                that.onRender && that.onRender();
                return that;
            }
        });
    });
})();