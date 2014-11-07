define(["kendo", "app/account","app/data", "app/utils"], function (kendo, account, data, utils) {
    var viewModel = kendo.observable({
                                         selectedSite: "",
                                         siteList: [],
                                         selectedBuilding: "",
                                         buildingList: [],
                                         selectedRoom: "",
                                         roomList: [],
                                         GetSites: function () {
                                             var callback = function(tx, result) {
                                                 if (result != null && result.rows != null) {
                                                     viewModel.siteList.push({
                                                                                 SiteID: '', 
                                                                                 SiteDescription: ''
                                                                             });
                                                     for (var i = 0; i < result.rows.length; i++) {
                                                         var row = result.rows.item(i);
                                                       
                                                         viewModel.siteList.push({
                                                                                     SiteID: row.SiteID, 
                                                                                     SiteDescription: row.SiteDescription
                                                                                 });
                                                         kendo.bind($("#LocationView"), viewModel);  
                                                     }
                                                 }
                                             }
                                             data.GetSitesData(callback);
                                         },
                                         GetBuildings: function () {
                                             while (viewModel.buildingList.length > 0) {
                                                 viewModel.buildingList.pop();
                                             }
                                             var callback = function(tx, result) {
                                                 if (result != null && result.rows != null) {
                                                     viewModel.buildingList.push({
                                                                                     BuildingCode: '', 
                                                                                     BuildingDescription: ''
                                                                                 });
                                                     for (var i = 0; i < result.rows.length; i++) {
                                                         var row = result.rows.item(i);
                                                       
                                                         viewModel.buildingList.push({
                                                                                         BuildingCode: row.BuildingCode, 
                                                                                         BuildingDescription: row.BuildingDescription
                                                                                     });
                                                         kendo.bind($("#BuildingSelect"), viewModel);  
                                                     }
                                                 }
                                             }
                                          
                                             data.GetBuildings(callback, $("#SiteSelect").val());
                                         },
                                         GetRooms: function () {
                                             while (viewModel.roomList.length > 0) {
                                                 viewModel.roomList.pop();
                                             }
                                             var callback = function(tx, result) {
                                                 if (result != null && result.rows != null) {
                                                     viewModel.roomList.push({
                                                                                 RoomCode: ''
                                                                             });
                                                     for (var i = 0; i < result.rows.length; i++) {
                                                         var row = result.rows.item(i);
                                                       
                                                         viewModel.roomList.push({
                                                                                     RoomCode: row.RoomCode
                                                                                 });
                                                         kendo.bind($("#RoomSelect"), viewModel);  
                                                     }
                                                 }
                                             }
                                          
                                             data.GetRooms(callback, $("#BuildingSelect").val());
                                         },
                                         DoCapture: function() {
                                           
                                             if ($("#RoomSelect").val() == "" || $("#RoomSelect").val() == null) {
                                                 navigator.notification.alert("Please select a Room", null, "Room Required")
                                             }
                                             else
                                             {
                                                 viewModel.selectedRoom = $("#RoomSelect").val();
                                                 utils.navigate("#GeneralView");
                                                 
                                             }
                                         }
                                     
                                     });
    return {
        init: function (initEvt) {
            // ... init event code ...
              while (viewModel.siteList.length > 0) {
                viewModel.siteList.pop();
            }
            viewModel.GetSites();
        },
 
        beforeShow: function (beforeShowEvt) {
            // ... before show event code ...
        },
 
        show: function (showEvt) {
            // ... show event code ...
          
        },
        viewModel: viewModel
        
      
    }
});