(function () {
    'use strict';

    define([], function () {
        return {
            playSound: function (alertType) {
                var filename;
                switch (alertType) {
                    case 'NEW_MESSAGE':
                        filename = 'app/resources/sounds/message';
                        break;
                }
                $("#sound").html('<audio autoplay="autoplay"><source src="' + filename + '.mp3" type="audio/mpeg" /><source src="' + filename + '.ogg" type="audio/ogg" /><embed hidden="true" autostart="true" loop="false" src="' + filename + '.mp3" /></audio>');
            }
        };
    });
})();
