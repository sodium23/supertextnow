(function(){
    'use strict';
    
    define([
        'jquery',
        'marionette'
    ], function($, Marionette){
        var dialogContentView;
        return {
            show: function(dialogView){
                var jDialog = $('#dialog-overlay');
                dialogContentView = dialogView;
                jDialog.find('.dialog-content').html(dialogView.render().$el);
                jDialog.addClass('open');
            },
            close: function(){
                var jDialog = $('#dialog-overlay');
                dialogContentView && dialogContentView.remove();
                jDialog.removeClass('open');
                jDialog.find('.dialog-content').html('');
            }
        };
    });
})()