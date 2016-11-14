'use strict';
var db_name = 'gbook';

/**
 * @ngdoc function
 * @name angularTestApp.controller:SchedulerCtrl
 * @description
 * # SchedulerCtrl
 * Controller of the angularTestApp
 */
angular.module('angularTestApp')
  .controller('SchedulerCtrl', function ($scope, $sce, $filter, cornercouch) {
    var tomorrow=Date.today().add(1).days();
    if(tomorrow.is().sunday()||tomorrow.is().saturday()) {
      tomorrow=Date.today().next().monday();
    }
    //console.log();
    var timestamp=moment(tomorrow).unix();
    var _day=moment.unix(timestamp).format("dddd").toLowerCase();
    console.log(timestamp)

    $scope.server = cornercouch("http://localhost:5984", "GET");

    // I think
    $scope.server.session().success(function(data) {
       if ( $scope.server.userCtx && $scope.server.userCtx.name ) {
          $scope.showInfo = true;
          $scope.getInfos();
       }
    });
    //$scope.gbookdb = $scope.server.
    $scope.gbookdb = $scope.server.getDB(db_name);
    $scope.gbookdb.getInfo();
    $scope.newentry = $scope.gbookdb.newDoc();
    $scope.gbookdb.query('scheduler', "index", {
        //include_docs: true,
        //descending: true,
        limit: 8
    });
    $scope._tpl=$scope.gbookdb.getDoc(_day);
    $scope._tpl._id=timestamp.toString();
    console.log(_day);
    console.log($scope._tpl);
    $scope.nDoc = $scope.gbookdb.newDoc($scope._tpl);
    //$scope.nDov.save();
    //$scope.nDoc._id = timestamp;
    //$scope.nDoc.save().error(setError);
    $scope.details = $scope.gbookdb.getDoc(timestamp.toString());

    $scope.change= function(data) {
      console.log("change");
      $scope.details.data=data;
      $scope.details._id=timestamp.toString();
      console.log($scope.details);
      $scope.details.save().success(function() {
        console.log("success");
      });
    };


    $scope.isAuthenticated = function() {
       var ret = false;
       if ($scope.server.userCtx == undefined) {
          $scope.server.session();
       }
       // still need to check it as session only sets on success.
       if ( $scope.server.userCtx && $scope.server.userCtx.name ) {
          ret = true;
       }

       return ret;
    };

    //$scope.changes = $scope.gbookdb.changeSource();

    if( $scope.changes != null )
    {
       var changeListener = function(event) {
          $scope.$apply(function() {
             $scope.gbookdb.queryRefresh();
          });
       };
       $scope.changes.addEventListener('message', changeListener);
    }


    $scope.submitLogin = function() {
        $scope.server.login($scope.loginUser, $scope.loginPass).success(function() {
            $scope.loginPass = $scope.loginUser = "";
            $scope.showInfo = true;
            $scope.getInfos();
            $scope.dismiss_loginModal();
        });
    };

    $scope.getInfos = function() {
            $scope.server.getInfo();
            $scope.server.getDatabases();
            $scope.server.getUUIDs(3);
            $scope.server.getUserDoc();
    };

    $scope.userLogout   =  function() {
       $scope.server.logout();
       $scope.showInfo = false;
    };

    function setError(data, status) {
        $scope.errordata = {
            status: status,
            data: data
        };
    }

    $scope.rowClick = function(idx) {
       if ( $scope.rowExpanded(idx) ) {
          delete $scope['current_idx'];
       }
       else {
          $scope.current_idx = idx;
          $scope.detail = $scope.gbookdb.getQueryDoc(idx);
          if ( $scope.formDetail ) {
            $scope.formDetail.$setPristine();
          }
       }
    };

    $scope.rowExpanded = function(idx) {
       var expanded = false;
       if ($scope.current_idx != undefined ) {
          if ( $scope.current_idx == idx ) {
             expanded = true;
          }
       }
       return expanded;
    };

    $scope.nextClick = function() {
        $scope.gbookdb.queryNext();
        delete $scope.detail;
    };
    $scope.prevClick = function() {
        $scope.gbookdb.queryPrev();
        delete $scope.detail;
    };
    $scope.moreClick = function() {
        $scope.gbookdb.queryMore();
    };

    $scope.getRowOrDetail = function(row) {
       var this_row;
       if (row) {
          this_row = row.doc;
          if (this_row instanceof $scope.gbookdb.docClass) {
          }
          else {
             this_row = $scope.gbookdb.newDoc(this_row);
             row.doc = this_row;
          }
       }
       else {
          this_row = $scope.detail;
       }
       return this_row;
    }

    $scope.removeClick = function(row) {
       row = $scope.getRowOrDetail(row);
       if ( $scope.userCanEdit(row) ) {
          row.remove().success(function() {
               delete $scope.detail;
               $scope.gbookdb.queryRefresh();
          }).error(setError);
       }
       else {
          setError({},"user can't delete that");
       }
    };

    $scope.updateClick = function(row) {
        row = $scope.getRowOrDetail(row);
        if ( $scope.userCanEdit(row) ) {
            row.save().error(setError).success(function() {
               $scope.formDetail.$setPristine();
            });
        }
    };
    $scope.attachClick = function() {
        var fileInput = document.getElementById("upload");
        $scope.detail.attachMulti(fileInput.files, function() {
            fileInput.value = "";
        });
    };
    $scope.detachClick = function(name) {
        $scope.detail.detach(name);
    };
    $scope.submitEntry = function() {
        var now = new Date();
        var now = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
        $scope.newentry.utc = $filter("date")(now, "yyyy-MM-dd HH:mm:ss");
        $scope.newentry.user_created = $scope.server.userCtx;
        $scope.newentry.save().success(function() {
            $scope.dismiss_newEntryModal();
            delete $scope.errordata;
            $scope.detail = $scope.newentry;
            $scope.newentry = $scope.gbookdb.newDoc();
            $scope.gbookdb.query("test", "utc_only", {
                include_docs: true,
                descending: true,
                limit: 8
            });
        });
    };
    $scope.userCanEdit = function(row) {
       var ret = false;
       if ( row ) {
          if (row.doc ) {
             row = row.doc;
          }
          if ( $scope.server.userCtx ) {
            if( $scope.server.userCtx.name ) {
               if ( row.user_created != undefined ) {
                  if ( row.user_created.name == $scope.server.userCtx.name ) {
                     ret = true;
                  }
               }
               else {
                  ret = true;
               }
            }
          }
       }
       return ret;
    };
  });
