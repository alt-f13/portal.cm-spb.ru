


var tomorrow=Date.today().add(1).days();
if(tomorrow.is().sunday()||tomorrow.is().saturday()) {
  tomorrow=Date.today().next().monday();
}
//console.log();
var timestamp=moment(tomorrow).unix();
console.log(timestamp)
var _day=moment(tomorrow).unix().toString();
var _rev;
var _documents=new Array();
$db.allDocs({
     success: function (data) {
       console.log(data);
       //$("#documents").tmpl(data.rows).appendTo('#list');
       $.each(data.rows, function(index, row) {
         _documents.push(row.id);
       });
       //console.log(_documents);
     }
});
$('#pickmeup').pickmeup({
   flat	: true,
   format  : 'd-m-Y',
   trigger_event: 'click', // Event to trigger the date picker
   class_name: '', // Class to be added to root datepicker element
   change: function(formated){
       //load_timetable();
       _day=moment(Date.parse(formated)).unix().toString();
       loadDoc();
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

function loadDoc() {
  $db.openDoc(_day, {
    // If found, then set the revision in the form and save
    success: function(data) {
      console.log(data);
      _rev=data._rev;
      $("#dataTable").html("");
      $("#dataTable").append(data.data).editableTableWidget();

      $("#dataTable td").on("change", function(e) {
        var doc = {
          "_id":_day,
          "_rev": data._rev,
          "data": $("#dataTable").html()
        };
        $db.saveDoc(doc, {
          success: function(data) {
            console.log(data);
          }
        });
      })

    }, // End success, we have a Doc
    // If there is no CouchDB document with that ID then we'll need to create it before we can attach a file to it.
    error: function(status) {
      $db.copyDoc(moment.unix(_day).format("dddd").toLowerCase(), {
        success: function(data) {
          console.log(data);
          loadDoc();
        }
      }, {
          beforeSend: function(xhr) {
              xhr.setRequestHeader("Destination", _day);
          }
      })
    } // End error, no Doc
  }) // End openDoc()
}

loadDoc();
