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

      });
      $uibModalInstance.close();

    }

    $scope.close = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });
