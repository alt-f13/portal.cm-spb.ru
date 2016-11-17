'use strict';

/**
 * @ngdoc directive
 * @name angularTestApp.directive:editableTable
 * @description
 * # editableTable
 */
angular.module('angularTestApp')
  .directive('editableTable', function () {
    return {
      link: function postLink(scope, element, attrs) {
        //console.log(element);
        //scope.change();
        element.editableTableWidget();
        //console.log($(this));
        element.on("change", function(event) {
          /* Act on the event */

          scope.change(element.html());


        });
      }
    };
  });
