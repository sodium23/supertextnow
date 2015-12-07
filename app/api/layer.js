(function (W) {
    define([], function () {
        var CONFIG = {
            serverUrl: 'https://api.layer.com',
            appId: 'b9c4ba3e-9b42-11e5-aeaa-d9b1000000ac',
            headers: {
                Accept: 'application/vnd.layer+json; version=1.0',
                Authorization: 'Layer session-token="s5ZkjU2dx5JZTbBSkhh99aOZVadzUtoex5Zw7qS1mwhm79vfx8oaSSDcrbb4tKudg8pjP6nPZulD59cyC6FMzA.8 - 6 "',
                'Content-type': 'application/json'
            },
            identityProviderUrl: 'https://layer-identity-provider.herokuapp.com/identity_tokens'
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
                        url: CONFIG.identityProviderUrl,
                        headers: {
                            "X_LAYER_APP_ID": CONFIG.appId,
                            "Content-type": "application/json",
                            "Accept": "application/json"
                        },
                        method: "POST",
                        data: JSON.stringify({
                            app_id: CONFIG.appId,
                            user_id: userId,
                            nonce: nonce
                        })
                    })
                    .then(function (data, textStatus, xhr) {
                        d.resolve(data.identity_token);
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
                        d.resolve(data.session_token);
                    });
                return d;
            }
        }
    });
})(window)
