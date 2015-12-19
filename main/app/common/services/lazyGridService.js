/**
 * Created by SZA on 15/12/2015.
 */
'use strict';
/**
 * Service that provide method to manage lazy loading datagrid
 */
angular.module('supplier.portal')
    .factory('LazyGridService', ['OPERATOR', 'QueryParamFactory',
        function (OPERATOR, QueryParamFactory) {

            /**
             * Service object
             * @param callBack: method to call after every event (filter,sort,page), generally it's the load function
             * @constructor
             */
            function LazyGridService(callBack) {
                this.callBack = callBack;
                this.paginationOptions = {
                    pageNumber: 1,
                    pageSize: 25,
                    sort: {
                        name: undefined,
                        direction: undefined
                    }
                };

                this.filter = [];
                var self = this;
                /**
                 * Call on filter change
                 */
                this.filterChange = function () {
                    var key = '';
                    var value = '';
                    var condition = OPERATOR.EQUALS;
                    self.filter = [];
                    for (var i = 0; i < this.grid.columns.length; i++) {
                        key = this.grid.columns[i].field;
                        for (var j = 0; j < this.grid.columns[i].filters.length; j++) {
                            value = this.grid.columns[i].filters[j].term;
                            // if filter key is override
                            var rsqlKey = this.grid.columns[i].filters[j].rsqlKey;
                            if (rsqlKey != undefined) {
                                key = rsqlKey;
                            }

                            if (this.grid.columns[i].filters[j].condition != undefined) {
                                condition = this.grid.columns[i].filters[j].condition;
                            }
                            if (value != undefined && value != '') {
                                console.log('Field: ' + key + '\nSearch Term: ' + value);
                                var queryParam = QueryParamFactory.create(key, value, condition)
                                self.filter.push(queryParam);
                            }
                        }
                    }
                    self.callBack();
                };
                /**
                 * Call on sort change
                 * @param grid
                 * @param sortColumns
                 */
                this.sortChange = function (grid, sortColumns) {
                    if (sortColumns.length == 0) {
                        self.paginationOptions.sort.name = null;
                        self.paginationOptions.sort.direction = null;
                    } else {
                        self.paginationOptions.sort.name = sortColumns[0].name;
                        self.paginationOptions.sort.direction = sortColumns[0].sort.direction;
                    }
                    self.callBack();
                };
                /**
                 * Call when page changed
                 * @param newPage
                 * @param pageSize
                 */
                this.paginationChanged = function (newPage, pageSize) {
                    self.paginationOptions.pageNumber = newPage;
                    self.paginationOptions.pageSize = pageSize;
                    self.callBack();
                };
                /**
                 * Call when user click on row
                 * @param row
                 */
                this.rowSelectionChanged = function (row) {
                };

                /**
                 * Return grid configuration
                 * @param paginationPageSizes: [0,25,50]
                 * @param paginationPageSize: 25
                 * @param columnDefs:[{
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
                    }]
                 * @param appScope: scope link to the grid
                 * @returns {{paginationPageSizes: *, paginationPageSize: *, useExternalPagination: boolean, useExternalSorting: boolean, enableFiltering: boolean, useExternalFiltering: boolean, data: Array, columnDefs: *, onRegisterApi: LazyGridService.onRegisterApi}}
                 */
                this.getGrid = function (paginationPageSizes, paginationPageSize, columnDefs, appScope) {
                    return {
                        paginationPageSizes: paginationPageSizes,
                        paginationPageSize: paginationPageSize,
                        useExternalPagination: true,
                        useExternalSorting: true,
                        enableFiltering: true,
                        enableRowSelection: true,
                        enableRowHeaderSelection: false,
                        multiSelect: false,
                        modifierKeysToMultiSelect : false,
                        noUnselect : true,
                        useExternalFiltering: true,
                        data: [],
                        columnDefs: columnDefs,
                        onRegisterApi: function (gridApi) {
                            appScope.gridApi = gridApi;
                            appScope.gridApi.core.on.filterChanged(appScope, self.filterChange)
                            appScope.gridApi.core.on.sortChanged(appScope, self.sortChange);
                            appScope.gridApi.pagination.on.paginationChanged(appScope, self.paginationChanged);
                            appScope.gridApi.selection.on.rowSelectionChanged(appScope, self.rowSelectionChanged);
                        }
                    }
                }
            }

            return {
                /**
                 * Constructor method
                 * @param callBack: method to call after every event (filter,sort,page), generally it's the load function
                 * @returns {LazyGridService}
                 */
                create: function (callBack) {
                    return new LazyGridService(callBack);
                }
            }

        }]);