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
                                             viewModel.reasonList.push({Name: 'Stolen'});
                                             viewModel.reasonList.push({Name: 'Disposed'});
                                             viewModel.reasonList.push({Name: 'Moved to other room'});
                                             viewModel.reasonList.push({Name: 'Sent for service'});
                                             viewModel.reasonList.push({Name: 'Other'});
                                         },
                                         FoundIt: function() {
                                             
                                             utils.navigate("#GeneralView");
                                            
                                         },
                                         SubmitLoss: function() {
                                             var Loss = {
                                                 AssetBarCode: viewModel.barcode, 
                                                 RoomCode: utils.room,
                                                 ProjectID: utils.project,
                                                 Reason: viewModel.selectedReason,
                                                 Comment: viewModel.comment,
                                                 DoneBy: "HANNES"
                                             }
                                             $.ajax({
                                                        url: utils.ServiceURL + '/PostLoss',
                                                        type: 'POST',
                                                        data: JSON.stringify(Loss),
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
                                                                if (viewModel.selectedReason === "Barcode Replaced")
                                                                {
                                                                    
                                                                    $("#OldBarcodeTextBox").val(viewModel.barcode);
                                                                    utils.navigate("#GeneralView");
                                                                }
                                                                else
                                                                {
                                                                     utils.navigate("#LossesView");
                                                                }
                                                               
                                                            } else {
                                                                navigator.notification.alert("The Loss could not be sent. Message from server: " + res, null, "Could not sent loss")
                                                                utils.navigate("#LossesView");
                                                            }
                                                        },
                                                        error: function (xhr, ajaxOptions, error) {
                                                            if (xhr.status == "403" || xhr.status == "401") {
                                                                navigator.notification.alert("You are not authorised to fetch assets", null, "Not Authorised")
                                                            } else if (xhr.status == "0" && ajaxOptions == "") {
                                                                navigator.notification.alert("Could not connect to the network. Consider working offline.", null, "No Connection")
                                                            } else {
                                                                navigator.notification.alert("Loss could not be sent", null, "Loss")
                                                            }
                                                        }
                                                    });
                                         },
                                       
                                         getLossInfo: function(AssetBarcode) {
                                             debugger; 
                                             var URL = utils.ServiceURL + "/HistoryCapture/" + AssetBarcode + "/" + utils.project;
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
                                                                navigator.notification.alert("Failed to retrieve Loss Info", null, "Loss Info");
                                                            }
                                                        },
                                                        success: function (model) {
                                                            try {
                                                                debugger;
                                                                var result = model.GetHistoryCaptureResult;
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
                                                                
                                                                kendo.bind($("#SingleLossView"), viewModel);  
                                                                
                                                                var URL = utils.ImageURL + "/getImage/1/" + result.AssetBarCode + "/" + utils.project + "/" + account.database; 
                                                                $('#GeneralLossAssetImage').prop('src', URL);
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
              debugger;
            viewModel.getReasonList();
        },
 
        beforeShow: function (beforeShowEvt) {
            debugger;
            viewModel.set("selectedRoom", utils.room);
            viewModel.getLossInfo(utils.selectedBarcode);
        },
 
        show: function (showEvt) {
        },
        viewModel: viewModel
        
    }
});