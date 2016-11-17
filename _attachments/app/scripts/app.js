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
    'SimpleCouch'
  ])
  .config(function ($routeProvider,$httpProvider,couchConfigProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/scheduler', {
        templateUrl: 'views/scheduler.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
    couchConfigProvider.setServer('http://127.0.0.1:5984');
    couchConfigProvider.setDB('gbook');
    //couchConfigProvider.setMethod('method GET/JSONP');

  });
