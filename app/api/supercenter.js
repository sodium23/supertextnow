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
            },
            
            registerUser: function(options){
                var d = $.Deferred();
                $.ajax({
                    url: url + 'app/pseudoRegister',
                    method: 'POST',
                    headers: CONFIG.headers,
                    error: options.error,
                }).done(function(response){
                    var socialAccounts = (response.cus || EMPTY_OBJ_READONLY).sAcnts || EMPTY_OBJ_READONLY,
                        layerAccount = _.find(socialAccounts, function(account){
                            return account.mT === "LAYER";
                        });
                    d.resolve({
                        layerToken: response.lSTkn,
                        customerId: (layerAccount || EMPTY_OBJ_READONLY).id
                    });
                });
                
                return d;
            }
        };
    });
})();
