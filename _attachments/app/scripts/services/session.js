'use strict';

/**
 * @ngdoc service
 * @name angularTestApp.session
 * @description
 * # session
 * Factory in the angularTestApp.
 */
angular.module('angularTestApp')
  .factory('session', function () {
    return {
      authenticated: ''
    };
  });
