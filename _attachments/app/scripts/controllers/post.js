'use strict';

/**
 * @ngdoc function
 * @name angularTestApp.controller:PostCtrl
 * @description
 * # PostCtrl
 * Controller of the angularTestApp
 */
angular.module('angularTestApp')
  .controller('PostCtrl', function ($scope, $filter, couchdb, $location, $routeParams, Upload, $timeout) {
    $scope.$db = couchdb;
    $scope.details = {};
    $scope.details._id = $routeParams.id;
    $scope.docUrl=$scope.$db.config.getServer()+"/"+$scope.$db.db.getName()+"/"+$routeParams.id+"/";
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

      })
    }
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
                });
                }
              }
            }

    };
    // $scope.$on('authenticated', function(e,data) {
    //   console.log("postsctrl authenticated event data:", data);
    //   $scope.authenticated=data;
    // })

  });
