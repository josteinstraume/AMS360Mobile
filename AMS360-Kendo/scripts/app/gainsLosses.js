define(["kendo", "app/account", "app/data", "app/utils"], function (kendo, account, data, utils) {
    var viewModel = kendo.observable({
                                         selectedRoom: "",
                                         navCapture: function() {
                                             kendo.mobile.application.replace("#GeneralView");
                                         },
                                         navgains: function() {
                                             utils.navigate("#GainsView");
                                         },
                                         navlosses: function() {
                                             utils.navigate("#LossesView");
                                         },
                                         navlist: function() {
                                             utils.navigate("#InventoryView");
                                         },
                                     });
   
    return {
        init: function (initEvt) {
            // ... init event code ...
        },
 
        beforeShow: function (beforeShowEvt) {
            viewModel.set("selectedRoom", utils.room);
        },
 
        show: function (showEvt) {
        },
        viewModel: viewModel
        
    }
});