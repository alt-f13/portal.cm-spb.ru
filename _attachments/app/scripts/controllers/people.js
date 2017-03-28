'use strict';

/**
 * @ngdoc function
 * @name angularTestApp.controller:PeopleCtrl
 * @description
 * # PeopleCtrl
 * Controller of the angularTestApp
 */
angular.module('angularTestApp')
  .controller('PeopleCtrl', function ($scope, couchdb, $uibModal, session) {
    var $db = $scope.$db = couchdb;
    $scope.$on('authenticated', function(e,data) {
      console.log("posts authenticated event data:", data);
      $scope.authenticated=data;
    });
    $scope.update = function() {
      $db.view('scheduler', 'people', {}, function(data) {
        $scope.doc=data;
        console.log($scope.doc);
      });
    };
    $scope.update();

    $scope.edit = function(data) {
      console.log(data);
      $uibModal.open({
        templateUrl: 'edit.human.html',
        size: 'lg',
        controller: 'EditHumanCtrl',
        resolve: {
               data: function () {
                 return data;
               }
             }
      });
    }
  })
  .controller('EditHumanCtrl', function ($scope, couchdb, $uibModalInstance, data, $cookies) {
    var $db = $scope.$db = couchdb;

    $scope.form = [
      {
        "type": "help",
        "helpvalue": "<div class=\"alert alert-info\">Grid it up with bootstrap</div>"
      },
      {
        "type": "section",
        "htmlClass": "row",
        "items": [
          {
            "type": "section",
            "htmlClass": "col-xs-4",
            "items": [
              "firstname"
            ]
          },
          {
            "type": "section",
            "htmlClass": "col-xs-4",
            "items": [
              "fathername"
            ]
          },
          {
            "type": "section",
            "htmlClass": "col-xs-4",
            "items": [
              "lastname"
            ]
          }
        ]
      },
      {
        "type": "section",
        "htmlClass": "row",
        "items": [
          {
            "type": "section",
            "htmlClass": "col-xs-4",
            "items": [
              "appointment"
            ]
          },
          {
            "type": "section",
            "htmlClass": "col-xs-4",
            "items": [
              "since"
            ]
          },
          {
            "type": "section",
            "htmlClass": "col-xs-4",
            "items": [
              "edusince"
            ]
          }
        ]
      },
      {
        "type": "section",
        "htmlClass": "row",
        "items": [
          {
            "type": "section",
            "htmlClass": "col-xs-4",
            "items": [
              "education"
            ]
          },
          {
            "type": "section",
            "htmlClass": "col-xs-4",
            "items": [
              "up"
            ]
          },
          {
            "type": "section",
            "htmlClass": "col-xs-4",
            "items": [
              "degree"
            ]
          }
        ]
      },
      {
        "type": "section",
        "htmlClass": "row",
        "items": [
          {
            "type": "section",
            "htmlClass": "col-xs-6",
            "items": [
              "email"
            ]
          },
          {
            "type": "section",
            "htmlClass": "col-xs-6",
            "items": [
              "phone"
            ]
          }
        ]
      },
      {
        "type": "submit",
        "style": "btn-info",
        "title": "OK"
      }
    ];
    $scope.schema = {
      "type": "object",
      "title": "Comment",
      "properties": {
        "firstname": {
          "title": "Имя",
          "type": "string"
        },
        "lastname": {
          "title": "Фамилия",
          "type": "string"
        },
        "fathername": {
          "title": "Отчество",
          "type": "string"
        },
        "education": {
          "title": "Образование",
          "type": "string"
        },
        "up": {
          "title": "Повышение квалификации",
          "type": "string"
        },
        "category": {
          "title": "Категория",
          "type": "string"
        },
        "appointment": {
          "title": "Должность",
          "type": "string"
        },
        "since": {
          "title": "Общий стаж",
          "type": "string"
        },
        "edusince": {
          "title": "Педагогический стаж", "type": "string"
        },
        "degree": {
          "title": "Ученая степень",
          "type": "string"
        },
        "day": {
          "title": "День приема",
          "type": "string"
        },
        "time": {
          "title": "Время приема",
          "type": "string"
        },
        "order": {
          "title": "Очередность",
          "type": "string"
        },
        "phone": {
          "title": "Телефон",
          "type": "string"
        },
        "email": {
          "title": "Email",
          "type": "string",
          "pattern": "^\\S+@\\S+$",
        },
        "comment": {
          "title": "Коментарии",
          "type": "string",
          "maxLength": 20,
          "validationMessage": "Don't be greedy!"
        }
      },
      "required": [
        "firstname",
        "lastname",
        "fathername",
        "appointment",
        "since",
        ""

      ]
    }
    $scope._save = function() {
      console.log($scope.model);
      $db.doc.post($scope.model, function(data) {
        console.log(data);
      });
    };
    $scope.model=data;
    console.log(data);
  })
