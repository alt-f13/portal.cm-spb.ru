'use strict';

/**
 * @ngdoc function
 * @name angularTestApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the angularTestApp
 */
angular.module('angularTestApp')
  .controller('AboutCtrl', function ($scope, $filter, couchdb, $location, $routeParams) {
    $scope.$db = couchdb;
    $scope.$db.view('scheduler', 'posts', {}, function(data) {
      console.log(data);
      $scope.posts=data;
    });

  });
