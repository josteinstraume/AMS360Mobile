define(["kendo", "app/account", "app/data", "app/utils"], function (kendo, account, data, utils) {
    var viewModel = kendo.observable({
                                         selectedRoom: "",
                                         barcode: "",
                                         parentBarcode: "",
                                         oldBarcode: "",
                                         classification: "",
                                         assetType: "",
                                         description: "",
                                         make: "",
                                         model: "",
                                         serialNumber: "",
                                         custodian: "",
                                         condition: "",
                                         qty: "",
                                         reasonList: [],
                                         selectedReason:"", 
                                         comment:"", 
                                         getReasonList: function() {
                                             while (viewModel.reasonList.length > 0) {
                                                 viewModel.reasonList.pop();
                                             }
                                             viewModel.reasonList.push({Name: 'Barcode Replaced'});
                                             viewModel.reasonList.push({Name: 'Current Year Addition'});
                                             viewModel.reasonList.push({Name: 'Current Year Donation'});
                                             viewModel.reasonList.push({Name: 'Old Asset Not Previously Verified'});
                                             viewModel.reasonList.push({Name: 'Private Asset Must Be Removed'});
                                             viewModel.reasonList.push({Name: 'Other'});
                                         },
                                         FoundIt: function() {
                                             utils.navigate("#GeneralView");
                                         },
                                         SubmitGain: function() {
                                             var Gain = {
                                                 AssetBarCode: viewModel.barcode, 
                                                 RoomCode: utils.room,
                                                 ProjectID: utils.project,
                                                 Reason: viewModel.selectedReason,
                                                 Comment: viewModel.comment,
                                                 DoneBy: "HANNES"
                                             }
                                             $.ajax({
                                                        url: utils.ServiceURL + '/PostGain',
                                                        type: 'POST',
                                                        data: JSON.stringify(Gain),
                                                        dataType: 'json',
                                                        contentType: "application/json; charset=utf-8",
                                                        beforeSend: function (xhr) {
                                                            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(account.userName + ":" + account.password));  
                                                            xhr.setRequestHeader('X-Auth-Token', account.database); 
                                                            utils.showLoading();
                                                        },
                                                        complete: function (xhr) {
                                                            utils.hideLoading(); 
                                                        },
                                                        success: function (res) {
                                                            if (res == "Success") {
                                                                if (viewModel.selectedReason === "Barcode Replaced") {
                                                                    $("#OldBarcodeTextBox").val(viewModel.barcode);
                                                                    utils.navigate("#GeneralView");
                                                                } else {
                                                                    utils.navigate("#GainsView");
                                                                }
                                                            } else {
                                                                navigator.notification.alert("The Gain could not be sent. Message from server: " + res, null, "Could not sent gain")
                                                                utils.navigate("#GainsView");
                                                            }
                                                        },
                                                        error: function (xhr, ajaxOptions, error) {
                                                            if (xhr.status == "403" || xhr.status == "401") {
                                                                navigator.notification.alert("You are not authorised to fetch assets", null, "Not Authorised")
                                                            } else if (xhr.status == "0" && ajaxOptions == "") {
                                                                navigator.notification.alert("Could not connect to the network. Consider working offline.", null, "No Connection")
                                                            } else {
                                                                navigator.notification.alert("Gain could not be sent", null, "Loss")
                                                            }
                                                        }
                                                    });
                                         },
                                       
                                         getGainInfo: function(AssetBarcode) {
                                             debugger;
                                             var URL = utils.ServiceURL + "/OldCapture/" + AssetBarcode + "/" + utils.project;
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
                                                            debugger;
                                                            if (xhr.status == "403" || xhr.status == "401") {
                                                                navigator.notification.alert("You are not authorised to perform this action", null, "Not Authorised");
                                                            } else if (xhr.status == "0" && ajaxOptions == "") {
                                                                navigator.notification.alert("Could not connect to the network. Consider working offline.", null, "No Connection");
                                                            } else {
                                                                navigator.notification.alert("Failed to retrieve Gain Info", null, "Gain Info");
                                                            }
                                                        },
                                                        success: function (model) {
                                                            try {
                                                                debugger;
                                                                var result = model.GetOldCaptureResult;
                                                                viewModel.set("barcode", result.AssetBarCode);
                                                                viewModel.set("parentBarcode", result.ParentBarCode);
                                                                viewModel.set("oldBarcode", result.OldBarCode);
                                                                viewModel.set("classification", result.AssetHierarchyDesription);
                                                                viewModel.set("assetType", result.AssetTypeDescription);
                                                                viewModel.set("description", result.Description);
                                                                viewModel.set("make", result.Make);
                                                                viewModel.set("model", result.Model);
                                                                viewModel.set("serialNumber", result.SerialNumber);
                                                                viewModel.set("custodian", result.CustodianName);
                                                                viewModel.set("condition", result.Condition);
                                                                viewModel.set("qty", result.Qty);
                                                                viewModel.set("selectedReason", "");
                                                                viewModel.set("comment", "");
                                                                kendo.bind($("#SingleGainView"), viewModel);  
                                                                
                                                                var URL = utils.ImageURL + "/getImage/1/" + result.AssetBarCode + "/" + utils.project + "/" + account.database; 
                                                                $('#GeneralGainAssetImage').prop('src', URL);
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
            viewModel.getReasonList();
        },
 
        beforeShow: function (beforeShowEvt) {
            viewModel.set("selectedRoom", utils.room);
            viewModel.getGainInfo(utils.selectedBarcode);
        },
 
        show: function (showEvt) {
        },
        viewModel: viewModel
        
    }
});