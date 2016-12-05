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
    $scope._doc={
      grid: {
        data: {},
        columns: {}
      },
      cellStyle: new Array(10)
    };
    $scope.validRenderer = function(instance, td, row, col, prop, value, cellProperties){
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        //console.log('validRenderer: ',td, row, col, prop, value);
        var _row = $scope._doc.cellStyle[row];
        if(_row && _row !== null) {
          if(typeof _row[col] !== 'undefined') {
            td.style.backgroundColor = "#eee";
            $(td).addClass("edited");
            console.log(td);
          }
           //console.log("exist", col, _row[col]);
           //console.log(td.style);
        }
        //console.log(td);

        return td;
    };
    $scope.dates=[];


        $scope.location = function (_day) {
          $location.path("/scheduler/"+ _day);
          $scope.$apply
        }
    $scope.settings = {
      // contextMenu: [
      //   'row_above', 'row_below', 'remove_row'
      // ],
      rowHeights: 50,
      stretchH: 'all',
      colWidths: 30, // can also be a number or a function
      rowHeaders: true,
      colHeaders: true,
      mergeCells: $scope._doc.grid.mergeCells,
      // callbacks have 'on' prefix
      onAfterInit: function() {
        //console.log('onAfterInit call');
      },
      onAfterChange: function(index, amount) {
        //console.log($scope._doc);
        //console.log(index , amount);
        if(index) {
          if(!$scope._doc.cellStyle) $scope._doc.cellStyle=new Array(10);
          if(!$scope._doc.cellStyle[index[0][0]]) $scope._doc.cellStyle[index[0][0]]={};
          $scope._doc.cellStyle[index[0][0]][index[0][1]]="grey"
        }

        $db.doc.put($scope._doc, function(data) {
          console.log("put:", data);
          $scope._doc._rev=data.rev;
        });
      },
      // contextMenuCopyPaste: {
      //       swfPath: 'zeroclipboard/dist/ZeroClipboard.swf';
      // }

    };


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

    $db.doc.get($scope._day, function(data) {
        $scope._doc=data;

        console.log(data);
    })
      .error(function() {
        console.log("error");
        $db.doc.get($scope._day_literal, function(data) {
          $scope._doc=data;
          moment.locale("ru");
          $scope._doc.date=moment.unix($scope._day).format('dddd DD MMMM YYYY');
          $scope._doc._id=$scope._day;
          $scope._doc.type="schedule";
          $scope._doc._rev=undefined;
          $scope._doc.cellStyle=new Array(10);
          $scope.settings.mergeCells = data.grid.mergeCells;
          console.log($scope._doc);
          //$scope.$apply();

        });
      });

  $db.view('scheduler', 'schedules', {}, function(data) {
    console.log(data);
    $scope.dates=data.map(function(i) {
      return i.id;
    });
    //$scope.$apply
  });



  });
