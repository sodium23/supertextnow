(function () {
    'use strict';

    define([
        'views/item',
        'text!templates/sections/home/chatMsg.html'
    ], function (ItemView, template) {
        return ItemView.extend({
            className: 'chat-msg',
            template: _.template(template)
        });

    });
})();
