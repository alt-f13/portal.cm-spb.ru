'use strict';
var db_name = 'gbook';

/**
 * @ngdoc function
 * @name angularTestApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularTestApp
 */
angular.module('angularTestApp')
  .controller('MainCtrl', function ($scope, $filter, couchdb, $location, $routeParams) {
    $scope.$db = couchdb;
    if($routeParams.id === undefined) {

    }
    $scope.$db.doc.get($routeParams.id, function(data) {
        $scope.details = data;
        console.log(data);
    })
  });
