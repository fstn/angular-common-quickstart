'use strict';
/**
 * Service that provide RSQL query
 */
angular.module('supplier.portal').factory('QueryFactory', [function () {
        function Query(parameters, start, size, sort) {
            this.parameters = parameters;
            this.start = start;
            this.size = size;
            this.sort = sort;
            /**
             * Method that return RSQL path
             * @returns {string}: query=id==1 and name=="name"
             */
            this.build = function () {
                var result = '';
                if (parameters != undefined) {
                    this.parameters.forEach(function (entry) {
                        if (result.length > 0) {
                            result += " and ";
                        }
                        //formattage ISO des dates
                        if (entry.value instanceof Date) {
                            entry.value = entry.value.toISOString();
                        }
                        result += entry.key + entry.operator + entry.value;
                    });
                }
                result = 'query='+result;
                if (size != null && size != undefined && size != '') {
                    result += "&size=" + this.size;
                }
                if (start != null && start != undefined && start != '') {
                    result += "&start=" + this.start;
                }
                //le sorting en décroissant s'écrit -fieldName
                if (sort != undefined) {
                    if (this.sort.name != undefined) {
                        result += "&sort="
                        if (this.sort.direction == "desc") {
                            result += "-"
                        }
                        result +=this.sort.name;
                    }
                }
                return result;

            };
        }

        return {
            create: function (parameters, start, size, sort) {
                return new Query(parameters, start, size, sort);
            }
        }
    }
    ]
);