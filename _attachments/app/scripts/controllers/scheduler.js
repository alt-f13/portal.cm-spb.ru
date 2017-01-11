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
  .controller('SchedulerCtrl', function ($scope, couchdb, $routeParams, $location, hotRegisterer, $rootScope) {
    var $db = $scope.$db = couchdb;
    var _day;

    var _hot =hotRegisterer.getInstance('my-handsontable');
    $scope.$on('authenticated', function(e,data) {
      console.log("sheduler authenticated event data:", data);
      $scope.authenticated=data;
    });

    $rootScope._doc={
      grid: {
        data: {},
        columns: {}
      },
      cellStyle: new Array(10)
    };
    $scope.validRenderer = function(instance, td, row, col, prop, value, cellProperties){
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        //console.log('validRenderer: ',td, row, col, prop, value);
        //var _row = $rootScope._doc.cellStyle[row];
        if($rootScope._doc.cellStyle[row] && $rootScope._doc.cellStyle[row] !== null) {
          if(typeof $rootScope._doc.cellStyle[row][col] !== 'undefined') {
            td.style.backgroundColor = "#eee";
            $(td).addClass("edited");
            //console.log(td);
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
      contextMenu: true,
      rowHeights: 50,
      stretchH: 'all',
      colWidths: 30, // can also be a number or a function
      rowHeaders: true,
      colHeaders: true,
      mergeCells: $rootScope._doc.grid.mergeCells,
      // callbacks have 'on' prefix
      onAfterInit: function() {
        //console.log('onAfterInit call');
      },
      onAfterChange: function(index, amount) {
        //console.log(index , amount);
        if(index && $rootScope._doc.type=='schedule') {
          console.log("onAfterChange:", $rootScope._doc);

          if(!$rootScope._doc.cellStyle) $rootScope._doc.cellStyle=new Array(10);
          if(!$rootScope._doc.cellStyle[index[0][0]]) $rootScope._doc.cellStyle[index[0][0]]={};
          $rootScope._doc.cellStyle[index[0][0]][index[0][1]]="grey"
          $db.doc.put($rootScope._doc, function(data) {
            console.log("put:", data);
            $rootScope._doc._rev=data.rev;
          });
        }else if (index && $rootScope._doc.type=='template') {
          $db.doc.put($rootScope._doc, function(data) {
            console.log("put:", data);
            $rootScope._doc._rev=data.rev;
          });
        }


      },
      contextMenuCopyPaste: {
            swfPath: 'bower_components/zeroclipboard/dist/ZeroClipboard.swf'
      }

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
        $rootScope._doc=data;
        console.log(data);
        if(data.type=='template') {
          data.cellStyle=new Array(10);

        }
    })
      .error(function() {
        //console.log("error");
        $db.doc.get($scope._day_literal, function(data) {
          moment.locale("ru");
          data.date=moment.unix($scope._day).format('dddd DD MMMM YYYY');
          data._id=$scope._day;
          data.type="schedule";
          data._rev=undefined;
          //console.log($db.user.get());
          data.author=$db.user.get().name;
          data.cellStyle=new Array(10);
          // console.log(_hot.mergeCells.mergeRange(data.grid.mergeCells));
          // _hot.mergeCells = new Handsontable.MergeCells(data.grid.mergeCells);
          // _hot.updateSettings({ mergeCells: data.grid.mergeCells, cells: data.grid.data });
          // _hot.render();
          //$scope.settings.mergeCells = data.grid.mergeCells;
          //console.log(data);
          //$rootScope._doc=data;
          console.log(data);
          $db.doc.put(data, function(data2) {
            console.log("new created:", data2);
            //$rootScope._doc._rev=data.rev;
            $db.doc.get($scope._day, function(data3) {
                $rootScope._doc=data3;
                console.log(data3);
            });
          });


        });
      });

  $db.view('scheduler', 'schedules', {}, function(data) {
    //console.log(data);
    $scope.dates=data.map(function(i) {
      return i.id;
    });
    //$scope.$apply
  });



  });
