(function(){
    'use strict';
    
    define([
    ], function(){
        var REGEX = {
            email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            mob: /^(0|\+91)?[789]\d{9}$/
        }
        return {
            validateInput: function(text, type){
                var error;
                text = text.trim();
                REGEX[type] && !REGEX[type].test(text) && (error = 'invalid');
                
                return {
                    text: text,
                    error: error
                }
            }
        }
    });
})();