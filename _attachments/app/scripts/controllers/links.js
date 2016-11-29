
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

    $scope.getLinks = function() {
      $scope.$db.view('scheduler', 'links', {}, function(data) {
        $scope.docs=data;
        console.log(data);
      });
      $db.uuid(function(data) {
        $scope.uuid=data.uuids;
        //console.log($scope.uuid);
      });
    };
    $scope.getLinks();
    $scope.submitEntry = function() {
      $scope.link.type="link";
      $scope.link._id=$scope.uuid.toString();

      $scope.$db.doc.put($scope.link, function(data) {

        console.log(data);
        //$scope.details._rev = data.rev;
        //$uibModalInstance.close();
        $scope.getLinks();

      });
    };

  });
