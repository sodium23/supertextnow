(function () {
    'use strict';

    define([
        'views/base',
        'utils/dialog',
        'views/sections/login',
        'text!templates/sections/topNav.html'
    ], function (BaseView, Dialog, LoginView, template) {
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
            showLoginDialog = function () {
                var that = this;
                Dialog.show(new LoginView());
            };
        return BaseView.extend({
            template: _.template(template),
            events: {
                'click [data-action]': onClickAction
            },
            initialize: function(options){
                var that = this;
                BaseView.prototype.initialize.call(that, options);
            }
        });
    });
})();
