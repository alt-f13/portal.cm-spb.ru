'use strict';
var db_name = 'gbook';

function transponse(arr) {
  return arr.map(function(col, i) {
    return arr.map(function(row) {
      return row[i]
    })
  });
};

/**
 * @ngdoc function
 * @name angularTestApp.controller:SchedulerCtrl
 * @description
 * # SchedulerCtrl
 * Controller of the angularTestApp
 */
angular.module('angularTestApp')
  .controller('SchedulerCtrl', function ($scope, $sce, $filter, $interval, $q, couchdb, $routeParams, $location) {
    var $db = $scope.$db = couchdb;
    var _day;
    $scope.gridOptions = {};
    $scope.gridOptions.enableCellEditOnFocus = true;
    $scope.gridOptions.enableSorting = false;

    $scope._doc={};
    $scope._doc.grid={};
    $scope._doc.grid.data={};

    if($routeParams.day ===  undefined) {
        var tomorrow=Date.today().add(1).days();
        if(tomorrow.is().sunday()||tomorrow.is().saturday()) {
          tomorrow=Date.today().next().monday();
        }
        $scope._day = moment(tomorrow).unix().toString();
        $location.path("/scheduler/"+ $scope._day);
      } else {
        console.log($routeParams);
        $scope._day = $routeParams.day;
      }
    $scope._day_literal = moment.unix($scope._day).format("dddd").toLowerCase();


    $db.doc.get($scope._day_literal+"2", function(data) {
      $scope._doc=data;
      $scope._doc._id=$scope._day;
      $scope._doc.type="schedule";
      $scope._doc._rev="";
      console.log($scope._doc);
      $scope.$apply();

    })

    $scope.location = function (_day) {
      $location.path("/scheduler/"+ _day);
      $scope.$apply
    }

    $db.doc.get($scope._day, function(data) {
        $scope.details = data;
        console.log(data);
    })
      .error(function() {
        console.log("error");
        $db.doc.get($scope._day_literal, function(data) {
          data._rev = undefined;
          data.type = "schedule"
          console.log(data);
          $scope.details = data;
          $scope.details._id=$scope._day;
          $scope.server.doc.put($scope.details, function(data) {
            $scope.details._rev=data.rev;
            console.log(data);
          });
        });
      });


    $scope.gridOptions.onRegisterApi = function(gridApi){
      //set gridApi on scope
      $scope.gridApi = gridApi;
      gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
            console.log($scope.gridOptions.data);
          });
    };




  });
