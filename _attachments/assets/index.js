
var $db = $.couch.db("tpl");


var tomorrow=Date.today().add(1).days();
if(tomorrow.is().sunday()||tomorrow.is().saturday()) {
  tomorrow=Date.today().next().monday();
}
//console.log();
var timestamp=moment(tomorrow).unix();
console.log(timestamp)
var _day;
function load_timetable(_day) {
  $("#mainTable").load("/out/"+_day.toString('dd-MM-yyyy')+".html", function( response, status, xhr,loaded ) {

    if ( status == "success" ) {
      console.log(status)
      $('table td').on('change', function(e) {
        console.log('change');
        $(this).attr('class', 'new');
        $.put("out/"+$("#datepicker").html()+".html", $("#mainTable").html());
      });
    }else{
      load('/tpl/'+_day.getDay()+_day.toString('dddd')+'.html');
    };
    console.log(_day.getDay()+_day.toString('dddd'))

  });
}
load_timetable(tomorrow);
$("#mainTable").editableTableWidget();


var datesFromDatabase = new Array();
function fixedEncodeURIComponent (str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}

function update_out() {
  $('#out').html("");
  $.ajax({
    url: "/out",
    success: function(data){
       $(data).find("a:contains(.html)").each(function(){
          // will loop through
          var images = $(this).attr("href");
          if (Date.today().toString("yyyyMMdd") < Date.parse(images.slice(5, -5)).toString("yyyyMMdd")) {
            datesFromDatabase.push(Date.parse(images.slice(5, -5)).getTime());
            //console.log(datesFromDatabase);
          }
          //console.log($(this));

       });
       console.log(datesFromDatabase);
       $('.single').pickmeup({
         flat	: true,
         format  : 'd-m-Y',
         trigger_event: 'click', // Event to trigger the date picker
         class_name: '', // Class to be added to root datepicker element
         change: function(formated){
             load_timetable(Date.parse(formated));
             update_out();
         },
         render: function(date) {

                 if ($.inArray(date.getTime(), datesFromDatabase) > -1){
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

  });

}
//update_out();
var _rev;
$db.openDoc(timestamp.toString(), {
  // If found, then set the revision in the form and save
  success: function(data) {
    console.log(data);
    $("#dataTable").append(data.data).editableTableWidget();

    $("#dataTable td").on("change", function(e) {
      var doc = {
        "_id":timestamp.toString(),
        "_rev": data._rev,
        "data": $("#dataTable").html()
      };
      $db.saveDoc(doc, {
        success: function(data) {
          console.log(data);
        }
      });



    })
    // Submit the form with the attachment
    // $('form.documentForm').ajaxSubmit({
    //   url: "/"+ input_db +"/"+ input_id,
    //   success: function(response) {
    //     alert("Your attachment was submitted.")
    //   }
    // })
  }, // End success, we have a Doc

  // If there is no CouchDB document with that ID then we'll need to create it before we can attach a file to it.
  error: function(status) {
    // $db.openDoc(moment(tomorrow).format("dddd").toLowerCase(), {
    //   success: function(data) {
    //     console.log(data);
    //   }
    // })
    $db.copyDoc(moment(tomorrow).format("dddd").toLowerCase(), {
      success: function(data) {
        console.log(data);
        // Now that the Couch Doc exists, we can submit the attachment,
        // but before submitting we have to define the revision of the Couch
        // Doc so that it gets passed along in the form submit.
        // $('form.documentForm').ajaxSubmit({
        //   // Submit the form with the attachment
        //   url: "/"+ input_db +"/"+ input_id,
        //   success: function(response) {
        //     alert("Your attachment was submitted.")
        //   }
        // })
      }
    }, {
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Destination", timestamp.toString());
        }
    })
  } // End error, no Doc
}) // End openDoc()

    //
    //
    // var pdf = new jsPDF('p', 'pt', 'letter');
    // var canvas = pdf.canvas;
    // canvas.height = 72 * 11;
    // canvas.width=72 * 8.5;;
    // // var width = 400;
    // html2pdf($('#mainTable'), pdf, function(pdf) {
    //         var iframe = document.createElement('iframe');
    //         iframe.setAttribute('style','position:absolute;right:0; top:0; bottom:0; height:100%; width:500px');
    //         document.body.appendChild(iframe);
    //         iframe.src = pdf.output('datauristring');
    //
    //        //var div = document.createElement('pre');
    //        //div.innerText=pdf.output();
    //        //document.body.appendChild(div);
    //     }
    // );
