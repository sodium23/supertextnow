(function(W, U){
    'use strict';
    
    define([
        'views/layout',
        'views/navigation',
        'views/contentViews/info',
        'text!templates/slide.html'
    ], function(LayoutView, NavView, InfoView, template){
        return LayoutView.extend({
            className: 'page-full-height',
            regions: {
                navigation: {selector: '#navigation', regionView: NavView},
                info: {selector: '#info', regionView: InfoView}
            },
            template: _.template(template),
            events: {
                'click #slide-down-arrow, .overlay': function(){
                    W.location.hash = 'home';
                }
            }
        });
    });
})(window);