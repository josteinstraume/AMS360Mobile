require.config({
    paths: {
        jQuery: "../kendo/js/jquery.min",
        kendo: "../kendo/js/kendo.mobile.min"
        
    },
    shim: {
        jQuery: {
            exports: "jQuery"
        },
        kendo: {
            deps: ["jQuery"],
            exports: "kendo"
        }
       
        
    }
});

// Expose the app module to the global scope so Kendo can access it.
var app;
 
require(["app/app"], function (application) {
    app = application;
    app.init();
});