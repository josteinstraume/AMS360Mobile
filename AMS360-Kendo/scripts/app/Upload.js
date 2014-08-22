define(["kendo","app/account","app/data", "app/utils", "app/app"], function (kendo, account, data, utils, app) {
    var viewModel = kendo.observable({
                                         
                                         SyncAssetCapture: "Assets",
                                         SyncPhotos: "Photos",
                                         SyncFailPhotos: "",
                                         IncludeAssets: false,
                                         SyncAll:function() {
                                             viewModel.PostAssets();
                                         },
                                     
                                         PostAssets: function() {
                                             var callback = function(tx, result) {
                                                 if (result != null && result.rows != null) {
                                                     if (result.rows.length == 0) {
                                                         viewModel.UploadPhotos();
                                                         viewModel.set("SyncAssetCapture", "Success: No assets were found on the mobile device to sync");
                                                     }
                                                     else {
                                                         var CS = [];
                                                         for (var i = 0; i < result.rows.length; i++) {
                                                             var SpecList = [];
                            
                                                             //Do the Specs
                                                             var callback2 = (function(i) {
                                                                 return function(transaction, Specresult) {
                                                                     if (Specresult != null && Specresult.rows != null) {
                                                                         console.log(Specresult.rows.length);
                                                                         if (Specresult.rows.length > 0) {
                                                                             for (var j = 0; j < Specresult.rows.length; j++) {
                                                                                 SpecList.push({ID: 0, Description: Specresult.rows.item(j).Description, SpecValue: Specresult.rows.item(j).SpecValue, SpecID: Specresult.rows.item(j).SpecID, SpecValueID: Specresult.rows.item(j).SpecValueID, AssetCode: Specresult.rows.item(j).AssetCode, IsCompulsory: 1});
                                                                             }
                                                                         }
                                      									debugger;
                                                                         CS.push({
                                                                                     AssetBarCode: result.rows.item(i).AssetBarCode, 
                                                                                     Photo: result.rows.item(i).Photo, 
                                                                                     GroupingName: result.rows.item(i).GroupingName, 
                                                                                     OldBarCode: result.rows.item(i).OldBarCode, 
                                                                                     Description: result.rows.item(i).Description, 
                                                                                     AssetHierarchyID: result.rows.item(i).AssetHierarchyID, 
                                                                                     AssetTypeID: result.rows.item(i).AssetTypeID, 
                                                                                     Condition: result.rows.item(i).Condition, 
                                                                             		CustodianName: result.rows.item(i).CustodianName,
                                                                             		Make: result.rows.item(i).Make,
                                                                             		Model: result.rows.item(i).Model,
                                                                             		ParentBarCode: result.rows.item(i).ParentBarCode,
                                                                             		Qty: result.rows.item(i).Qty,
                                                                             		RegistrationNumber: result.rows.item(i).RegistrationNumber,
                                                                             		RoomCode: result.rows.item(i).RoomCode,
                                                                             		SerialNumber: result.rows.item(i).SerialNumber,
                                                                             		Username: result.rows.item(i).Username,
                                                                                     Specs: SpecList
                                                                                 });
                                        
                                                                         if (result.rows.length - 1 == i) {
                                                                             $.ajax({
                                                                                        url: utils.ServiceURL + '/PostCaptureAssets',
                                                                                        type: 'POST',
                                                                                        data: JSON.stringify(CS),
                                                                                        dataType: 'json',
                                                                                        contentType: "application/json; charset=utf-8",
                                                                                        beforeSend: function (xhr) {
                                                                                            viewModel.set("SyncAssetCapture", "Uploading assets...");
                                                                                            xhr.setRequestHeader('Authorization', 'Basic ' + btoa("hannes:Hans@0507"));  
                                                                                            xhr.setRequestHeader('X-Auth-Token', "MvcAMS360"); 
                                                                                        },
                                                                                        complete: function (xhr) {
                                                                                            utils.hideLoading();
                                                                                        },
                                                                                        success: function (res) {
                                                                                             debugger;
                                                                                            if (res) {
                                                                                                viewModel.set("SyncAssetCapture", "Successfully send assets");
                                                                                                data.ReCreateAssetCapture();
                                                                                                viewModel.UploadPhotos();
                                                                                            }
                                                                                            else {
                                                                                                viewModel.set("SyncAssetCapture", "Failed to send Assets");
                                                                                                viewModel.set("SyncPhotos", "The assets failed. Not Photos were synced");
                                                                                            }
                                                                                        },
                                                                                        error: function (res) {
                                                                                           
                                                                                            if (xhr.status == "403" || xhr.status == "401") {
                                                                                                viewModel.set("SyncAssetCapture", "You are not authorised to upload assets.");
                                                                                            }
                                                                                            else if (xhr.status == "0" && ajaxOptions == "") {
                                                                                                viewModel.set("SyncAssetCapture", "Could not connect to the network. Please make sure the device is connected");
                                                                                            }
                                                                                            else {
                                                                                                viewModel.set("SyncAssetCapture", "Failed to upload assets.");
                                                                                            }  
                                                                                        }
                                                                                    });
                                                                         }
                                                                     }
                                                                 }
                                                             })(i)
                           
                                                             data.GetSpecCapture(callback2, result.rows.item(i).AssetBarCode);
                                                         }
                                                     }
                                                 }
                                             }
                                             data.GetAssetCapture(callback);
                                         },
                                      
                                         UploadPhotos: function() {
                                             var IsSuccess = true;
                                             var photoCallback = function(tx, Photoresult) {
                                                 if (Photoresult != null && Photoresult.rows != null) {
                                                     if (Photoresult.rows.length == 0) {
                                                         viewModel.set("SyncPhotos", "Success: No photos were found on the mobile device to sync");
                                                     }
                                                     else {
                                                          viewModel.set("SyncPhotos", "Uploading photos...");
                                                         for (var i = 0; i < Photoresult.rows.length; i++) {
                                                             var options = new FileUploadOptions(); 

                                                             options.chunkedMode = false;
															debugger;
                                                             options.fileKey = Photoresult.rows.item(i).AssetBarCode; 

                                                             var imagefilename = Photoresult.rows.item(i).AssetBarCode; 

                                                             options.fileName = imagefilename;
                                                             options.mimeType = "image/jpeg"; 
                                                             var ft = new FileTransfer(); 

                                                             ft.upload(Photoresult.rows.item(i).Path, utils.ImageURL + "/SaveImage", viewModel.win, viewModel.fail, options);
                                                         }
                                                     }
                                                 }
                                             }
                                             data.GetPhotos(photoCallback);
                                         },
                                         win: function(r) {
                                            
                                             if (r.response.indexOf("Success") > -1)
                                             {
                                                  viewModel.set("SyncPhotos", "Successfully uploaded photos");
                                                 data.ClearPhotoTable();
                                             }
                                             else
                                             {
                                                 viewModel.set("SyncPhotos", "Some Photos did not sync. However all photos are still on the device." );
                                             }
                                            
                                             
                                         },
                                         fail: function(error) {
                                             viewModel.set("SyncPhotos", "Some Photos did not sync. However all photos are still on the device." );
                                         }

          
        
                                     });

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
        viewModel: viewModel
    }
});