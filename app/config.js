(function () {
    'use strict';

    define([
        'app/config/paths',
        'app/config/shims'
    ], function (paths, shims) {
        return {
            paths: paths,
            shim: shims,
            config: {
                text: {
                    useXhr: function (url, protocol, hostname, port) {
                        // allow cross-domain requests
                        // remote server allows CORS
                        return true;
                    }
                }
            }
        }
    });
})();
