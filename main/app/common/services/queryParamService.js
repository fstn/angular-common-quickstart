'use strict';
/**
 * Query param service
 */
angular.module('supplier.portal').factory('QueryParamFactory', [function () {
    function QueryParam(key, value, operator) {
        this.key = key;
        this.value = value;
        this.operator = operator;

    }
    return {
        /**
         * create a queryParam
         * @param key: name
         * @param value: myName
         * @param operator: OPERATOR.equals
         * @returns {QueryParam}
         */
        create: function (key, value, operator) {
            return new QueryParam(key, value, operator);
        }
    }
}]);