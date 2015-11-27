(function (W) {
    'use strict';
    define([
        'views/base',
        'contentViews/home',
        'contentViews/section'
    ], function (Base, Home, Section) {
        var isEnabled = true;
        return Base.extend({
            getView: function (tab, options) {
                //Replace Home with some other view, Ex: Forbidden or 404, for changing the default view
                var contentView = Home;

                switch (tab) {
                    case 'home':
                        isEnabled && (contentView = Home);
                        break;
                    case 'pricing':
                        isEnabled && (contentView = Section);
                        break;
                    case 'about':
                        isEnabled && (contentView = Section);
                        break;
                    case 'terms':
                        isEnabled && (contentView = Section);
                        break;
                    default:
                        W.location.hash = 'home';
                        break;
                }
                return new contentView(options);
            }
        });
    })
})(window);
