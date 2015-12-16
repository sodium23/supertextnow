(function () {
    'use strict';

    define([
        'views/base',
        'text!templates/sections/topNav.html'
    ], function (BaseView, template) {
        var onClickAction = function (e) {
                var that = this,
                    jTarget = $(e.target).closest('[data-action]'),
                    action = e.action || jTarget.data('action');

                switch (action) {
                    case 'login':
                        showLoginDialog.call(that);
                        break;
                    default:
                        break;
                }
            },
            showLoginDialog = function () {};
        return BaseView.extend({
            template: _.template(template),
            events: {
                'click [data-action]': onClickAction
            }
        });
    });
})();
