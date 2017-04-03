"use strict";function transponse(a){return a.map(function(b,c){return a.map(function(a){return a[c]})})}var db_name="gbook",$app=angular.module("angularTestApp",["ngAnimate","ngResource","ngRoute","flow","ngSanitize","SimpleCouch","ui.bootstrap","thatisuday.ng-image-gallery","schemaForm","schemaForm-tinymce","schemaForm-file-upload","pascalprecht.translate","ngSchemaFormFile","ngHandsontable"]).config(["$routeProvider","$httpProvider","couchConfigProvider","ngImageGalleryOptsProvider",function(a,b,c,d){a.when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl",controllerAs:"about"}).when("/people",{templateUrl:"views/people.html",controller:"PeopleCtrl",controllerAs:"people"}).when("/posts",{templateUrl:"views/posts.html",controller:"PostsCtrl",controllerAs:"posts"}).when("/links",{templateUrl:"views/links.html",controller:"LinksCtrl",controllerAs:"links"}).when("/scheduler/:day?",{templateUrl:"views/scheduler.html",controller:"SchedulerCtrl",controllerAs:"scheduler"}).otherwise({redirectTo:"/posts"}),"localhost"===location.hostname?c.setServer("/db"):c.setServer("https://couch.2d-it.ru"),c.setDB("cm-spb"),b.defaults.withCredentials=!0}]),db_name="gbook";angular.module("angularTestApp").controller("MainCtrl",["$scope","$filter","couchdb","$uibModal","$rootScope",function(a,b,c,d,e){var f=a.$db=c;a.session=function(){f.user.session(function(b){console.log("session",b),a.isAuthenticated()})},a.isAuthenticated=function(){f.user.isAuthenticated(function(b){console.log("isAuthenticated",b),a.$emit("authenticated",b),a.$broadcast("authenticated",b),a.authenticated=b})},a.session(),a.logout=function(){f.user.logout(function(b){console.log("logout:",b),a.isAuthenticated()})},a.loginModal=function(){console.log(f.user.get()),d.open({templateUrl:"login.html",size:"sm",controller:"LoginCtrl"}).closed.then(function(){a.isAuthenticated()})},a.registerModal=function(){d.open({templateUrl:"register.html",size:"sm",controller:"RegisterCtrl"})},a.submitLogin=function(){f.user.login(a.username,a.password,function(b){f.user.isAuthenticated(function(b){console.log("isAuthenticated",b),a.authenticated=b})})}}]).controller("LoginCtrl",["$scope","couchdb","$uibModalInstance","$rootScope",function(a,b,c,d){var e=a.$db=b;a.submitLogin=function(){e.user.login(a.username,a.password,function(a){e.user.isAuthenticated(function(a){console.log("isAuthenticated",a),d.$broadcast("authenticated",a)})}),c.close()},a.close=function(){c.dismiss("cancel")}}]).controller("RegisterCtrl",["$scope","couchdb","$uibModalInstance",function(a,b,c){var d=a.$db=b;a.submitRegistration=function(){d.user.create(a.username,a.password,function(b){console.log(b),d.user.login(a.username,a.password,function(a){d.user.isAuthenticated(function(a){console.log("isAuthenticated",a)})}),c.close()})},a.close=function(){c.dismiss("cancel")}}]);var db_name="gbook";angular.module("angularTestApp").controller("SchedulerCtrl",["$scope","couchdb","$routeParams","$location","hotRegisterer","$rootScope",function(a,b,c,d,e,f){var g=a.$db=b;e.getInstance("my-handsontable");if(a.$on("authenticated",function(b,c){console.log("sheduler authenticated event data:",c),a.authenticated=c}),f._doc={grid:{data:{},columns:{}},cellStyle:new Array(10)},a.validRenderer=function(a,b,c,d,e,g,h){return Handsontable.renderers.TextRenderer.apply(this,arguments),f._doc.cellStyle[c]&&null!==f._doc.cellStyle[c]&&"undefined"!=typeof f._doc.cellStyle[c][d]&&(b.style.backgroundColor="#eee",$(b).addClass("edited")),b},a.dates=[],a.location=function(b){d.path("/scheduler/"+b),a.$apply},a.settings={contextMenu:!0,rowHeights:50,stretchH:"all",colWidths:30,rowHeaders:!0,colHeaders:!0,mergeCells:!0,onAfterInit:function(){},onAfterChange:function(a,b){a&&"schedule"==f._doc.type?(console.log("onAfterChange:",f._doc),f._doc.cellStyle||(f._doc.cellStyle=new Array(10)),f._doc.cellStyle[a[0][0]]||(f._doc.cellStyle[a[0][0]]={}),f._doc.cellStyle[a[0][0]][a[0][1]]="grey",g.doc.put(f._doc,function(a){console.log("put:",a),f._doc._rev=a.rev})):a&&"template"==f._doc.type&&g.doc.put(f._doc,function(a){console.log("put:",a),f._doc._rev=a.rev})},contextMenuCopyPaste:{swfPath:"bower_components/zeroclipboard/dist/ZeroClipboard.swf"}},void 0===c.day){var h=Date.today().add(1).days();(h.is().sunday()||h.is().saturday())&&(h=Date.today().next().monday()),a._day=moment(h).unix().toString(),d.path("/scheduler/"+a._day)}else console.log(c),a._day=c.day;moment.locale("en"),a._day_literal=moment.unix(a._day).format("dddd").toLowerCase(),g.doc.get(a._day,function(a){f._doc=a,console.log(a),"template"==a.type&&(a.cellStyle=new Array(10))}).error(function(){g.doc.get(a._day_literal,function(b){moment.locale("ru"),b.date=moment.unix(a._day).format("dddd DD MMMM YYYY"),b._id=a._day,b.type="schedule",b._rev=void 0,b.author=g.user.get().name,b.cellStyle=new Array(10),console.log(b),g.doc.put(b,function(b){console.log("new created:",b),g.doc.get(a._day,function(a){f._doc=a,console.log(a)})})})}),g.view("scheduler","schedules",{},function(b){a.dates=b.map(function(a){return a.id})})}]),angular.module("angularTestApp").filter("trust",["$sce",function(a){return function(b){return a.trustAsHtml(b)}}]),angular.module("angularTestApp").directive("editableTable",function(){return{link:function(a,b,c){b.editableTableWidget(),b.on("change",function(){this.addClass("edited"),console.log(this)}),b.on("change",function(c){a.change(b.html())})}}}),angular.module("angularTestApp").directive("pickmeup",function(){return{link:function(a,b,c,d){new Array;a.$watch(a.dates,function(){b.pickmeup({flat:!0,trigger_event:"click",class_name:"",change:function(b){console.log(b),a.location(moment(b,"DD-MM-YYYY").unix().toString()),a.$apply()},render:function(b){return $.inArray(moment(b).unix().toString(),a.dates)>1?(console.log("highlight"),{class_name:"highlight"}):void 0},locale:{days:["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Субота","Воскресенье"],daysShort:["Вс","Пн","Вт","Ср","Чт","Пт","Сб","Вс"],daysMin:["Вс","Пн","Вт","Ср","Чт","Пт","Сб","Вс"],months:["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],monthsShort:["Янв","Фев","Март","Апр","Май","Июнь","Июль","Авг","Сент","Окт","Ноя","Дек"]}})})}}}),angular.module("angularTestApp").directive("ngThumb",["$window",function(a){var b={support:!(!a.FileReader||!a.CanvasRenderingContext2D),isFile:function(b){return angular.isObject(b)&&b instanceof a.File},isImage:function(a){var b="|"+a.type.slice(a.type.lastIndexOf("/")+1)+"|";return-1!=="|jpg|png|jpeg|bmp|gif|".indexOf(b)}};return{restrict:"A",template:"<canvas/>",link:function(a,c,d){function e(a){var b=new Image;b.onload=f,b.src=a.target.result}function f(){var a=g.width||this.width/this.height*g.height,b=g.height||this.height/this.width*g.width;h.attr({width:a,height:b}),h[0].getContext("2d").drawImage(this,0,0,a,b)}if(b.support){var g=a.$eval(d.ngThumb);if(b.isFile(g.file)&&b.isImage(g.file)){var h=c.find("canvas"),i=new FileReader;i.onload=e,i.readAsDataURL(g.file)}}}}}]),angular.module("angularTestApp").controller("PostsCtrl",["$scope","couchdb","$uibModal",function(a,b,c){var d=a.$db=b;a.$on("authenticated",function(b,c){console.log("posts authenticated event data:",c),a.authenticated=c}),a.update_posts=function(){a.$db.view("scheduler","posts",{},function(b){a.posts=b})},a.update_posts(),a.edit=function(b){c.open({templateUrl:"edit.post.html",size:"lg",controller:"EditCtrl",resolve:{data:function(){return b}}}).closed.then(function(){a.update_posts()})},a["delete"]=function(a){console.log("deleting: ",a),d.doc.get(a,function(a){console.log(a),d.doc["delete"](a,function(a){console.log("deleted: ",a)})})}}]).controller("EditCtrl",["$scope","couchdb","$uibModalInstance","data",function(a,b,c,d){var e=a.$db=b;a.docUrl=e.config.getServer()+"/"+e.db.getName()+"/"+d._id,a.sf={form:["name","date",{key:"text",tinymceOptions:{toolbar:["undo redo| styleselect | bold italic | link image","alignleft aligncenter alignright"]}},{type:"submit",style:"btn-info",title:"OK"}],schema:{type:"object",title:"Comment",properties:{name:{title:"Name",type:"string"},date:{title:"Дата",type:"string",format:"date"},text:{title:"Текст",type:"string",format:"html"},image:{title:"Image",type:"array",format:"singlefile","x-schema-form":{type:"array"},pattern:{mimeType:"image/*",validationMessage:"Falscher Dateityp: "},maxSize:{maximum:"2MB",validationMessage:"Erlaubte Dateigröße überschritten: ",validationMessage2:"Aktuelle Dateigröße: "},maxItems:{validationMessage:"Es wurden mehr Dateien hochgeladen als erlaubt."},minItems:{validationMessage:"Sie müssen mindestens eine Datei hochladen"}},images:{title:"Images",type:"array",format:"multifile","x-schema-form":{type:"array"},pattern:{mimeType:"image/*,!.gif",validationMessage:"Falscher Dateityp: "},maxSize:{maximum:"2MB",validationMessage:"Erlaubte Dateigröße überschritten: ",validationMessage2:"Aktuelle Dateigröße: "},maxItems:{validationMessage:"Es wurden mehr Dateien hochgeladen als erlaubt."},minItems:{validationMessage:"Sie müssen mindestens eine Datei hochladen"}}},required:["name","email","comment"]}},a.model=d,a._save=function(){console.log(a.model),e.doc.post(a.model,function(b){console.log(b),a.model._rev=b.rev,c.close(a.model)})},a.cancel=function(){c.dismiss("cancel")},console.log(d)}]),angular.module("angularTestApp").controller("PeopleCtrl",["$scope","couchdb","$uibModal",function(a,b,c){function d(a){return new Promise(function(b,c){var d=a;console.log(d),f.doc.get(d,function(d){console.log(d),a._rev=d.rev,f.doc.post(a._id,function(a){console.log("success: ",a),b(a)}).error(function(a){console.error(a),c(a)})})})}var e={_id:"vk909",_rev:"1-ce7b4c8d1ca341e47ad3f10d6c32e35d",id:909,from_id:-21159786,to_id:-21159786};d(e).then(function(a){console.log(a)});var f=a.$db=b;a.$on("authenticated",function(b,c){console.log("posts authenticated event data:",c),a.authenticated=c}),a.update=function(){f.view("scheduler","people",{},function(b){a.doc=b,console.log(a.doc)})},a.update(),a.edit=function(a){console.log(a),"string"==typeof a.education&&(a.education=[a.education]),"string"==typeof a.up&&(a.up=[a.up]),"string"==typeof a.professional&&(a.professional=[a.professional]),c.open({templateUrl:"edit.human.html",size:"lg",controller:"EditHumanCtrl",resolve:{data:function(){return a}}})}}]).controller("EditHumanCtrl",["$scope","couchdb","$uibModalInstance","data",function(a,b,c,d){var e=a.$db=b;a.docUrl=e.config.getServer()+"/"+e.db.getName()+"/"+d._id,console.log(a.docUrl),a.form=[{type:"section",htmlClass:"row",items:[{type:"section",htmlClass:"col-xs-4",items:["firstname","fathername","lastname","category",{key:"up",add:" ",style:{add:"btn-info"},items:["up[]"]}]},{type:"section",htmlClass:"col-xs-4",items:["appointment",{key:"education",add:" ",style:{add:"btn-info"},items:["education[]"]},{key:"since",format:"dd/mm/yyyy"},{key:"edusince",format:"dd/mm/yyyy"}]},{type:"section",htmlClass:"col-xs-4",items:[{key:"professional",tinymceOptions:{menubar:!1,statusbar:!1,toolbar:["bold italic | link image"]}},{key:"degree",type:"textarea"}]}]},{type:"section",htmlClass:"row",items:[{type:"section",htmlClass:"col-xs-6",items:["email"]},{type:"section",htmlClass:"col-xs-6",items:["phone"]}]}],a.schema={type:"object",title:"human",properties:{firstname:{title:"Имя",type:"string"},lastname:{title:"Фамилия",type:"string"},fathername:{title:"Отчество",type:"string"},education:{title:"Образование",type:"array",maxItems:5,items:{type:"string"}},up:{title:"Повышение квалификации",type:"array",maxItems:5,items:{type:"string"}},professional:{title:"Профессиональная подготовка",type:"string",format:"html"},category:{title:"Категория",type:"string"},appointment:{title:"Должность",type:"string"},since:{title:"Общий стаж",type:"string",format:"date"},edusince:{title:"Педагогический стаж",type:"string",format:"date"},degree:{title:"Ученая степень",type:"string"},day:{title:"День приема",type:"string"},time:{title:"Время приема",type:"string"},order:{title:"Очередность",type:"string"},phone:{title:"Телефон",type:"string"},email:{title:"Email",type:"string",pattern:"^\\S+@\\S+$"},comment:{title:"Коментарии",type:"string",maxLength:20,validationMessage:"Don't be greedy!"},links:{title:"Ссылки",type:"array",maxItems:20,items:{type:"string"}}},required:["firstname","lastname","fathername","appointment","since"]},a.model=d,a._save=function(){console.log(a.model),e.doc.post(a.model,function(b){console.log(b),a.model._rev=b.rev,c.close(a.model)})},a.cancel=function(){c.dismiss("cancel")},a.$watch("files",function(){a.db_attach(a.files,0)}),a.db_attach=function(b,c){a.$db.attach.put(a.model,b[c],{},function(b){console.log(b),a.model._rev=b.rev,a.updateAttachments()})},a.updateAttachments=function(){e.doc.get(a.model._id,function(b){a.model._attachments=b._attachments,console.log(b._attachments)})},console.log(d)}]),angular.module("angularTestApp").directive("attachments",function(){return{templateUrl:"/scripts/directives/attachments.html"}}),angular.module("angularTestApp").run(["$templateCache",function(a){a.put("views/people.html",'<script type="text/ng-template" id="edit.human.html"><div class="modal-header">\n     <button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="cancel()">x</button>\n     <h4>Редактирование</h4>\n  </div>\n  <div class="modal-body">\n    <form>\n      <div sf-schema="schema" sf-form="form" sf-model="model">\n      </div>\n      <attachments ng-model="model._attachments"></attachments>\n      <button type="button" class="btn btn-success" ng-click="_save()">Сохранить</button>\n    </form>\n  </div></script> <div class="page-header"> <h1>Коллектив <small></small></h1> </div> <ul class="list-group"> <li ng-repeat="human in doc" ng-click="edit(human.value)" class="list-group-item"> {{human.value.lastname}} {{human.value.firstname}} <span class="badge">{{human.value.appointment}}</span> </li> </ul>'),a.put("views/posts.html",'<script type="text/ng-template" id="edit.post.html"><div class="modal-header">\n     <button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="cancel()">x</button>\n     <h4>Редактирование</h4>\n  </div>\n  <div class="modal-body">\n    <form>\n      <div sf-schema="sf.schema" sf-form="sf.form" sf-model="model">\n      </div>\n      <attachments ng-model="model._attachments"></attachments>\n\n      <button type="button" class="btn btn-success" ng-click="_save()">Сохранить</button>\n    </form>\n  </div></script> <a ng-click="edit(uuid)" ng-show="authenticated" role="button" class="btn btn-success">Новый пост</a> <div class="list-group"> <a class="list-group-item" ng-click="edit(post.value)" ng-repeat="post in posts"> <h4 class="list-group-item-heading">{{post.value.date}} <button class="btn btn-danger pull-right" ng-show="authenticated" ng-click="delete(post.id)"><i class="fa fa-trash-o"></i></button> </h4> <p class="list-group-item-text" ng-bind-html="post.value.text|trust"></p> </a> </div>'),a.put("views/scheduler.html",'<div class="container"> <h2>Расписание <span class="pull-right">{{_doc.date}}</span><h2> <a href="javascript:window.print()" role="button" class="btn btn-primary active print-hidden pull-right"> <i class="fa fa-3x fa-print" aria-hidden="true"></i> Печать </a> </h2></h2></div> <div class="container-fluid" ng-controller="SchedulerCtrl"> <div class="row"> <div class="col-md-2"> <div pickmeup></div> </div> <div class="col-md-10"> <hot-table hot-id="my-handsontable" datarows="_doc.grid.data" settings="settings" col-headers="_doc.grid.columns" row-headers="true" mergecells="_doc.grid.mergeCells"> <hot-column ng-repeat="column in _doc.grid.columns" title="column" renderer="validRenderer"></hot-column> </hot-table> </div> </div> </div> <div class="container footer"> <a role="button" ng-href="#/scheduler/monday" class="btn btn-default">Понедельник <a role="button" ng-href="#/scheduler/tuesday" class="btn btn-default">Вторник <a role="button" ng-href="#/scheduler/wednesday" class="btn btn-default">Среда <a role="button" ng-href="#/scheduler/thursday" class="btn btn-default">Четверг <a role="button" ng-href="#/scheduler/friday" class="btn btn-default">Пятница </a></a></a></a></a></div>')}]);