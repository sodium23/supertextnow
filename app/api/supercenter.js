(function(){
    'use strict';
    
    define([], function(){
        var CONFIG = {
            url: 'http://localhost:8080/rest',
            headers: {
                    'Content-type': 'application/json'
                }
        };
        return {
            login: function(channel, query){
                return $.ajax({
                        url: CONFIG.url + '/signin/'+channel+'?'+query,
                        method: 'GET',
                        headers: CONFIG.headers
                    })
            }
        };
    });
})();