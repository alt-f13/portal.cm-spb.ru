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
    $scope.dates=[];
    $scope._doc={};
    $scope._doc.grid = {
      enableHorizontalScrollbar: false,
      enableVerticalScrollbar:false,
      rowEditWaitInterval: -1,
      enableSorting: false,
      enableFiltering: false,
      headerRowHeight: 30,
      rowHeight: 80,

    };
    $scope._doc.grid.data={};
    //$scope._doc.grid.enableCellEditOnFocus = true;
    //$scope._doc.grid.enableSorting = false;
    //$scope._doc.grid.rowEditWaitInterval= -1;


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
      moment.locale("en");
    $scope._day_literal = moment.unix($scope._day).format("dddd").toLowerCase();




    $scope.location = function (_day) {
      $location.path("/scheduler/"+ _day);
      $scope.$apply
    }

    $db.doc.get($scope._day, function(data) {
        $scope._doc=data;
        console.log(data);
    })
      .error(function() {
        console.log("error");
        $db.doc.get($scope._day_literal+"2", function(data) {
          $scope._doc=data;
          moment.locale("ru");
          $scope._doc.date=moment.unix($scope._day).format('dddd DD MMMM YYYY');
          $scope._doc._id=$scope._day;
          $scope._doc.type="schedule";
          $scope._doc._rev=undefined;
          console.log($scope._doc);
          //$scope.$apply();

        });
      });
  $db.view('scheduler', 'schedules', {}, function(data) {
    console.log(data);
    $scope.dates=data.map(function(i) {
      return i.id;
    });
    $scope.$apply
  });


    $scope._doc.grid.onRegisterApi = function(gridApi){
      //set gridApi on scope
      $scope.gridApi = gridApi;
      gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
            console.log($scope._doc);
            $db.doc.put($scope._doc, function(data) {
              console.log("put:", data);
              $scope._doc._rev=data.rev;
            });
          });
    };




  });
