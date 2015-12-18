(function () {
    'use strict';

    define([
    ], function () {
        var REGEX = {
            email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            mob: /^(0|\+91|91)?[789]\d{9}$/
        }
        return {
            validateInput: function (text, type) {
                var error;
                text = text.trim();
                text && REGEX[type] && !REGEX[type].test(text) && (error = 'invalid');
                !error && (text = this.sanitizeInput(text, type));
                return {
                    text: text,
                    error: error
                }
            },
            sanitizeInput: function (text, type) {
                var sanitizedText,length;
                switch (type) {
                    case 'mob':
                        length = text.length;
                        if (length > 10) {
                            text = text.slice((length - 10), length);
                        }
                        text = (91 + text);
                        break;
                    default:
                        break;
                }
                return text;
            }
        }
    });
})();
