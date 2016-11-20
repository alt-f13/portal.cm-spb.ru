'use strict';

/**
 * @ngdoc function
 * @name angularTestApp.controller:PostCtrl
 * @description
 * # PostCtrl
 * Controller of the angularTestApp
 */
angular.module('angularTestApp')
  .controller('PostCtrl', function ($scope, $filter, couchdb, $location, $routeParams, FileUploader) {
    $scope.$db = couchdb;
    $scope.details = {};
    $scope.details._id = $routeParams.id;
    $scope.$db.doc.get($scope.details._id, function(data) {
        $scope.details = data;
        console.log(data);
    });
    $scope.submitEntry = function() {
      console.log($scope.details);
      $scope.$db.doc.put($scope.details, function(data) {
        console.log(data);
        $scope.details._rev = data.rev;

      })
    }
    var uploader = $scope.uploader = new FileUploader({
       url: 'upload.php'
     });

   // FILTERS

   uploader.filters.push({
       name: 'imageFilter',
       fn: function(item /*{File|FileLikeObject}*/, options) {
           var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
           return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
       }
   });

   // CALLBACKS

   uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
       console.info('onWhenAddingFileFailed', item, filter, options);
   };
   uploader.onAfterAddingFile = function(fileItem) {
       console.info('onAfterAddingFile', fileItem);
       $scope.$db.attach.put($scope.details, fileItem._file, {}, function(data) {
         console.log(data);
       });

   };
   uploader.onAfterAddingAll = function(addedFileItems) {
       console.info('onAfterAddingAll', addedFileItems);
   };
   uploader.onBeforeUploadItem = function(item) {
       console.info('onBeforeUploadItem', item);
   };
   uploader.onProgressItem = function(fileItem, progress) {
       console.info('onProgressItem', fileItem, progress);
   };
   uploader.onProgressAll = function(progress) {
       console.info('onProgressAll', progress);
   };
   uploader.onSuccessItem = function(fileItem, response, status, headers) {
       console.info('onSuccessItem', fileItem, response, status, headers);
   };
   uploader.onErrorItem = function(fileItem, response, status, headers) {
       console.info('onErrorItem', fileItem, response, status, headers);
   };
   uploader.onCancelItem = function(fileItem, response, status, headers) {
       console.info('onCancelItem', fileItem, response, status, headers);
   };
   uploader.onCompleteItem = function(fileItem, response, status, headers) {
       console.info('onCompleteItem', fileItem, response, status, headers);
   };
   uploader.onCompleteAll = function() {
       console.info('onCompleteAll');
   };

   console.info('uploader', uploader);


  });
