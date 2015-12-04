(function(U){
    'use strict';
    
    define([
        'backbone',
        'views/base',
        'text!templates/about.html',
        'text!templates/terms.html',
        'text!templates/info.html'
    ], function(Backbone, BaseView, aboutHtml, termsHtml, template){
        return BaseView.extend({
            className: 'info-cont',
            template: _.template(template),
            templateData: function(){
                return{
                    sectionInfos: [
                        {
                            tab: 'about',
                            info: aboutHtml
                        },
                        {
                            tab: 'terms',
                            info: termsHtml
                        },
                    ]
                }
            },
            initialize: function(options){
                var that = this;
                BaseView.prototype.initialize.call(that, options);
                that.listenTo(Backbone.Events, 'info:tab:change', function(tab){
                    that.$('.info-section').hide();
                    that.$('.'+tab+'-section').show();
                });
            }
        });
    });
})();