(function (W) {
    define([
        'cookie'
    ], function (Cookie) {
        var CONFIG = {
            serverUrl: 'https://api.layer.com',
            appId: 'b9c4ba3e-9b42-11e5-aeaa-d9b1000000ac',
            headers: {
                Accept: 'application/vnd.layer+json; version=1.0',
                Authorization: 'Layer ',
                'Content-type': 'application/json'
            },
            identityProviderUrl: 'https://layer-identity-provider.herokuapp.com/identity_tokens',
            localIdentityProviderUrl: 'http://localhost:8080/rest/medium/layer/identity_token'
        };
        return {
            getNonce: function () {
                var d = new $.Deferred();
                $.ajax({
                        url: CONFIG.serverUrl + "/nonces",
                        method: "POST",
                        headers: CONFIG.headers
                    })
                    .done(function (data, textStatus, xhr) {
                        d.resolve(data.nonce);
                    });
                return d;
            },
            getIdentityToken: function (nonce, userId) {
                var d = new $.Deferred();
                $.ajax({
                        url: CONFIG.localIdentityProviderUrl,
                        headers: {
                            "Content-type": "application/json",
                            "Accept": "application/json"
                        },
                        method: "GET",
                        data: {
                            uId: userId,
                            nce: nonce
                        }
                    })
                    .then(function (data, textStatus, xhr) {
                        d.resolve(data.iTkn);
                    });
                return d;
            },
            getSession: function (identityToken) {
                var d = new $.Deferred();
                $.ajax({
                        url: CONFIG.serverUrl + "/sessions",
                        method: "POST",
                        headers: CONFIG.headers,
                        data: JSON.stringify({
                            "identity_token": identityToken,
                            "app_id": CONFIG.appId
                        })
                    })
                    .then(function (data, textStatus, xhr) {
                        Cookie.set('layer_token', data.session_token);
                        d.resolve(data.session_token);
                    });
                return d;
            }
        }
    });
})(window)
