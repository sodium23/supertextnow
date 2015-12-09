(function (W, U) {
    define([
        'cookie'
    ], function (Cookie) {
        var CONFIG = {
                serverUrl: 'https://api.layer.com',
                appId: 'b9c4ba3e-9b42-11e5-aeaa-d9b1000000ac',
                headers: {
                    'Accept': 'application/vnd.layer+json; version=1.0',
                    'Content-type': 'application/json'
                },
                identityProviderUrl: 'https://layer-identity-provider.herokuapp.com/identity_tokens',
                localIdentityProviderUrl: 'http://localhost:8080/rest/medium/layer/identity_token',
                conversation: U,
            },
            sessionToken;
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
                        sessionToken = data.session_token;
                        Cookie.set('layer_token', sessionToken);
                        CONFIG.headers.Authorization = 'Layer session-token="' + sessionToken + '"';
                        d.resolve(sessionToken);
                    });
                return d;
            },
            setSessionTokenHeader: function (token) {
                sessionToken = sessionToken;
                CONFIG.headers.Authorization = 'Layer session-token="' + token + '"';
            },
            sendMessage: function (body, mimeType) {
                return $.ajax({
                    url: CONFIG.conversation.url + "/messages",
                    method: "POST",
                    headers: CONFIG.headers,
                    data: JSON.stringify({
                        parts: [
                            {
                                body: body,
                                mime_type: mimeType || "text/plain"
                            }
                        ]
                    })
                });
            },

            createConversation: function (participants, distinct) {
                var d = $.Deferred();
                $.ajax({
                    url: CONFIG.serverUrl + "/conversations",
                    method: "POST",
                    headers: CONFIG.headers,
                    data: JSON.stringify({
                        participants: participants,
                        distinct: !!distinct
                    })
                }).then(function (conversation) {
                    console.log('Conversation Created');
                    CONFIG.conversation = conversation;
                    d.resolve();
                });

                return d;
            },

            logout: function () {
                var d = $.Deferred();
                $.ajax({
                    url: CONFIG.serverUrl + "/sessions/" + (sessionToken || Cookie.get('layer_token', sessionToken)),
                    method: "DELETE",
                    headers: CONFIG.headers
                }).then(function () {
                    sessionToken = U;
                    Cookie.remove('layer_token');
                    d.resolve();
                });
                return d;
            }
        }
    });
})(window)
