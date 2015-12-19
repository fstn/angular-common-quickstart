/**
 * Created by SZA on 17/12/2015.
 */
'use strict';
/**
 * Service that provide filter dropDown loading manage function
 */
angular.module('supplier.portal')
    .factory('SearchFilterConfig', ['$q', 'InvoiceStatus', 'Supplier', 'Company', function ($q, InvoiceStatus, Supplier, Company) {

        return {
            invoiceStatusFilterOptions: {data: []},
            supplierFilterOptions: {data: []},
            companyFilterOptions: {data: []},
            error: {},
            /**
             * filter initialization
             * @returns {*|Deferred|{resolve, reject, promise}}
             */
            initialize: function () {
                var self = this;
                self.isBusy = true;
                /**
                 * invoiceStatus filter
                 */
                var invoiceStatusPromise = InvoiceStatus.getAll.query({}, function (data) {
                        var result = [];
                        //item is invoiceStatus
                        angular.forEach(data, function (item) {
                            result.push({id: item.code, value: item.code});
                        });

                        self.invoiceStatusFilterOptions.data = result;
                    console.log( self.invoiceStatusFilterOptions.data);
                }).$promise;
                /**
                 * Supplier filter
                 */
                var supplierPromise = Supplier.getAll.query({}, function (data) {
                    var result = [];
                    //item is supplier
                    angular.forEach(data, function (item) {
                        result.push({id: item.id, value: item.name});
                    });

                    self.supplierFilterOptions.data = result;
                }).$promise;
                /**
                 * Company filter
                 */
                var companyPromise = Company.getAll.get({}, function (data) {
                    var result = [];
                    //item is company
                    angular.forEach(data.items, function (item) {
                        result.push({id: item.id, value: item.name});
                    });
                    self.companyFilterOptions.data = result;
                }).$promise;
                return $q.all([invoiceStatusPromise, supplierPromise, companyPromise])
                    .then(function (result) {
                        //everything is loaded
                    })
            }
        };
    }])