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
  .controller('MainCtrl', function ($scope, $filter, couchdb, $uibModal, $cookies) {
    var $db = $scope.$db = couchdb;
    $db.user.isAuthenticated(function(data) {
      console.log(data);
      $scope.authenticated=data;
    });
    $db.user.session(function(data) {
      console.log(data);
      //$cookies.put("AuthSession", data);
    });
    $scope.logout=function() {
      $db.user.logout(function(data) {
        console.log(data);
        $db.user.isAuthenticated(function(data) {
          console.log(data);
          $scope.authenticated=data;
        });
      });
    };

    $scope.loginModal = function() {
      console.log($db.user.get());

      $uibModal.open({
        templateUrl: 'login.html',
        size: 'sm',
        controller: 'LoginCtrl'
      }).closed.then(function() {
        $db.user.isAuthenticated(function(data) {
          console.log(data);
          $scope.authenticated=data;
        });
      });
    };

  });
