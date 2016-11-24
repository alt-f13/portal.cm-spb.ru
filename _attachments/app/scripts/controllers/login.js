'use strict';

/**
 * @ngdoc function
 * @name angularTestApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the angularTestApp
 */
angular.module('angularTestApp')
  .controller('LoginCtrl', function ($scope, couchdb, $uibModalInstance, $cookies) {
    var $db = $scope.$db = couchdb;

    $scope.submitLogin = function() {
      //console.log($scope);
      $db.user.login($scope.username, $scope.password, function(data) {
        console.log(data);
      }).success(function(data, status, header, config) {
        console.log(header());
      });
      $uibModalInstance.close();
      $db.user.isAuthenticated(function(data) {
        console.log(data);
        console.log($db.user.get());
      });
    }

    $scope.close = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });
