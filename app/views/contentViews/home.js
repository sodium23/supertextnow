(function () {
    'use strict';
    define([
        'views/base',
        'text!templates/home.html'
    ], function (BaseView, template) {
        return BaseView.extend({
            template: _.template(template),
            className: 'home-cont f-h'
        });
    });
})();