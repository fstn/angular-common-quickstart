
'use strict';
angular.module('supplier.portal')
    .factory('InvoiceStatus', ['$resource', 'CONFIG',
        function ($resource, CONFIG) {
            return {
                getAll: $resource(
                    CONFIG.URL + '/invoicestatus/')
            }
        }]);
