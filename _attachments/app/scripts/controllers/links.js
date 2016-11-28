'use strict';

/**
 * @ngdoc function
 * @name angularTestApp.controller:LinksCtrl
 * @description
 * # LinksCtrl
 * Controller of the angularTestApp
 */
angular.module('angularTestApp')
  .controller('LinksCtrl', function ($scope,couchdb) {
    var $db = $scope.$db = couchdb;
    $db.doc.get('form', function(data) {
      console.log(data);
      $scope.form=data.form;
      $scope.schema=data.schema;
    });

  });
