(function () {
    define([
        'cookie',
        'marionette',
        'backbone'
    ], function (Cookie, Marionette, Backbone) {
        var Events = Backbone.Events,
            
            getCookieName = function (name) {
                return 'STXT_' + name.toUpperCase();
            },
            
            setCookie = function (name, value) {
                removeCookie(name);
                Cookie.set(getCookieName(name), value);
            },
            
            removeCookie = function (name) {
                Cookie.remove(getCookieName(name));
            },
            
            getCookie = function (name) {
                return Cookie.get(getCookieName(name));
            },
            
            setSession = function (data) {
                token = data.lSTkn;
                id = data.lUId;
                name = (data.cus || {}).n;

                token && setCookie('token', token);
                name && setCookie('name', name);
                id && setCookie('id', id);

                console.log('SESSION SET');
            },
            
            resetSession = function () {
                removeCookie('token');
                removeCookie('id');
                removeCookie('name');

                console.log('SESSION REMOVED');
            },
            
            getSession = function () {
                console.log('SESSION RETRIVED');
                return {
                    token: getCookie('token'),
                    name: getCookie('name'),
                    id: getCookie('id')
                }
            },
            
            loadSession = function(){
                var session = getSession();
                session.token && session.id && Events.trigger('user:load:session', session);
            },
            
            token, id, name;
        return Marionette.Controller.extend({
            initialize: function () {
                var that = this;

                that.listenTo(Events, 'user:logged-in', setSession);
                that.listenTo(Events, 'user:logout', resetSession);
                
                loadSession.call(that);
            }
        });
    });
})()
