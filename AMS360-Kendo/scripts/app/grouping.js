define(["kendo", "app/account", "app/utils"], function (kendo, account, utils) {
    
    return {
        init: function (initEvt) {
            // ... init event code ...
        },
 
        beforeShow: function (beforeShowEvt) {
            // ... before show event code ...
        },
 
        show: function (showEvt) {
            // ... show event code ...
        },
         navgeneral: function(){
             debugger;
            utils.grouping = "General";
            utils.navigate("#LocationView");
        },
        navvehicle: function(){
            utils.grouping = "Vehicle";
            utils.navigate("#LocationView");
        },
        navroad: function(){
            utils.grouping = "Roads";
            utils.navigate("#AreaView");
        },
        navrailway: function(){
            utils.grouping = "Railway";
            utils.navigate("#AreaView");
        },
        navsanitation: function(){
            utils.grouping = "Sanitation";
            utils.navigate("#AreaView");
        },
         navelectricity: function(){
            utils.grouping = "Electricity";
            utils.navigate("#AreaView");
        },
         navbuilding: function(){
            utils.grouping = "Building";
            utils.navigate("#AreaView");
        },
        navland: function(){
            utils.grouping = "Land";
            utils.navigate("#AreaView");
        }
       
    }
});