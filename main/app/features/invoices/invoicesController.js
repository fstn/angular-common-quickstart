'use strict';

angular.module('supplier.portal')
    .controller('InvoiceController', [
        '$q',
        '$scope',
        '$http',
        '$filter',
        '$templateCache',
        'QueryFactory',
        'QueryParamFactory',
        'Invoice',
        'LazyGridService',
        'InvoiceColumns',
        'Error',
        'OPERATOR',
        function ($q, $scope, $http, $filter, $templateCache, QueryFactory, QueryParamFactory, Invoice, LazyGridService, InvoiceColumns, Error, OPERATOR) {

            /**
             * variable declaration
             */
            var lazyGridService;
            var columnsToShow = [];

            /**
             * scope
             */
            //show hide loading gif
            $scope.isBusy = true;


            //TODO Brancher le service metadata pour remplir cette liste
            var columnsToShow = [
                {key: 'status', visible: true},
                {key: 'dueDate', visible: true},
                {key: 'batchName', visible: false},
                {key: 'date', visible: true},
                {key: 'number', visible: true},
                {key: 'totalAmount', visible: true},
                {key: 'supplier', visible: true},
                {key: 'company', visible: true}
            ];

            /**
             * init
             */
            $scope.$on('$viewContentLoaded', function () {
                /**
                 * load grid column,load:
                        - config (columnDefs)
                        - content(dropDownOptions)
                 */
                var columnPromise = InvoiceColumns.initialize(columnsToShow, {dropDown:$templateCache.get('dropDownFilter.html'),'dateRange': $templateCache.get('dateRangeFilter.html'),string: $templateCache.get('stringFilter.html')}).$promise;

                $q.all([columnPromise])
                    .then(function () {
                        //column config is available
                    })
                    .finally(function (end) {
                        //remove gif loading
                        $scope.isBusy = false;
                    })
                    .catch(
                        function (httpResponse) {
                            //TODO gestion des erreur, j'ai fait le service, il faut maintenant ajouter le toast toasterContent à la page
                            ErrorService.displayErrorMessage($scope, httpResponse, "SP_FILTER_CONFIG");
                        });
            });


            /**
             * ui-grid loading function, will be call on:
                     -filter
                     -pagination
                     -sorter
             see lazyGridService
             */
            var load = function () {
                var firstRow = (lazyGridService.paginationOptions.pageNumber - 1) * lazyGridService.paginationOptions.pageSize;
                //rest api query
                var query = QueryFactory.create(lazyGridService.filter, firstRow, lazyGridService.paginationOptions.pageSize, lazyGridService.paginationOptions.sort);
                Invoice.getWithFilter.get({query: query.build()}, function (data) {
                    $scope.invoicesGrid.data = data.items;
                    $scope.invoicesGrid.totalItems = data.metadata.count;

                });
            };


            /**
             * ui-grid declaration
             */
            lazyGridService = LazyGridService.create(load);
            $scope.invoicesGrid = lazyGridService.getGrid([25, 50, 75], 25, InvoiceColumns.columns, $scope);

            /**
             * Call when user click
             * @param row
             */
            lazyGridService.rowSelectionChanged = function(row){
                alert(row);
            }
            load();

        }])
;
