/**
 * Created by SZA on 18/12/2015.
 */
'use strict';
/**
 * Service that provide invoice grid column configuration
 */
angular.module('supplier.portal')
    .factory('InvoiceColumns', ['$q', '$templateCache', 'SearchFilterConfig', 'OPERATOR', function ($q, $templateCache, SearchFilterConfig, OPERATOR) {
        return {
            columns: [],
            /**
             *
             * @param columnsToShow: key value array [
             {key: 'status', visible: 'true'}]
             * @param dropDownFilterTemplate: template use for dropDown filter
             * @param dateRangeFilterTemplate: template use for date filter
             * @returns {*|Deferred|{resolve, reject, promise}}
             */
            initialize: function (columnsToShow,dropDownFilterTemplate,dateRangeFilterTemplate) {

                var deferred = $q.defer();
                var filterPromise = SearchFilterConfig.initialize().$promise;
                var self = this;

                $q.all([filterPromise]).then( function () {
                    var tmpColumns = [];

                    self.filterConfig = {template: {}, options: {}};
                    self.columns['status'] = {
                        name: 'status',
                        cellFilter: 'translate',
                        filterHeaderTemplate: dropDownFilterTemplate,
                        filters: [
                            {
                                options: SearchFilterConfig.invoiceStatusFilterOptions,
                                emptyOption: 'select status',
                                condition: OPERATOR.EQUALS
                            }]
                    };
                    tmpColumns['supplier'] = {
                        name: 'supplier',
                        cellFilter: 'translate',
                        filterHeaderTemplate: dropDownFilterTemplate,
                        visible: true,
                        filters: [
                            {
                                options: SearchFilterConfig.supplierFilterOptions,
                                rsqlKey: 'supplier.id',
                                emptyOption: 'select supplier',
                                condition: OPERATOR.EQUALS
                            }]
                    };
                    tmpColumns['company'] = {
                        name: 'company',
                        cellFilter: 'translate',
                        filterHeaderTemplate: dropDownFilterTemplate,
                        visible: true,
                        filters: [
                            {
                                options: SearchFilterConfig.companyFilterOptions,
                                rsqlKey: 'company.id',
                                emptyOption: 'select company',
                                condition: OPERATOR.EQUALS
                            }]
                    };

                    tmpColumns['date'] = {
                        name: 'date',
                        type: 'date',
                        filterHeaderTemplate: dateRangeFilterTemplate,
                        filters: [
                            {
                                condition: OPERATOR.GREATER_EQUALS
                            },
                            {
                                condition: OPERATOR.LESS_EQUALS
                            }]
                    }
                    tmpColumns['dueDate'] = {
                        name: 'dueDate',
                        type: 'date',
                        filterHeaderTemplate: dateRangeFilterTemplate,
                        filters: [
                            {
                                condition: OPERATOR.GREATER_EQUALS
                            },
                            {
                                condition: OPERATOR.LESS_EQUALS
                            }]
                    };
                    tmpColumns['number'] = {name: 'number'};
                    tmpColumns['totalAmount'] = {name: 'totalAmount'};
                    tmpColumns['totalAmount'] = {name: 'totalNetAmount'};
                    tmpColumns['site'] = {name: 'site'};
                    tmpColumns['currency'] = {name: 'currency'};
                    tmpColumns['code'] = {name: 'code'};
                    tmpColumns['scanDate'] = {
                        name: 'scanDate',
                        type: 'date',
                        filterHeaderTemplate: dateRangeFilterTemplate,
                        filters: [
                            {
                                condition: OPERATOR.GREATER_EQUALS
                            },
                            {
                                condition: OPERATOR.LESS_EQUALS
                            }]
                    };
                    tmpColumns['batchName'] = {name: 'batchName'};
                    tmpColumns['dateChangeState'] = {
                        name: 'dateChangeState',
                        type: 'date',
                        filterHeaderTemplate: dateRangeFilterTemplate,
                        filters: [
                            {
                                condition: OPERATOR.GREATER_EQUALS
                            },
                            {
                                condition: OPERATOR.LESS_EQUALS
                            }]
                    };
                    tmpColumns['custom1'] = {name: 'custom1'};
                    tmpColumns['custom2'] = {name: 'custom2'};
                    tmpColumns['custom3'] = {name: 'custom3'};
                    tmpColumns['custom4'] = {
                        name: 'custom4',
                        type: 'date',
                        filterHeaderTemplate: dateRangeFilterTemplate,
                        filters: [
                            {
                                condition: OPERATOR.GREATER_EQUALS
                            },
                            {
                                condition: OPERATOR.LESS_EQUALS
                            }]
                    };
                    tmpColumns['custom5'] = {
                        name: 'custom5',
                        type: 'date',
                        filterHeaderTemplate: dateRangeFilterTemplate,
                        filters: [
                            {
                                condition: OPERATOR.GREATER_EQUALS
                            },
                            {
                                condition: OPERATOR.LESS_EQUALS
                            }]
                    };

                    /**
                     * Only print enable columns
                     */
                    angular.forEach(columnsToShow, function (column, key) {
                        if( tmpColumns[column.key] != undefined) {
                            self.columns.push(tmpColumns[column.key]);
                        }else{
                            console.log('You must declare column config for key '+column.key);
                        }

                    });
                    deferred.resolve('ok');
                });
                return deferred;
            }
        }
    }])
;