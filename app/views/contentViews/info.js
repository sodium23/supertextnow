(function(U){
    'use strict';
    
    define([
        'backbone',
        'views/base',
        'text!templates/info.html'
    ], function(Backbone, BaseView, template){
        return BaseView.extend({
            template: _.template(template),
            templateData: function(){
                return{
                    sectionInfos: [
                        {
                            tab: 'about',
                            info: 'This is About section'
                        },
                        {
                            tab: 'terms',
                            info: 'This is Terms Section'
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