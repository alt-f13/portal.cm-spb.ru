'use strict';

/**
 * @ngdoc function
 * @name angularTestApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the angularTestApp
 */
angular.module('angularTestApp')
  .controller('LoginCtrl', function ($scope, couchdb, $uibModalInstance, $rootScope) {
    var $db = $scope.$db = couchdb;
    //$scope.authenticated=$rootScope.authenticated;

    $scope.submitLogin = function() {
      //console.log($scope);
      $db.user.login($scope.username, $scope.password, function(data) {
        $db.user.isAuthenticated(function(data) {
          console.log('isAuthenticated', data);
          $rootScope.$broadcast("authenticated", data);

        });

      });
      $uibModalInstance.close();

    }

    $scope.close = function () {
      $uibModalInstance.dismiss('cancel');
    };

  });
