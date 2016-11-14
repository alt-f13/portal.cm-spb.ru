'use strict';

/**
 * @ngdoc filter
 * @name angularTestApp.filter:trust
 * @function
 * @description
 * # trust
 * Filter in the angularTestApp.
 */
angular.module('angularTestApp')
  .filter("trust", ['$sce', function($sce) {
    return function(htmlCode){
      return $sce.trustAsHtml(htmlCode);
    }
}]);
