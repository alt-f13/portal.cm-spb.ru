'use strict';

/**
 * @ngdoc overview
 * @name angularTestApp
 * @description
 * # angularTestApp
 *
 * Main module of the application.
 */
var db_name = 'gbook';

var $app = angular
  .module('angularTestApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'SimpleCouch',
    '720kb.datepicker'
  ])
  .config(function ($routeProvider,$httpProvider,couchConfigProvider) {
    $routeProvider
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/:day?', {
        templateUrl: 'views/scheduler.html',
        controller: 'SchedulerCtrl',
        controllerAs: 'scheduler'
      })
      .otherwise({
        redirectTo: '/'
      });
    couchConfigProvider.setServer('http://127.0.0.1:5984');
    couchConfigProvider.setDB('gbook');
    //couchConfigProvider.setMethod('method GET/JSONP');

  });
