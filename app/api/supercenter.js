(function (W) {
    'use strict';

    define([
        'backbone'
    ], function (Backbone) {
        var Events = Backbone.Events,
            CONFIG = {
                prodUrl: 'http://104.199.153.175:8080/',
                localUrl: 'http://localhost:8080/',
                headers: {
                    'Content-type': 'application/json'
                }
            },
            EMPTY_OBJ_READONLY = {},
            url = window.location.host === 'scupids.com' ? CONFIG.prodUrl : CONFIG.localUrl;
        return {
            socialLogin: function (channel, query) {
                var d = $.Deferred();
                $.ajax({
                    url: url + 'rest/signin/' + channel + '?' + query,
                    method: 'GET',
                    headers: CONFIG.headers
                }).done(function (response) {
                    Events.trigger('user:logged-in', response);
                    d.resolve();
                });

                return d;
            },

            login: function (data) {
                return $.ajax({
                    url: url + 'rest/app/signin',
                    data: data,
                    contentType: 'application/json',
                    method: 'GET'
                }).done(function (response) {
                    Events.trigger('user:logged-in', response);
                    d.resolve();
                });
            },
            
            logout: function(){
                var d = $.Deferred();
                $.ajax({
                    url: url + 'logout',
                    method: 'GET'
                }).done(function (response) {
                    W.location.reload();
                });
                return d;
            },

            signUp: function (data) {
                return $.ajax({
                    url: url + 'rest/app/register',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    method: 'POST'
                }).done(function (response) {
                    Events.trigger('user:logged-in', response);
                    d.resolve();
                });
            },

            registerUser: function (options) {
                var d = $.Deferred();
                $.ajax({
                    url: url + 'rest/app/pseudoRegister',
                    method: 'POST',
                    headers: CONFIG.headers,
                    error: options.error,
                }).done(function (response) {
                    Events.trigger('user:logged-in', _.extend({isDummy:true},response));
                    d.resolve();
                });

                return d;
            }
        };
    });
})(window);
