(function () {
    'use strict';

    define([
        'backbone',
        'views/base',
        'utils/dialog',
        'api/supercenter',
        'views/sections/login',
        'text!templates/sections/topNav.html'
    ], function (Backbone, BaseView, Dialog, SupercenterAPI,LoginView, template) {
        var EMPTY_OBJ_READONLY = {},
            Events = Backbone.Events,
            isLoggedin = false,
            onClickAction = function (e) {
                var that = this,
                    jTarget = $(e.target).closest('[data-action]'),
                    action = e.action || jTarget.data('action');

                switch (action) {
                    case 'login':
                        isLoggedin ? showDropdown.call(that): showLoginDialog.call(that);
                        break;
                    case 'logout':
                        isLoggedin && Events.trigger('user:logout');
                        break;
                    default:
                        break;
                }
            },
            showLoginDialog = function () {
                var that = this;
                Dialog.show(new LoginView());
            },
            showDropdown = function () {
                var that = this;
                that.$('#login').toggleClass('open-dropdown');
            };

        return BaseView.extend({
            template: _.template(template),
            events: {
                'click [data-action]': onClickAction
            },
            initialize: function (options) {
                var that = this;
                BaseView.prototype.initialize.call(that, options);
                that.listenTo(Events, 'user:logged-in', function (data) {
                    data = data || EMPTY_OBJ_READONLY;
                    var customer = data.cus || EMPTY_OBJ_READONLY;
                    isLoggedin = true;
                    that.$('.nav-label').text(customer.n || 'Welcome');
                });
            }
        });
    });
})();
