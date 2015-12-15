(function () {
    'use strict';

    define([], function () {
        var CONFIG = {
                prodUrl: 'http://104.199.153.175:8080/',
                localUrl: 'http://localhost:8080/',
                headers: {
                    //                    'Content-type': 'application/json'
                }
            },
            url = window.location.host === 'scupids.com' ? CONFIG.prodUrl : CONFIG.localUrl;
        return {
            login: function (channel, query) {
                return $.ajax({
                    url: url + 'rest/signin/' + channel + '?' + query,
                    method: 'GET',
                    headers: CONFIG.headers
                })
            }
        };
    });
})();
