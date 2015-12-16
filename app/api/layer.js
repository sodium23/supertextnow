(function (W, U) {
    define([
        'cookie'
    ], function (Cookie) {
        var CONFIG = {
                serverUrl: 'https://api.layer.com',
                appId: '8f3dbf72-9b42-11e5-9b0b-b2450c0046c4',
                localAppId: 'd965d90c-9342-11e5-a03d-3f4617001ad6', 
                headers: {
                    'Accept': 'application/vnd.layer+json; version=1.0',
                    'Content-type': 'application/json'
                },
                localIdentityProviderUrl: 'http://localhost:8080/rest/medium/layer/identity_token',
                identityProviderUrl: 'http://104.199.153.175:8080/rest/medium/layer/identity_token',
                conversation: U,
            },
            isLocal = window.location.hostname !== 'scupids.com',
            sessionToken,

            getUUID = function (id) {
                return id && _.last(id.split('/'));
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
                        url: isLocal ? CONFIG.localIdentityProviderUrl : CONFIG.identityProviderUrl,
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
                var d = new $.Deferred(),
                    appId = isLocal ? CONFIG.localAppId: CONFIG.appId;
                $.ajax({
                        url: CONFIG.serverUrl + "/sessions",
                        method: "POST",
                        headers: CONFIG.headers,
                        data: JSON.stringify({
                            "identity_token": identityToken,
                            "app_id": appId
                        })
                    })
                    .then(function (data, textStatus, xhr) {
                        sessionToken = data.session_token;
                        CONFIG.headers.Authorization = 'Layer session-token="' + sessionToken + '"';
                        d.resolve(sessionToken);
                    });
                return d;
            },
            setSessionTokenHeader: function (token) {
                sessionToken = token;
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
                var that = this,
                    d = $.Deferred();
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
                    url: CONFIG.serverUrl + "/sessions/" + (sessionToken),
                    method: "DELETE",
                    headers: CONFIG.headers
                }).then(function () {
                    sessionToken = U;
                    CONFIG.headers.Authorization = "";
                    d.resolve();
                });
                return d;
            },

            loadMessages: function (lastMsgId, pageSize) {
                var conversation = CONFIG.conversation;
                pageSize = pageSize || 10;
                return $.ajax({
                    url: CONFIG.serverUrl + '/conversations/' + getUUID(CONFIG.conversation.id) + '/messages',
                    method: 'GET',
                    headers: CONFIG.headers,
                    data: {
                        page_size: pageSize,
                        from_id: lastMsgId
                    }
                });
            },
            createContentResource: function(type, length){
                return $.ajax({
                    url: CONFIG.serverUrl + '/content',
                    method: 'POST',
                    headers: _.extend({
                        'Upload-Content-Type': type,
                        'Upload-Content-Length': length,
                        'Upload-Origin': W.location.origin
                    },CONFIG.headers),
                    data: {
                        page_size: pageSize,
                        from_id: lastMsgId
                    }
                });
                
            }
        }
    });
})(window)
