'use strict';

/**
 * @ngdoc function
 * @name angularTestApp.controller:PostsCtrl
 * @description
 * # PostsCtrl
 * Controller of the angularTestApp
 */
angular.module('angularTestApp')
  .controller('PostsCtrl', function ($scope, couchdb) {
      $scope.$db = couchdb;
      $scope.$db.view('scheduler', 'posts', {}, function(data) {
        $scope.posts=data;
        console.log(data);
      });
  });
