define(["jQuery", "kendo", "app/login", "app/data", "app/utils", "app/Sync", "app/main", "app/grouping", "app/area", "app/captureinfra", "app/location", "app/captureGeneral", "app/Upload"], 
       function ($, kendo, loginView, data, utils, syncView, mainView, groupingView, areaView, captureInfraView, locationView, generalView, upload) {
           var _kendoApplication;
           var closeApp = function() {
               navigator.app.exitApp();
           }
           return {
               isBusy: false,
               init: function () {
                   _kendoApplication = new kendo.mobile.Application(document.body, { transition: "slide", loading: "<h1 class='loading-message'>Loading...</h1>", initial: "LoginView" });
                   utils.init(_kendoApplication);
           
                   data.CreateDB();
           
                   data.CreateTables();
                 
            
                   //get url
                   
                   var xmlhttp = new XMLHttpRequest();

                   xmlhttp.open("GET", "config.xml", false);
                   xmlhttp.send();
                   xmlDoc = xmlhttp.responseXML;
                   
                    utils.ServiceURL = xmlDoc.getElementsByTagName("serviceURL")[0].childNodes[0].nodeValue;
                   utils.ImageURL = xmlDoc.getElementsByTagName("imageURL")[0].childNodes[0].nodeValue;
                  
               },
               views: {
                   login: loginView,
                   sync: syncView,
                   main: mainView,
                   grouping: groupingView,
                   area: areaView,
                   captureinfra: captureInfraView,
                   location: locationView,
                   general: generalView,
                   upload: upload
               },
               closeErrorModal: utils.closeError,
               closeSpecModal: utils.closeSpec,
               close: closeApp
      
     
           }
       });