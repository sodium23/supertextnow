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
                    tab: 'info/about',
                    name: 'About',
                    enabled: TRUE
                },
                {
                    tab: 'info/terms',
                    name: 'Terms',
                    enabled: TRUE
                }
            ],
            onChangeTab = function (e) {
                var jTarget = e.target,
                    jTabEl = this.$(jTarget.closest('[data-tab]'));
                this.$('[data-tab]').removeClass('active');
                jTabEl.addClass('active');
                window.location.hash = jTabEl.data('tab');
            };

        return BaseView.extend({
            template: _.template(template),
            events: {
                'click [data-tab]': onChangeTab,
                'mouseover': function(){
                    this.$el.addClass('open-nav');
                },
                'mouseout': function(){
                    this.$el.removeClass('open-nav');
                }
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