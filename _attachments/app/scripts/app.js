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
    '720kb.datepicker',
    'ngFileUpload',
    'textAngular',
    'ui.bootstrap',
    'ngCookies',
    'thatisuday.ng-image-gallery',
    'schemaForm',
    'ui.router',
    'ui.grid',
    'ui.grid.edit',
    'ui.grid.rowEdit',
    'ui.grid.cellNav'
  ])
  .config(function ($routeProvider,$httpProvider,couchConfigProvider, ngImageGalleryOptsProvider) {
    $routeProvider
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/post/:id?', {
        templateUrl: 'views/post.html',
        controller: 'PostCtrl',
        controllerAs: 'post'
      })
      .when('/posts', {
        templateUrl: 'views/posts.html',
        controller: 'PostsCtrl',
        controllerAs: 'posts'
      })
      .when('/links', {
        templateUrl: 'views/links.html',
        controller: 'LinksCtrl',
        controllerAs: 'links'
      })
      .when('/scheduler/:day?', {
        templateUrl: 'views/scheduler.html',
        controller: 'SchedulerCtrl',
        controllerAs: 'scheduler'
      })
      .otherwise({
        redirectTo: '/posts'
      });
    couchConfigProvider.setServer('/db');
    couchConfigProvider.setDB('gbook');
    $httpProvider.defaults.withCredentials = true;

    //couchConfigProvider.setMethod('method GET/JSONP');


  });
