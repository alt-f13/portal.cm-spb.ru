'use strict';

/**
 * @ngdoc directive
 * @name angularTestApp.directive:pickmeup
 * @description
 * # pickmeup
 */
angular.module('angularTestApp')
  .directive('pickmeup', function () {
    return {
      link: function postLink(scope, element, attrs, $location) {
        //element.text('this is the pickmeup directive');
        //element.pickmeup();
        var _documents=new Array();

        console.log(element);
        element.pickmeup({
           flat	: true,
           //format  : 'unix',
           trigger_event: 'click', // Event to trigger the date picker
           class_name: '', // Class to be added to root datepicker element
           change: function(formated){
               //load_timetable();
               console.log(formated);
               $location(moment(formated, "DD-MM-YYYY").unix().toString());
               //loadDoc();
               scope.$apply
           },
           render: function(date) {
             //console.log(moment(date).unix().toString());
             if ($.inArray(moment(date).unix().toString(), _documents) > -1){
                ///console.log("highlight");
                 return {
                     class_name : 'highlight'
                 }
             }
           },
           locale: { // Object, that contains localized days of week names and months
             days: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Субота", "Воскресенье"],
             daysShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
             daysMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
             months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
             monthsShort: ["Янв", "Фев", "Март", "Апр", "Май", "Июнь", "Июль", "Авг", "Сент", "Окт", "Ноя", "Дек"]
           }

        });

      }
    };
  });
