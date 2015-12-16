(function (W) {
    'use strict';

    define([
        'views/base',
        'text!templates/sections/login.html'
    ], function (BaseView, template) {
        var onClickAction = function (e) {
                var jTarget = $(e.target).closest('[data-action]'),
                    action = jTarget.data('action');

                switch (action) {
                    case 'facebook':
                    case 'google':
                        openChildWindow(action);
                        break;
                    default:
                        break;
                }
            },
            openChildWindow = function (param) {
                W.open('signIn.html#' + param, 'social sign-in', 'height=550,width=700,status=yes,toolbar=no,menubar=no,location=no');
            }
        return BaseView.extend({
            className: 'login-dialog',
            template: _.template(template),
            events: {
                'click [data-action]': onClickAction
            }
        });
    });
})(window);
