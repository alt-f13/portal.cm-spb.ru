'use strict';

/**
 * @ngdoc directive
 * @name angularTestApp.directive:pickmeup
 * @description
 * # pickmeup
 */
angular.module('angularTestApp')
  .directive('pickmeup', function () {
    return {
      link: function postLink(scope, element, attrs) {
        //element.text('this is the pickmeup directive');
        pickmeup(element);
      }
    };
  });
