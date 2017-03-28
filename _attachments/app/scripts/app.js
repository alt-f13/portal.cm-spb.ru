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
    //'ngCookies',
    'thatisuday.ng-image-gallery',
    'schemaForm',
    'ui.router',
    'ngHandsontable'
  ])
  .config(function ($routeProvider,$httpProvider,couchConfigProvider, ngImageGalleryOptsProvider) {
    $routeProvider
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/people', {
        templateUrl: 'views/people.html',
        controller: 'PeopleCtrl',
        controllerAs: 'people'
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
      if(location.hostname === 'localhost') {
        couchConfigProvider.setServer("/db");
      }else {
        couchConfigProvider.setServer("https://couch.2d-it.ru");
      }
    couchConfigProvider.setDB('cm-spb');
    $httpProvider.defaults.withCredentials = true;

    //couchConfigProvider.setMethod('method GET/JSONP');


  });
