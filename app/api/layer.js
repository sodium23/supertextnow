(function (W, U) {
    define([], function () {
        var CONFIG = {
                serverUrl: 'https://api.layer.com',
                headers: {
                    'Accept': 'application/vnd.layer+json; version=1.0',
                    'Content-type': 'application/json'
                },
                conversation: U,
            },
            isLocal = window.location.hostname !== 'scupids.com',
            sessionToken,

            getUUID = function (id) {
                return id && _.last(id.split('/'));
            };
        return {
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
