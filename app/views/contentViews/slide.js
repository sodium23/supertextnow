(function (W, U) {
    'use strict';

    define([
        'backbone',
        'views/layout',
        'views/navigation',
        'views/contentViews/info',
        'text!templates/slide.html'
    ], function (Backbone, LayoutView, NavView, InfoView, template) {
        var Events = Backbone.Events;
        return LayoutView.extend({
            className: 'page-full-height',
            regions: {
                navigation: {
                    selector: '#navigation',
                    regionView: NavView
                },
                info: {
                    selector: '#info',
                    regionView: InfoView
                }
            },
            template: _.template(template),
            events: {
                'click #slide-down-arrow, .overlay': function () {
                    W.location.hash = this.theme;
                }
            },
            onRender: function () {
                var that = this,
                    hashArray = W.location.hash.split('#'),
                    theme = hashArray[hashArray.length - 1];
                theme.split('/')[0] === 'info' && (theme = '');
                that.theme = theme || '';
                that.listenTo(Events, 'load:theme', function(theme){
                    that.theme = theme || '';
                });
            }
        });
    });
})(window);
