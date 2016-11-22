'use strict';

/**
 * @ngdoc function
 * @name angularTestApp.controller:PostsCtrl
 * @description
 * # PostsCtrl
 * Controller of the angularTestApp
 */
angular.module('angularTestApp')
  .controller('PostsCtrl', function ($scope, couchdb, $uibModal) {
      var $db = $scope.$db = couchdb;
      $db.uuid(function(data) {
        $scope.uuid=data.uuids;
        console.log($scope.uuid);
      });
      $scope.$db.view('scheduler', 'posts', {}, function(data) {
        $scope.posts=data;
        console.log(data);
      });
      $scope.edit = function(id) {
        console.log(id);

        $uibModal.open({
          templateUrl: 'edit.html',
          size: 'lg',
          controller: 'EditCtrl',
          resolve: {
                 id: function () {
                   return id;
                 }
               }
        });
      }

  })
  .controller('EditCtrl', function ($scope, couchdb, $uibModalInstance, id) {
    var $db = $scope.$db = couchdb;
    $scope.details = {};
    $scope.details._id = id.toString();
    $scope.details.id=$scope.details._id;
    $scope.details.type="post";
    $scope.docUrl=$scope.$db.config.getServer()+"/"+$scope.$db.db.getName()+"/"+id+"/";
    $scope.$db.doc.get($scope.details._id, function(data) {
        $scope.details = data;
        console.log(data);
    });
    $scope.submitEntry = function() {
      $scope.details.type="post";

      console.log($scope.details);
      $scope.$db.doc.put($scope.details, function(data) {
        console.log(data);
        $scope.details._rev = data.rev;
        $uibModalInstance.close();
      });

    }
    $scope.close = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.$watch('files', function () {
        $scope.upload($scope.files);
    });
    $scope.$watch('file', function () {
        if ($scope.file != null) {
            $scope.files = [$scope.file];
        }
    });
    $scope.log = '';

    $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
              var file = files[i];
              console.log(file);
              if (!file.$error) {
                $scope.$db.attach.put($scope.details, file, {}, function(data) {
                  console.log(data);
                  $scope.details._rev = data.rev;
                });
                }
              }
            }

    };




});
