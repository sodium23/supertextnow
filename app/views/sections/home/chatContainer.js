(function () {
    'use strict';

    define([
        'backbone',
        'collections/base',
        'views/collection',
        'views/sections/home/chatMsg'
    ], function (Backbone, BaseCollection, CollectionView, chatMsgView) {
        var Events = Backbone.Events;
        return CollectionView.extend({
            className: 'chat-msgs-box',
            childView: chatMsgView,
            collection: new BaseCollection([{msg:'Hi', time: '1:11pm', dir:'left'}]),
            initialize: function(options){
                var that = this;
                CollectionView.prototype.initialize.call(that, options);
                that.listenTo(Events, 'msg:send', function(msg){
                    that.collection.add({msg: msg, time: '1:34pm', dir: 'right'});
                })
            }
        });

    });
})();
