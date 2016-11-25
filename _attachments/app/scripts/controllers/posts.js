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
      $db.user.isAuthenticated(function(data) {
        console.log(data);
        $scope.authenticated=data;
      });

      $db.uuid(function(data) {
        $scope.uuid=data.uuids;
        //console.log($scope.uuid);
      });
      $scope.update_posts = function() {
        $scope.$db.view('scheduler', 'posts', {}, function(data) {
          $scope.posts=data;
          //console.log(data);
        });
      };
      $scope.update_posts();
      $scope.edit = function(id) {
        //console.log(id);
        var template;
        if ($scope.authenticated) {
          template='edit.html';
        }else{
          template='show.html'
        }
        $uibModal.open({
          templateUrl: template,
          size: 'lg',
          controller: 'EditCtrl',
          resolve: {
                 id: function () {
                   return id;
                 }
               }
        }).closed.then(function() {
          $scope.update_posts();

        });
      }
  })
  .controller('EditCtrl', function ($scope, couchdb, $uibModalInstance, id, $cookies) {
    var $db = $scope.$db = couchdb;
    $scope.details = {};
    $db.user.isAuthenticated(function(data) {
      console.log(data);
    });
    $scope.details._id = id.toString();
    $scope.details.id=$scope.details._id;
    $scope.details.type="post";
    $scope.docUrl=$scope.$db.config.getServer()+"/"+$scope.$db.db.getName()+"/"+id+"/";
    $scope.$db.doc.get($scope.details._id, function(data) {
        $scope.details = data;
        console.log(data);
    });
    $scope.updateAttachments = function() {
      $db.doc.get($scope.details._id, function(data) {
          $scope.details._attachments = data._attachments;
          console.log(data._attachments);
      });
    };


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
      var _rev=$scope.details._rev;
      console.log(files);
      $scope.db_attach(files, 0);
    };
    $scope.db_attach = function(files, i) {
      $scope.$db.attach.put($scope.details, files[i], {}, function(data) {
        console.log(data);
        $scope.details._rev = data.rev;
        $scope.updateAttachments();
        ++i;
        console.log(  $scope.attachments);
        $scope.db_attach(files, i);
      });

    }




});
