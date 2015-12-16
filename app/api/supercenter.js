(function () {
    'use strict';

    define([], function () {
        var CONFIG = {
                prodUrl: 'http://104.199.153.175:8080/rest/',
                localUrl: 'http://localhost:8080/rest/',
                headers: {
                                        'Content-type': 'application/json'
                }
            },
            EMPTY_OBJ_READONLY = {},
            url = window.location.host === 'scupids.com' ? CONFIG.prodUrl : CONFIG.localUrl;
        return {
            login: function (channel, query) {
                var d = $.Deferred();
                $.ajax({
                    url: url + 'signin/' + channel + '?' + query,
                    method: 'GET',
                    headers: CONFIG.headers
                }).done(function(response){
                    d.resolve();
                });
                
                return d;
            }
        };
    });
})();
