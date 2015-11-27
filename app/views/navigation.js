(function (W) {
    'use strict';

    define([
        'lodash',
        'jquery',
        'views/base',
        'text!templates/navigation.html'
    ], function (_, $, BaseView, template) {

        var TRUE = true,
            NAV_SECTIONS = [
                {
                    tab: 'home',
                    name: 'Home',
                    enabled: TRUE
                },
                {
                    tab: 'section',
                    name: 'Section',
                    enabled: TRUE
                }
            ],
            onChangeTab = function (e) {
                var jTarget = e.target,
                    jTabEl = this.$(jTarget.closest('[data-tab]'));
                jTabEl.addClass('active');
                jTabEl.siblings('[data-tab]').removeClass('active');
                window.location.hash = jTabEl.data('tab');
            };

        return BaseView.extend({
            template: _.template(template),
            events: {
                'click [data-tab]': onChangeTab
            },
            className: 'nav-bar',
            render: function () {
                var that = this;
                that.$el.html(that.template({
                    sections: NAV_SECTIONS
                }));
                return that;
            }
        });
    });
})(window);