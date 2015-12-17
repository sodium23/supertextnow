(function (W) {
    'use strict';

    define([
        'views/base',
        'utils/dialog',
        'utils/validation',
        'api/supercenter',
        'text!templates/sections/login.html'
    ], function (BaseView, Dialog, Validation, SupercenterAPI, template) {
        var typingTimer,
            doneTypingInterval = 3000,
            onClickAction = function (e) {
                var that = this,
                    jTarget = $(e.target).closest('[data-action]'),
                    action = jTarget.data('action'),
                    jWorkspace = $('#workspace'),
                    data;

                switch (action) {
                    case 'toggle-form':
                        that.$el.toggleClass('sign-in-active');
                        that.$(that.$el.hasClass('sign-in-active') ? '.sign-in' : '.sign-up').find('[tabindex="1"]').focus();
                        break;
                    case 'signup':
                        data = prepareAndValidate.call(that, 'sign-up');
                        jWorkspace.addClass('loading');
                        data && SupercenterAPI.signUp(data).then(function () {
                            jWorkspace.removeClass('loading');
                            Dialog.close();
                        });;
                        break;
                    case 'login':
                        data = prepareAndValidate.call(that, 'sign-in');
                        jWorkspace.addClass('loading');
                        data && SupercenterAPI.login(data).then(function(){
                            jWorkspace.removeClass('loading');
                            Dialog.close();
                        });
                        break;
                    case 'facebook':
                    case 'google':
                        openChildWindow(action);
                        Dialog.close();
                        break;
                    default:
                        break;
                }
            },
            prepareAndValidate = function (context) {
                var that = this,
                    hasValidationError = !!that.$('.' + context + ' .error').length,
                    data = {};
                _.forEach(that.$('.' + context + ' .control-field input'), function (inputElem) {
                    var jInput = $(inputElem),
                        value = jInput.val();
                    _.isObject(data) && value ? (data[jInput.data('key')] = value) : (data = false);
                });
                if (_.isEmpty(data) || hasValidationError) {
                    return false;
                }
                return data;
            },
            openChildWindow = function (param) {
                W.open('signIn.html#' + param, 'social sign-in', 'height=550,width=700,status=yes,toolbar=no,menubar=no,location=no');
            },
            validateField = function (e) {
                var that = this,
                    jTarget = $(e.target),
                    value = jTarget.val(),
                    typeData = jTarget.data('type') || '',
                    types = typeData.split('|'),
                    isValid;
                _.forEach(types, function (type) {
                    !isValid && (isValid = !Validation.validateInput(value, type).error);
                });
                jTarget.closest('.control-field').toggleClass('error', !isValid);
            }
        return BaseView.extend({
            className: 'login-dialog',
            template: _.template(template),
            events: {
                'click [data-action]': onClickAction,
                'blur input': validateField,
                'keyup input': function (e) {
                    var that = this;
                    clearTimeout(typingTimer);
                    if ($(e.target).val()) {
                        typingTimer = setTimeout(function () {
                            validateField.call(that, e)
                        }, doneTypingInterval);
                    }
                }
            },
            onRender: function () {
                var that = this;
                _.defer(function () {
                    that.$('.sign-up').find('[tabindex="1"]').focus();
                });
            }
        });
    });
})(window);
