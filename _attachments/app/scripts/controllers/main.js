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
  .controller('MainCtrl', function ($scope, $filter, couchdb, $uibModal, $cookies, $rootScope) {
    var $db = $scope.$db = couchdb;
    //$rootScope.authenticated = $scope.authenticated;
    $scope.session = function() {
      $db.user.session(function(data) {
        console.log('session', data);
        $scope.isAuthenticated();
      });
    };
    $scope.isAuthenticated = function() {
      $db.user.isAuthenticated(function(data) {
        console.log('isAuthenticated', data);
        //$scope.authenticated=data;
        //$rootScope.authenticated = $scope.authenticated;
        $scope.$emit("authenticated", data);
        $scope.$broadcast("authenticated", data);
        $scope.authenticated=data;

      });
    }
    $scope.session();
    //$scope.isAuthenticated();
    $scope.logout=function() {
      $db.user.logout(function(data) {
        console.log(data);
        $scope.isAuthenticated();
      });
    };

    $scope.loginModal = function() {
      console.log($db.user.get());

      $uibModal.open({
        templateUrl: 'login.html',
        size: 'sm',
        controller: 'LoginCtrl'
      }).closed.then(function() {
        $scope.isAuthenticated();

      });
    };



  });
