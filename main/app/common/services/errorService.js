/**
 * Created by SZA on 18/12/2015.
 */
'use strict';
angular.module('supplier.portal')
    .factory('Error', ['$rootScope', '$translate', 'NOTIFICATION_TYPE', function ($rootScope, $translate, NOTIFICATION_TYPE) {
        function ModelStateFactory() {
            /// Retourne un objet qui sera utilisé pour contenir l'état d'un formulaire
        }

        ModelStateFactory.prototype.clear = function () {
            /// <summary>
            /// Vide toute les propriétés du modelState
            /// </summary>
            for (var i in this) {
                if (this.hasOwnProperty(i)) {
                    delete this[i];
                }
            }
        };

        function translateError(text) {
            // eg: text contains ErrorCode-param1$$param2
            // Search the key
            var key = text;
            var tiret = text.indexOf('-');
            if (tiret > 0) {
                key = text.slice(0, tiret).trim();
            }

            // Search Params
            if (text.substring(tiret).trim()) {
                var params = text.substring(tiret + 1).split('$$');
                var paramTranslate = {};
                paramTranslate.Param0 = params[0];
                if (params.length > 1) {
                    paramTranslate.Param1 = params[1];
                    if (params.length >= 2) {
                        paramTranslate.Param2 = params[2];
                    }
                }
            }

            return $translate.instant(key, paramTranslate);
        };

        function toastError(scope, httpResponse, title) {
            /// <summary>
            /// Affiche les erreurs dans le toaster
            /// </summary>
            var messages = [];
            if (httpResponse.data
                && httpResponse.data
                && httpResponse.data.ModelState
                && httpResponse.data.ModelState.General) {
                //ERREURS METIERS
                messages = httpResponse.data.ModelState.General
            }
            else {
                //ERREURS INATTENDUES
                messages.push(httpResponse.statusText);

                if (httpResponse.data
                    && httpResponse.data.Message) {
                    messages.push(httpResponse.data.Message);
                }
            }

            var toasterContent = '<span>' + translateError(title) + '<br/>' + '</span>';
            for (var i = 0; i < messages.length; i++) {
                toasterContent += '<span>' + translateError(messages[i]) + '<br/>' + '</span>';
            }

            scope.$emit('itNotifierShown', {
                type: NotificationType.ERROR,
                options: {
                    content: toasterContent,
                    dismissOnTimeout: false
                }
            });
        };

        function displayErrorModelState(scope, serverModelState) {
            /// <summary>
            /// Copy les erreurs depuis la réponse du serveur dans le modelState du scope.
            /// </summary>

            if (!scope.modelState) {
                scope.modelState = new ModelStateFactory();
            }
            else if (scope.modelState.clear) {
                scope.modelState.clear();
            }

            for (var prop in serverModelState) {
                scope.modelState[prop] = serverModelState[prop];

                for (var i = 0; i < scope.modelState[prop].length; i++) {
                    scope.modelState[prop][i] = $translate.instant(scope.modelState[prop][i]);
                }
            }
        };

        return {
            displayErrorMessage: function (scope, httpResponse, title) {
                if (httpResponse) {
                    if (httpResponse.data && httpResponse.data.ModelState) {
                        // erreurs locales: formulaire
                        displayErrorModelState(scope, httpResponse.data.ModelState)
                    }

                    if (!httpResponse.data.ModelState
                        || httpResponse.data.ModelState.General) {
                        // Exception inattendue ou Erreurs metiers generales : toast
                        toastError(scope, httpResponse, title);
                    }
                }
            },

            ModelState: ModelStateFactory,
            notifyDismiss: function (scope) {
                scope.$emit('itNotifierShown', {
                    type: NotificationType.DISMISS,
                    options: {}
                });
            }
        }
    }]);

