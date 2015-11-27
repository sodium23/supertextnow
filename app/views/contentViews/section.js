(function () {
    'use strict';
    define([
        'views/base',
        'text!templates/section.html'
    ], function (BaseView, template) {
        return BaseView.extend({
            template: _.template(template),
            className: 'section-cont f-h'
        });
    });
})();