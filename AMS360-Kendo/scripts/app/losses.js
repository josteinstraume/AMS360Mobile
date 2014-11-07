define(["kendo", "app/account", "app/data", "app/utils"], function (kendo, account, data, utils) {
    var viewModel = kendo.observable({
                                         selectedRoom: "",
                                         PopulateLosses: new kendo.data.DataSource({}),
                                         navGainsLosses: function() {
                                             kendo.mobile.application.replace("#GainsAndLossesView");
                                         },
                                         showLoss: function(e) {
                                             if (e == null) {
                                                 return;
                                             }
                                                 
                                             utils.selectedBarcode = e.data.AssetBarCode;
                                             utils.navigate("#SingleLossView");
                                         },
                                       
                                         GetPopulateLosses: function() {
                                             var URL = utils.ServiceURL + "/Losses/" + utils.room + "/" + utils.project;
                                             $.ajax({
                                                        url: URL,
                                                        dataType: 'json',
                                                        type: "GET",
                                                        beforeSend: function (xhr) {
                                                            utils.showLoading();
                                                            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(account.userName + ":" + account.password));  
                                                            xhr.setRequestHeader('X-Auth-Token', account.database); 
                                                        },
                                                        complete: function (xhr) {
                                                            utils.hideLoading(); 
                                                        },
                                                        error: function (xhr, ajaxOptions, thrownError) {
                                                            if (xhr.status == "403" || xhr.status == "401") {
                                                                navigator.notification.alert("You are not authorised to perform this action", null, "Not Authorised");
                                                            } else if (xhr.status == "0" && ajaxOptions == "") {
                                                                navigator.notification.alert("Could not connect to the network. Consider working offline.", null, "No Connection");
                                                            } else {
                                                                navigator.notification.alert("Failed to retrieve Losses", null, "Losses");
                                                            }
                                                        },
                                                        success: function (model) {
                                                            try {
                                                                debugger;
                                                                var result = model.GetLossesResult;
                                                                for (var i = 0; i < result.length; i++) {
                                                                    result[i].URL = utils.ImageURL + "/GetThumbImageLoss/1/" + result[i].AssetBarCode + "/" + utils.project + "/" + account.database; 
                                                                }
                                                                var parseResult = JSON.parse(JSON.stringify(result));
                                                               
                                                                viewModel.set("PopulateLosses", new kendo.data.DataSource({
                                                                                                                              data:parseResult,
                                                                                                                              group: { field: "AssetTypeDescription" }
                                                                                                                          }));
                                                            } catch (e) {
                                                                navigator.notification.alert("An error occurred: " + e.error, null, "Error");
                                                            }
                                                        }
                                                    });
                                         }
                                        
   
                                     });
   
    return {
        init: function (initEvt) {
            // ... init event code ...
        },
 
        beforeShow: function (beforeShowEvt) {
            viewModel.set("selectedRoom", utils.room);
            viewModel.GetPopulateLosses();
        },
 
        show: function (showEvt) {
        },
        viewModel: viewModel
        
    }
});