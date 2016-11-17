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
  .controller('SchedulerCtrl', function ($scope, $sce, $filter, couchdb, $routeParams, $location) {
    console.log($routeParams.day);

    if($routeParams.day ===  undefined) {
      var tomorrow=Date.today().add(1).days();
      if(tomorrow.is().sunday()||tomorrow.is().saturday()) {
        tomorrow=Date.today().next().monday();
      }
      $scope._day = moment(tomorrow).unix().toString();
      console.log( $scope._day)
      $location.path("/"+ $scope._day);
    }else {
      console.log($routeParams);
      $scope._day = $routeParams.day;
    }
    $scope._day_literal = moment.unix($scope._day).format("dddd").toLowerCase();


    //$scope.server = cornercouch("https://admin:sdc888@couch.2d-it.ru", "GET");
    //$scope.server = cornercouch("http://localhost:5984", "GET");
    $scope.server = couchdb;
    console.log($scope.server);

    // I think
    $scope.server.user.session(function(data) {
       if ( $scope.server.userCtx && $scope.server.userCtx.name ) {
          $scope.showInfo = true;
          $scope.getInfos();
       }
    });
    $scope.gbookdb = $scope.server;
    //$scope.gbookdb = $scope.server.getDB(db_name);
    //$scope.gbookdb.getInfo();
    //$scope.newentry = $scope.gbookdb.newDoc();
    $scope.gbookdb.view('scheduler', 'index', {
        //include_docs: true,
        //descending: true,
        limit: 8
    });
    //$scope.tpl=
    //$scope._tpl._id=timestamp.toString();
    //console.log($scope.tpl);
    //$scope.tpl._id=timestamp.toString();
    //$scope.server.doc.put($scope.tpl);

    //console.log($scope.tpl.$$state);

    //console.log($scope.nDoc);
    //$scope.nDov.save();
    //$scope.nDoc._id = timestamp;
    //$scope.nDoc.save().error(setError);
    $scope.gbookdb.doc.get($scope._day, function(data) {
        $scope.details = data;
        console.log(data);
    })
      .error(function() {
        console.log("error");
        $scope.gbookdb.doc.get($scope._day_literal, function(data) {
          data._rev = undefined;
          console.log(data);
          $scope.details = data;
          $scope.details._id=$scope._day;
          $scope.server.doc.put($scope.details);
        });
      });

    $scope.change= function(data) {
      console.log("change");
      $scope.details.data=data;
      //$scope.details._id=timestamp.toString();
      $scope.server.doc.post($scope.details, function(data) {
        $scope.details._rev = data.rev;
        console.log(data);
        console.log($scope.details);

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
