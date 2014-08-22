define(["kendo", "app/account","app/data", "app/utils"], function (kendo, account, data, utils) {
    var viewModel = kendo.observable({
                                         
                                         selectedRoom: "",
                                         selectedCondition:"",
                                         selectedCustodian:"",
                                         yesNoList: [],
                                         custodianList: [],
                                         conditionList: [],
                                         barcode: "",
                                         parentBarcode: "",
                                         oldBarcode:"",
                                         classificationText: "",
                                         classificationID: "",
                                         assetTypeText: "",
                                         assetTypeID:"",
                                         description:"",
                                         make:"", 
                                         model:"",
                                         serialNumber:"",
                                         qty:"",
                                         ClassSearchTextbox:"",
                                         TypeSearchTextbox:"",
                                         hasBarcode: true,
                                         IsOnline: true,
                                         setOnline: function() {
                                             viewModel.set("IsOnline", true);
                                         },
                                         setOffline: function() {
                                             viewModel.set("IsOnline", false);
                                         },
                                         getYesNoList: function() {
                                             viewModel.yesNoList.push({Name: 'Yes'});
                                             viewModel.yesNoList.push({Name: 'No'});
                                         },
                                         getConditionList: function() {
                                             while (viewModel.conditionList.length > 0) {
                                                 viewModel.conditionList.pop();
                                             }
                                             viewModel.conditionList.push({Name: 'NEW'});
                                             viewModel.conditionList.push({Name: 'GOOD'});
                                             viewModel.conditionList.push({Name: 'FAIR'});
                                             viewModel.conditionList.push({Name: 'POOR'});
                                             viewModel.conditionList.push({Name: 'VERY POOR'});
                                         }, 
                                         getCustodian: function() {
                                             while (viewModel.custodianList.length > 0) {
                                                 viewModel.custodianList.pop();
                                             }
                                             var callback = function(tx, result) {
                                                 if (result != null && result.rows != null) {
                                                     for (var i = 0; i < result.rows.length; i++) {
                                                         var row = result.rows.item(i);
                                                       
                                                         viewModel.custodianList.push({
                                                                                          Username: row.Username, 
                                                                                          Name: row.Name
                                                                                      });
                                                         kendo.bind($("#CustodianSelect"), viewModel);  
                                                     }
                                                 }
                                             }
                                           
                                             data.GetUsers(callback);
                                         },
                                       
                                       
                                         DoBarcodings: function() {
                                             // debugger;
                                             if ($("#BarcodedSelect").val() == "No") {
                                                 $(".BarcodeVisible").hide();
                                                 $(".BarcodeInVisible").show();
                                             }
                                             else {
                                                 $(".BarcodeVisible").show();
                                                 $(".BarcodeInVisible").hide();
                                             }
                                         },  
                                         _scan: function() {
                                             var that = this;
                                             if (window.navigator.simulator === true) {
                                                 alert("Not Supported in Simulator.");
                                             }
                                             else {
                                                 cordova.plugins.barcodeScanner.scan(
                                                     function(result) {
                                                         if (!result.cancelled) {
                                                             viewModel.set("barcode", result.text);
                                                             viewModel.GetOldData();
                                                         }
                                                     }, 
                                                     function(error) {
                                                         console.log("Scanning failed: " + error);
                                                     });
                                             }
                                         },
                                         _scanParent: function() {
                                             var that = this;
                                             if (window.navigator.simulator === true) {
                                                 alert("Not Supported in Simulator.");
                                             }
                                             else {
                                                 cordova.plugins.barcodeScanner.scan(
                                                     function(result) {
                                                         if (!result.cancelled) {
                                                             viewModel.set("parentBarcode", result.text);
                                                         }
                                                     }, 
                                                     function(error) {
                                                         console.log("Scanning failed: " + error);
                                                     });
                                             }
                                         },
                                         _scanSerial: function() {
                                             var that = this;
                                             if (window.navigator.simulator === true) {
                                                 alert("Not Supported in Simulator.");
                                             }
                                             else {
                                                 cordova.plugins.barcodeScanner.scan(
                                                     function(result) {
                                                         if (!result.cancelled) {
                                                             viewModel.set("serialNumber", result.text);
                                                         }
                                                     }, 
                                                     function(error) {
                                                         console.log("Scanning failed: " + error);
                                                     });
                                             }
                                         },
                                         getClassification: function() {
                                             var callback = function(tx, result) {
                                                 var htmlSelect = "";
                   
                                                 if (result != null && result.rows != null) {
                                                     for (var i = 0; i < result.rows.length; i++) {
                                                         var row = result.rows.item(i);
                                                         htmlSelect += "<li><a onclick=app.views.general.viewModel.GoBackFromClass('" + row.ID + "') class='km-listview-link' data-role='listview-link'>" + row.Description + "</a></li>";
                                                     }
                                                     $("#class-listview").html(htmlSelect);
                                                     kendo.bind($("#ClassSelectionPage"), viewModel);  
                                                 } 
                                             } 
                                             data.GetLowestLevelClassification(callback);
                                             utils.navigate("#ClassSelectionPage")
                                         },
                                         GoBackFromClass: function(id) {
                                             var callback = function(tx, result) {
                                                 if (result != null && result.rows != null) {
                                                     var row = result.rows.item(0);
                                                   
                                                     viewModel.set("classificationText", row.Description);
                                                     viewModel.set("classificationID", row.ID);
                                                     viewModel.set("assetTypeText", "");
                                                     viewModel.set("assetTypeID", "");
                                                 }
                                             }
      
                                             data.GetClassificationByID(callback, id);
        
                                             utils.navigate("#GeneralView")
                                         },
                                         SearchClass: function() { 
                                             var callback = function(tx, result) {
                                                 var htmlSelect = "";
                  
                                                 if (result != null && result.rows != null) {
                                                     for (var i = 0; i < result.rows.length; i++) {
                                                         var row = result.rows.item(i);
                                                         htmlSelect += "<li><a onclick=app.views.general.viewModel.GoBackFromClass('" + row.ID + "') class='km-listview-link' data-role='listview-link'>" + row.Description + "</a></li>";
                                                     }
                                                     $("#class-listview").html(htmlSelect);
                                                 }
                                             }
                                             data.GetLowestLevelClassificationByDescription(callback, viewModel.ClassSearchTextbox);
                                         },
                                         getAssetType: function() {
                                             var callback = function(tx, result) {
                                                 var htmlSelect = "";
                  
                                                 if (result != null && result.rows != null) {
                                                     for (var i = 0; i < result.rows.length; i++) {
                                                         var row = result.rows.item(i);
                                                         var typecode = row.TypeCode.toString().replace(">", "-");
                                                         htmlSelect += "<li><a onclick=app.views.general.viewModel.GoBackFromAssetType('" + typecode + "') class='km-listview-link' data-role='listview-link'>" + row.TypeDescription + "</a></li>";
                                                     }
                                                     $("#assettype-listview").html(htmlSelect);
                                                 }
                                             }
                                             data.GetAssetTypeByHierarchyID(callback, viewModel.classificationID);
                                             utils.navigate("#AssetTypeSelectionPage")
                                         },
                                         searchType: function() {
                                             var callback = function(tx, result) {
                                                 var htmlSelect = "";
              
                                                 if (result != null && result.rows != null) {
                                                     for (var i = 0; i < result.rows.length; i++) {
                                                         var row = result.rows.item(i);
                       
                                                         var typecode = row.TypeCode.toString().replace(">", "-");
                                                         htmlSelect += "<li><a onclick=app.views.general.viewModel.GoBackFromAssetType('" + typecode + "') class='km-listview-link' data-role='listview-link'>" + row.TypeDescription + "</a></li>";
                                                     }
                                                     $("#assettype-listview").html(htmlSelect);
                                                 }
                                             }
                                             data.GetAssetTypeByDescription(callback, viewModel.TypeSearchTextbox); 
                                         },
                                         GoBackFromAssetType: function(TypeCode) {
                                             TypeCode = TypeCode.toString().replace("-", ">");
                                             var callbackassettype = function(tx, result) {
                                                 if (result != null && result.rows != null) {
                                                     var row = result.rows.item(0);
                                                     viewModel.set("assetTypeText", row.TypeDescription);
                                                     viewModel.set("assetTypeID", row.TypeCode);
                                                     viewModel.set("description", row.TypeDescription);
                                                   
                                                     var callbackassethierarchy = function(tx, result) {
                                                         if (result != null && result.rows != null) {
                                                             var row = result.rows.item(0);
                                                            
                                                             viewModel.set("classificationText", row.Description);
                                                             viewModel.set("classificationID", row.ID);
                                                         }
                                                     }
                                                     data.GetClassificationByID(callbackassethierarchy, row.HierarchyID);
                                                     debugger;
                                                     //Do the Specs
                                                     var callbackspeclink = function(tx, result) {
                                                         if (result != null && result.rows != null) {
                                                             var IDs = '';
                                                             for (var i = 0; i < result.rows.length; i++) {
                                                                 var row = result.rows.item(i);
                                                                 IDs += row.SpecID;
                                                                 if (i + 1 == result.rows.length) {
                                                                 }
                                                                 else {
                                                                     IDs += ',';
                                                                 }
                                                             }
                                                             var callbackTypeSpec = function(tx, resultSpec) {
                                                                 var htmlString = '';
                                                                 if (resultSpec != null && resultSpec.rows != null) {
                                                                     for (var i = 0; i < resultSpec.rows.length; i++) {
                                                                         var row = resultSpec.rows.item(i);
                                                                         debugger;
                                                                         if (row.IsCompulsory) {
                                                                             htmlString += "<div><div ><input id='compulsory' type='hidden' value='" + row.IsCompulsory + "' /><input id='description' type='hidden' value='" + row.Description + "' /><label for='spec" + row.ID + "'>" + row.Description + "</label></div><div style='display: inline-block; width:85%;'><input style='border: 1px solid red;' class='ipin-textbox' type='text' name='spec" + row.ID + "' id='spec" + row.ID + "' value='' /></div><div style='display: inline-block;'><a data-role='button' class='nav-button km-widget km-button km-back' onclick='app.views.general.viewModel.showSpecList(" + row.ID + ")' id='" + row.ID + "' name='" + row.ID + "'>...</a></input></div></div>";
                                                                         }
                                                                         else {
                                                                             htmlString += "<div><div ><input id='compulsory' type='hidden' value='" + row.IsCompulsory + "' /><input id='description' type='hidden' value='" + row.Description + "' /><label for='spec" + row.ID + "'>" + row.Description + "</label></div><div style='display: inline-block; width:85%;'><input class='ipin-textbox' type='text' name='spec" + row.ID + "' id='spec" + row.ID + "' value='' /></div><div style='display: inline-block;'><a data-role='button' class='nav-button km-widget km-button km-back' onclick='app.views.general.viewModel.showSpecList(" + row.ID + ")' id='" + row.ID + "' name='" + row.ID + "'>...</a></input></div></div>";
                                                                         }
                                                                     }
                                                                     $("#GeneralSpecFields").html(htmlString).trigger("create");
                                                                 }
                                                             }
                                                             data.GetAssetTypeSpecByIDs(callbackTypeSpec, IDs, row.TypeCode);
                                                         }
                                                     }
                                                     data.GetAssetTypeSpecLinkByTypeCode(callbackspeclink, row.TypeCode);
                                                 }
                                             }
                                             data.GetAssetTypeByTypeCode(callbackassettype, TypeCode);
      
                                             utils.navigate("#GeneralView")
                                         },
                                         showSpecList: function(specID) {
                                             var specIDelement = "spec" + specID;
                                             var callback = function(tx, resultSpecValue) {
                                                 var htmlString = '';

                                                 if (resultSpecValue != null && resultSpecValue != null) {
                                                     for (var j = 0; j < resultSpecValue.rows.length; j++) {
                                                         var rowValue = resultSpecValue.rows.item(j);
                                                         htmlString += "<a class='nav-button km-widget km-button km-back' data-role='button' onclick='app.views.general.viewModel.PopulateField(\"" + specIDelement + "\", \"" + rowValue.Description + "\")' >" + rowValue.Description + "</a>";
                                                     }
                                                 }

                                                 $("#SpecSelectionPage").show().data().kendoMobileModalView.open();
                                                 $("#SpecSelectionList").html(htmlString).trigger("create");
                                             }
                                             data.GetAssetTypeSpecValuebySpectID(callback, specID);
                                         },
                                         PopulateField: function(SpecID, SpecValue) {
                                             utils.closeSpec();
                                             document.getElementById(SpecID).value = SpecValue;
                                         },
                                         photo: function () {
                                             var options = {
                                                 quality : 50,
                                                 destinationType : Camera.DestinationType.FILE_URI,
                                                 sourceType : Camera.PictureSourceType.CAMERA,
                                                 allowEdit : false,
                                                 correctOrientation: false
                                             } 
                                             navigator.camera.getPicture(onSuccessGeneral, onFailGeneral, options);

                                             function onSuccessGeneral(imageData) {
                                                 var image = document.getElementById('GeneralAssetImage');
                                                 image.src = imageData; 
                                               
                                                 data.InsertPhoto(viewModel.barcode, imageData);
                                             }

                                             function onFailGeneral(message) {
                                                 utils.showError(message);
                                             }
                                         },
                                         GetOldData: function() {
                                             if (viewModel.IsOnline) {
                                                 var URL = utils.ServiceURL + "/OldCapture/" + viewModel.barcode;
                                                 $.ajax({
                                                            url: URL,
                                                            dataType: 'json',
                                                            type: "GET",
                                                            beforeSend: function (xhr) {
                                                                xhr.setRequestHeader('Authorization', 'Basic ' + btoa("hannes:Hans@0507"));  
                                                                xhr.setRequestHeader('X-Auth-Token', "MvcAMS360"); 
                                                                utils.showLoading();
                                                            },
                                                            complete: function (xhr) { 
                                                                utils.hideLoading();
                                                            },
                                                            error: function (xhr, ajaxOptions, thrownError) {
                                                                if (xhr.status == "403" || xhr.status == "401") {
                                                                    navigator.notification.alert("You are not authorised to fetch assets.", null, "Not Authorised")
                                                                }
                                                                else if (xhr.status == "0" && ajaxOptions == "") {
                                                                    navigator.notification.alert("Could not connect to the network. Consider working offline.", null, "No Connection")
                                                                }
                                                                else {
                                                                    $("#ConditionSelect").val('default').attr('selected', true).siblings('option').removeAttr('selected');
                                                                    $("#GeneralSpecFields").html('');
                                                             
                                                                    viewModel.set("oldBarcode", "");
                                                                    viewModel.set("description", "");
                                                                    viewModel.set("make", "");
                                                                    viewModel.set("model", "");
                                                                    viewModel.set("serialNumber", "");
                                                                    viewModel.set("selectedCustodian", "");
                                                                    viewModel.set("assetTypeID", "");
                                                                    viewModel.set("assetTypeText", "");
                                                                    viewModel.set("classificationID", "");
                                                                    viewModel.set("classificationText", "");
                                                                    viewModel.set("selectedCondition", "");
                                                                    $("#ConditionSelect").val('default').attr('selected', true).siblings('option').removeAttr('selected');
                                                                    $('#GeneralAssetImage').prop('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==');
                                                                }  
                                                            }, 
                                                            success: function (model) {
                                                                try {
                                                                    var result = model.GetOldCaptureResult;
                                                                    if (result.HasBeenScanned == '1') {
                                                                        navigator.notification.confirm('This asset has already been scanned by ' + result.Username + ' at Room ' + result.RoomCode + '. Do you want to scan it again?', function onConfirm(buttonIndex) {
                                                                            if (buttonIndex == 1) {
                                                                                viewModel.set("parentBarcode", result.ParentBarCode);
                                                                                viewModel.set("classificationText", result.AssetHierarchyDesription);
                                                                                viewModel.set("classificationID", result.AssetHierarchyID);
                                                                                viewModel.set("assetTypeText", result.AssetTypeDescription);
                                                                                viewModel.set("assetTypeID", result.AssetTypeID);
                                                                                viewModel.set("selectedCondition", result.Condition);
                                                                                viewModel.set("selectedCustodian", result.CustodianName);
                                                                                viewModel.set("description", result.Description);
                                                                                viewModel.set("make", result.Make);
                                                                                viewModel.set("model", result.Model);
                                                                                viewModel.set("oldBarcode", result.OldBarCode);
                                                                                viewModel.set("qty", result.Qty);
                                                                                viewModel.set("serialNumber", result.SerialNumber);
                                                                                $("#GeneralSpecFields").html('');
                                                                                var URL = utils.ImageURL + "/getImage/1/" + viewModel.barcode + "/MvcAMS360"; 
                                                                                $('#GeneralAssetImage').prop('src', URL);
                                                                   
                                                                                if (result.Specs != null) {
                                                                                    var htmlString = '';
                                                                                    $("#GeneralSpecFields").html('');
                                                                                    for (var i = 0; i < result.Specs.length; i++) {
                                                                                        if (result.Specs[i].IsCompulsory) {
                                                                                            htmlString += "<div><div ><input id='compulsory' type='hidden' value='" + result.Specs[i].IsCompulsory + "' /><input id='description' type='hidden' value='" + result.Specs[i].Description + "' /><label for='spec" + result.Specs[i].SpecID + "'>" + result.Specs[i].Description + "</label></div><div style='display: inline-block; width:85%;'><input style='border: 1px solid red;' class='ipin-textbox' type='text' name='spec" + result.Specs[i].SpecID + "' id='spec" + result.Specs[i].SpecID + "' value='" + result.Specs[i].SpecValue + "' /></div><div style='display: inline-block;'><a data-role='button' class='nav-button km-widget km-button km-back' onclick='app.views.general.viewModel.showSpecList(" + result.Specs[i].SpecID + ")' id='" + result.Specs[i].SpecID + "' name='" + result.Specs[i].SpecID + "'>...</a></input></div></div>";
                                                                                        }
                                                                                        else {
                                                                                            htmlString += "<div><div ><input id='compulsory' type='hidden' value='" + result.Specs[i].IsCompulsory + "' /><input id='description' type='hidden' value='" + result.Specs[i].Description + "' /><label for='spec" + result.Specs[i].SpecID + "'>" + result.Specs[i].Description + "</label></div><div style='display: inline-block; width:85%;'><input class='ipin-textbox' type='text' name='spec" + result.Specs[i].SpecID + "' id='spec" + result.Specs[i].SpecID + "' value='" + result.Specs[i].SpecValue + "' /></div><div style='display: inline-block;'><a data-role='button' class='nav-button km-widget km-button km-back' onclick='app.views.general.viewModel.showSpecList(" + result.Specs[i].SpecID + ")' id='" + result.Specs[i].SpecID + "' name='" + result.Specs[i].SpecID + "'>...</a></input></div></div>";
                                                                                        }
                                                                  
                                                                                        $("#GeneralSpecFields").html(htmlString).trigger("create");
                                                                                    }
                                                                                }
                                                                            }
                                                                            else {
                                                                                viewModel.clearfields();
                                                                            }
                                                                        }, 'Already Scanned', 'Yes,No');
                                                                    }
                                                                    else {
                                                                        viewModel.set("parentBarcode", result.ParentBarCode);
                                                                        viewModel.set("classificationText", result.AssetHierarchyDesription);
                                                                        viewModel.set("classificationID", result.AssetHierarchyID);
                                                                        viewModel.set("assetTypeText", result.AssetTypeDescription);
                                                                        viewModel.set("assetTypeID", result.AssetTypeID);
                                                                        viewModel.set("selectedCondition", result.Condition);
                                                                        viewModel.set("selectedCustodian", result.CustodianName);
                                                                        viewModel.set("description", result.Description);
                                                                        viewModel.set("make", result.Make);
                                                                        viewModel.set("model", result.Model);
                                                                        viewModel.set("oldBarcode", result.OldBarCode);
                                                                        viewModel.set("qty", result.Qty);
                                                                        viewModel.set("serialNumber", result.SerialNumber);
                                                                        $("#GeneralSpecFields").html('');
                                                                        var URL = utils.ImageURL + "/getImage/1/" + viewModel.barcode + "/MvcAMS360"; 
                                                                        $('#GeneralAssetImage').prop('src', URL);
                                                                   
                                                                        if (result.Specs != null) {
                                                                            var htmlString = '';
                                                                            $("#GeneralSpecFields").html('');
                                                                            for (var i = 0; i < result.Specs.length; i++) {
                                                                                if (result.Specs[i].IsCompulsory) {
                                                                                    htmlString += "<div><div ><input id='compulsory' type='hidden' value='" + result.Specs[i].IsCompulsory + "' /><input id='description' type='hidden' value='" + result.Specs[i].Description + "' /><label for='spec" + result.Specs[i].SpecID + "'>" + result.Specs[i].Description + "</label></div><div style='display: inline-block; width:85%;'><input style='border: 1px solid red;' class='ipin-textbox' type='text' name='spec" + result.Specs[i].SpecID + "' id='spec" + result.Specs[i].SpecID + "' value='" + result.Specs[i].SpecValue + "' /></div><div style='display: inline-block;'><a data-role='button' class='nav-button km-widget km-button km-back' onclick='app.views.general.viewModel.showSpecList(" + result.Specs[i].SpecID + ")' id='" + result.Specs[i].SpecID + "' name='" + result.Specs[i].SpecID + "'>...</a></input></div></div>";
                                                                                }
                                                                                else {
                                                                                    htmlString += "<div><div ><input id='compulsory' type='hidden' value='" + result.Specs[i].IsCompulsory + "' /><input id='description' type='hidden' value='" + result.Specs[i].Description + "' /><label for='spec" + result.Specs[i].SpecID + "'>" + result.Specs[i].Description + "</label></div><div style='display: inline-block; width:85%;'><input class='ipin-textbox' type='text' name='spec" + result.Specs[i].SpecID + "' id='spec" + result.Specs[i].SpecID + "' value='" + result.Specs[i].SpecValue + "' /></div><div style='display: inline-block;'><a data-role='button' class='nav-button km-widget km-button km-back' onclick='app.views.general.viewModel.showSpecList(" + result.Specs[i].SpecID + ")' id='" + result.Specs[i].SpecID + "' name='" + result.Specs[i].SpecID + "'>...</a></input></div></div>";
                                                                                }
                                                                                
                                                                                $("#GeneralSpecFields").html(htmlString).trigger("create");
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                                catch (e) {
                                                                    utils.showError("Failed to display asset info");
                                                                }
                                                            } 
                                                        });
                                             }

                                             else {//offline
                                                 var getCaptureAsset = function(tx, result) {
                                                     if (result != null && result.rows != null) {
                                                         if (result.rows.length > 0) {
                                                             var row = result.rows.item(0);
                                                             //We already scanned this asset
                                                             navigator.notification.confirm('This asset has already been scanned in Room ' + row.RoomCode + '. Do you want to scan it again?', function onConfirm(buttonIndex) {
                                                                 if (buttonIndex == 1) {
                                                                     $("#GeneralSpecFields").html('');
                                                                     viewModel.set("parentBarcode", row.ParentBarCode);
                                                                    
                                                                     viewModel.set("classificationID", row.AssetHierarchyID);
                                                                   
                                                                     viewModel.set("assetTypeID", row.AssetTypeID);
                                                                     viewModel.setClassificationTextboxes();
                                                                     viewModel.set("selectedCondition", row.Condition);
                                                                     viewModel.set("selectedCustodian", row.CustodianName);
                                                                     viewModel.set("description", row.Description);
                                                                     viewModel.set("make", row.Make);
                                                                     viewModel.set("model", row.Model);
                                                                     viewModel.set("oldBarcode", row.OldBarCode);
                                                                     viewModel.set("qty", row.Qty);
                                                                     viewModel.set("serialNumber", row.SerialNumber);
                                                                    
                                                                     $('#GeneralAssetImage').prop('src', row.Photo);
                                                                   
                                                                     //Do the Specs
                                                                     var getSpecValue = function(tx, resultSpec) {
                                                                         debugger;
                                                                         var htmlString = '';
                                                                         $("#GeneralSpecFields").html('');
                                                                         if (resultSpec != null && resultSpec.rows != null) {
                                                                             for (var i = 0; i < resultSpec.rows.length; i++) {
                                                                                 var row = resultSpec.rows.item(i);
                                                                                 if (row.IsCompulsory) {
                                                                                     htmlString += "<div><div ><input id='compulsory' type='hidden' value='" + row.IsCompulsory + "' /><input id='description' type='hidden' value='" + row.Description + "' /><label for='spec" + row.SpecID + "'>" + row.Description + ":</label></div><div style='display: inline-block;width: 85%;'><input style='border: 1px solid red;' class='ipin-textbox' type='text' name='spec" + row.SpecID + "' id='spec" + row.SpecID + "' value='" + row.SpecValue + "' /></div><div style='display: inline-block;'><a data-role='button' class='nav-button km-widget km-button km-back' onclick='app.views.general.viewModel.showSpecList(" + row.SpecID + ")' id='" + row.SpecID + "' name='" + row.SpecID + "'>...</a></input></div></div>";
                                                                                 }
                                                                                 else {
                                                                                     htmlString += "<div><div ><input id='compulsory' type='hidden' value='" + row.IsCompulsory + "' /><input id='description' type='hidden' value='" + row.Description + "' /><label for='spec" + row.SpecID + "'>" + row.Description + ":</label></div><div style='display: inline-block;width: 85%;'><input class='ipin-textbox' type='text' name='spec" + row.SpecID + "' id='spec" + row.SpecID + "' value='" + row.SpecValue + "' /></div><div style='display: inline-block;'><a data-role='button' class='nav-button km-widget km-button km-back' onclick='app.views.general.viewModel.showSpecList(" + row.SpecID + ")' id='" + row.SpecID + "' name='" + row.SpecID + "'>...</a></input></div></div>";
                                                                                 }
                                                                                 
                                                                                 $("#GeneralSpecFields").html(htmlString).trigger("create");
                                                                             }
                                                                         }
                                                                     } 
                                                                     data.GetSpecCapture(getSpecValue, viewModel.barcode);
                                                                 }
                                                                 else {
                                                                     viewModel.clearfields();
                                                                 }
                                                             }, 'Already Scanned', 'Yes,No');
                                                         }
                                                         else //Does not exists in asset capture
                                                         {
                                                             var getOldAsset = function(tx, result) {
                                                                 if (result != null && result.rows != null) {
                                                                     if (result.rows.length > 0) {
                                                                         var row = result.rows.item(0);
                                                                         $("#GeneralSpecFields").html('');
                                                                         viewModel.set("oldBarcode", row.OldBarCode);
                                                                         viewModel.set("description", row.Description);
                                                                         viewModel.set("assetTypeID", row.AssetTypeID);
                                                                         viewModel.set("make", row.Make);
                                                                         viewModel.set("model", row.Model);
                                                                         viewModel.set("serialNumber", row.SerialNumber);
                                                                         viewModel.set("parentBarcode", row.ParentBarCode);
                                                                         viewModel.setClassificationTextboxes();
                                                                         viewModel.set("selectedCondition", row.Condition);
                                                                         viewModel.set("selectedCustodian", row.CustodianName);
                                                                         // $("#ConditionSelect").val(row.Condition).attr('selected', true).siblings('option').removeAttr('selected');
                                                                         viewModel.set("barcode", row.AssetBarCode);
                                                                         $('#GeneralAssetImage').prop('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==');

                                                                         //Do the Specs
                                                                         var getSpecValue = function(tx, resultSpec) {
                                                                             debugger;
                                                                             var htmlString = '';
                                                                             $("#GeneralSpecFields").html('');
                                                                             if (resultSpec != null && resultSpec.rows != null) {
                                                                                 for (var i = 0; i < resultSpec.rows.length; i++) {
                                                                                     var row = resultSpec.rows.item(i);
                                                                                     debugger;
                                                                                     if (row.IsCompulsory) {
                                                                                         htmlString += "<div><div ><input id='compulsory' type='hidden' value='" + row.IsCompulsory + "' /><input id='description' type='hidden' value='" + row.Description + "' /><label for='spec" + row.SpecID + "'>" + row.Description + ":</label></div><div style='display: inline-block;width: 85%;'><input style='border: 1px solid red;' class='ipin-textbox' type='text' name='spec" + row.SpecID + "' id='spec" + row.SpecID + "' value='" + row.SpecValue + "' /></div><div style='display: inline-block;'><a data-role='button' class='nav-button km-widget km-button km-back' onclick='app.views.general.viewModel.showSpecList(" + row.SpecID + ")' id='" + row.ID + "' name='" + row.ID + "'>...</a></input></div></div>";
                                                                                     }
                                                                                     else {
                                                                                         htmlString += "<div><div ><input id='compulsory' type='hidden' value='" + row.IsCompulsory + "' /><input id='description' type='hidden' value='" + row.Description + "' /><label for='spec" + row.SpecID + "'>" + row.Description + ":</label></div><div style='display: inline-block;width: 85%;'><input class='ipin-textbox' type='text' name='spec" + row.SpecID + "' id='spec" + row.SpecID + "' value='" + row.SpecValue + "' /></div><div style='display: inline-block;'><a data-role='button' class='nav-button km-widget km-button km-back' onclick='app.views.general.viewModel.showSpecList(" + row.SpecID + ")' id='" + row.ID + "' name='" + row.ID + "'>...</a></input></div></div>";
                                                                                     }
                                                                                    
                                                                                     $("#GeneralSpecFields").html(htmlString).trigger("create");
                                                                                 }
                                                                             }
                                                                         } 
                                                                         data.GetSpecValueByBarcode(getSpecValue, viewModel.barcode);
                                                                     }
                                                                     else {
                                                                         $("#ConditionSelect").val('default').attr('selected', true).siblings('option').removeAttr('selected');
                                                                         $("#GeneralSpecFields").html('');
                                                             
                                                                         viewModel.set("oldBarcode", "");
                                                                         viewModel.set("description", "");
                                                                         viewModel.set("make", "");
                                                                         viewModel.set("model", "");
                                                                         viewModel.set("serialNumber", "");
                                                                         viewModel.set("selectedCustodian", "");
                                                                         viewModel.set("assetTypeID", "");
                                                                         viewModel.set("assetTypeText", "");
                                                                         viewModel.set("classificationID", "");
                                                                         viewModel.set("classificationText", "");
                                                                         viewModel.set("selectedCondition", "");
                                                                         $("#ConditionSelect").val('default').attr('selected', true).siblings('option').removeAttr('selected');
                                                                         $('#GeneralAssetImage').prop('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==');
                                                                     }
                                                                 }
                                                             }
                                                             data.GetOldAssetsByBarcode(getOldAsset, viewModel.barcode);
                                                         }
                                                     }
                                                 }
                                                 data.GetAssetCaptureByBarcode(getCaptureAsset, viewModel.barcode);
                                             }
                                         },
                                         setClassificationTextboxes : function () {
                                             var typecallback = function(tx, result) {
                                                 if (result != null && result.rows != null) {
                                                     var row = result.rows.item(0);
                                                     viewModel.set("assetTypeID", row.TypeCode);
                                                     viewModel.set("assetTypeText", row.TypeDescription);
                                                     var classcallback = function(txx, resultClass) {
                                                         if (resultClass != null && resultClass.rows != null) {
                                                             var row = resultClass.rows.item(0);
                                                             viewModel.set("classificationID", row.ID);
                                                             viewModel.set("classificationText", row.Description);
                                                         }
                                                     }
                                                     data.GetClassificationByID(classcallback, row.HierarchyID);
                                                 }
                                             }
                                            
                                             data.GetAssetTypeByTypeCode(typecallback, viewModel.assetTypeID);
                                         },
                                         submit: function() {
                                             if (viewModel.IsOnline) {
                                                 if (viewModel.Validation()) {
                                                     var get_tags = document.getElementById("GeneralSpecFields").getElementsByTagName("input");

                                                     var mSpecs = new Array();
                                                     var mSpecIDs = new Array();
                                                     var mSpecsDescriptions = new Array();
                                                     var count = 0;
                                                     var Descriptioncount = 0;
                                                     for (var i = 0; i < get_tags.length; i++) {
                                                         if (get_tags[i].type == "text") {
                                                             mSpecs[count] = get_tags[i].value;
                                                             var specid = get_tags[i].id;
                                                             specid = specid.replace('spec', '');
                                                             mSpecIDs[count] = specid;
                                                             count++;
                                                         }
                                                         else if (get_tags[i].type == "hidden") {
                                                             if (get_tags[i].id == "description") {
                                                                 mSpecsDescriptions[Descriptioncount] = get_tags[i].value;
                                                                 Descriptioncount++;
                                                             }
                                                         }
                                                     }
                                                     var SpecList = [];
                                                     for (var j = 0; j < mSpecs.length; j++) {
                                                         SpecList.push({ID: 0, Description: mSpecsDescriptions[j], SpecValue: mSpecs[j], SpecID: mSpecIDs[j], SpecValueID: 0, AssetCode: viewModel.barcode, IsCompulsory: 1});
                                                     }
                                                     var AssetCapture = {
                                                         AssetBarCode: viewModel.barcode, 
                                                         GroupingName: 'GEN', 
                                                         OldBarCode: viewModel.oldBarcode, 
                                                         Description: viewModel.description, 
                                                         AssetHierarchyID: viewModel.classificationID, 
                                                         AssetTypeID: viewModel.assetTypeID, 
                                                         CustodianName: viewModel.selectedCustodian,
                                                         Condition: viewModel.selectedCondition, 
                                                         Make: viewModel.make,
                                                         Model: viewModel.model,
                                                         SerialNumber: viewModel.serialNumber,
                                                         Qty: viewModel.Qty,
                                                         Username: account.userName,
                                                         RoomCode: viewModel.selectedRoom,
                                                         ParentBarCode: viewModel.parentBarcode,
                                                         Photo: "",
                                                         Specs: SpecList
                                                     }
                                           
                                                     $.ajax({
                                                                url: utils.ServiceURL + '/PostCaptureAsset',
                                                                type: 'POST',
                                                                data: JSON.stringify(AssetCapture),
                                                                dataType: 'json',
                                                                contentType: "application/json; charset=utf-8",
                                                                beforeSend: function (xhr) {
                                                                    xhr.setRequestHeader('Authorization', 'Basic ' + btoa("hannes:Hans@0507"));  
                                                                    xhr.setRequestHeader('X-Auth-Token', "MvcAMS360"); 
                                                                    utils.showLoading();
                                                                },
                                                                complete: function (xhr) {
                                                                    utils.hideLoading(); 
                                                                },
                                                                success: function (res) {
                                                                    var image = document.getElementById('GeneralAssetImage').src;
                                                                    var options = new FileUploadOptions(); 

                                                                    options.chunkedMode = false;
 
                                                                    options.fileKey = viewModel.barcode; 
                                                                    options.params = {'AssetBarCode': + viewModel.barcode};
                                                                    var imagefilename = viewModel.barcode; 

                                                                    options.fileName = imagefilename;
                                                                    options.mimeType = "image/jpeg"; 
                                                                    var ft = new FileTransfer(); 
                                                                    utils.showLoading();
                                                                    ft.upload(image, utils.ImageURL + "/SaveImage", viewModel.win, viewModel.fail, options);
                                                                },
                                                                error: function (xhr, ajaxOptions, error) {
                                                                    if (xhr.status == "403" || xhr.status == "401") {
                                                                        navigator.notification.alert("You are not authorised to fetch assets", null, "Not Authorised")
                                                                    }
                                                                    else if (xhr.status == "0" && ajaxOptions == "") {
                                                                        navigator.notification.alert("Could not connect to the network. Consider working offline.", null, "No Connection")
                                                                    }
                                                                    else {
                                                                        navigator.notification.alert("Failed to Post data", null, "Submit Failed")
                                                                    }
                                                                }
                                                            });
                                                 }
                                             }
                                             else {//offline
                                                 try {
                                                     if (!viewModel.Validation())
                                                         return;
                                                   
                                                     var assetgetcallback = function(transaction, result) {
                                                         debugger;
                                                         if (result != null && result.rows != null) {
                                                             var rows = result.rows;
                                                         
                                                             if (rows.length > 0) {//Does exists
                                                                 var OldTypeCode = rows.item(0).AssetTypeID;
                                                                 var updateassetcallback = function(tx, result) {
                                                                     var get_tags = document.getElementById("GeneralSpecFields").getElementsByTagName("input");

                                                                     var mSpecs = new Array();
                                                                     var mSpecIDs = new Array();
                                                                     var mCompulses = new Array();
                                                                     var mSpecsDescriptions = new Array();
                                                                     var count = 0;
                                                                     var Descriptioncount = 0;
                                                                     var Compulsecount = 0;
                                                                     for (var i = 0; i < get_tags.length; i++) {
                                                                         if (get_tags[i].type == "text") {
                                                                             mSpecs[count] = get_tags[i].value;
                                                                             var specid = get_tags[i].id;
                                                                             specid = specid.replace('spec', '');
                                                                             mSpecIDs[count] = specid;
                                                                             count++;
                                                                         }
                                                                         else if (get_tags[i].type == "hidden") {
                                                                             if (get_tags[i].id == "description") {
                                                                                 mSpecsDescriptions[Descriptioncount] = get_tags[i].value;
                                                                                 Descriptioncount++;
                                                                             }
                                                                             else {
                                                                                 mCompulses[Compulsecount] = get_tags[i].value;
                                                                                 Compulsecount++;
                                                                             }
                                                                         }
                                                                     }
                                                                     //only do this if specs exists
                                                                     if (mSpecIDs.length > 0) {  
                                                                         if (OldTypeCode == viewModel.assetTypeID) {
                                                                             //Here we know the asset type has not changed. Do normal stuff
                                                                             var speccallback = function(tx, resultSpecValue) {
                                                                                 if (resultSpecValue != null && resultSpecValue.rows != null) {
                                                                                     for (var i = 0; i < mSpecs.length; i++) {
                                                                                         var rows = resultSpecValue.rows;
                                                                                         var updatespecvaluecallback = function(tx, result) {
                                                                                         }
                                                                                         data.UpdateSingleAscSpecValueCapture(updatespecvaluecallback, tx, rows.item(i).Description, mSpecs[i], rows.item(i).SpecID, rows.item(i).SpecValueID, rows.item(i).AssetCode, mCompulses[i]);
                                                                                     }
                                                                                                   
                                                                                     viewModel.clearfields();
                                                                                 }
                                                                             }
                                                                             data.GetSpecValueByBarcode(speccallback, viewModel.barcode);
                                                                         }
                                                                         else {
                                                                             //The asset type has changed. We need to create new specs for this asset. The deletion of the old specs will be done on server side
                                                                             try {
                                                                                 for (var i = 0; i < mSpecs.length; i++) {
                                                                                     data.InsertSingleAscSpecValueCapture(tx, mSpecsDescriptions[i], mSpecs[i], mSpecIDs[i], 0, viewModel.barcode, mCompulses[i]);
                                                                                 }
                                                                                 viewModel.clearfields();
                                                                             }
                                                                             catch (e) {
                                                                                 utils.showError("Insert of the Specs failed: ", e);
                                                                             }
                                                                         }
                                                                     }
                                                                     else {
                                                                         viewModel.clearfields();
                                                                     }
                                                                 }
                                                                 var Oldbarcode = viewModel.oldBarcode;
                                                                 var Description = viewModel.description;
                                                                 var ClassificationID = viewModel.classificationID;
                                                                 var AssetTypeID = viewModel.assetTypeID;
                                                                 var Condition = viewModel.selectedCondition;
                                                                 var Barcode = viewModel.barcode;
                                                                 var Make = viewModel.make;
                                                                 var Model = viewModel.model;
                                                                 var SerialNumber = viewModel.serialNumber;
                                                                 var Custodian = viewModel.selectedCustodian;
                                                                 var ParentBarcode = viewModel.parentBarcode;
                                                                 var Qty = viewModel.qty;
                                                                 var Username = utils.userName;
                                                                 var Room = viewModel.selectedRoom;
                                                                 var Photo = document.getElementById('GeneralAssetImage').src;
                                                                 data.UpdateSingleAssetCapture(updateassetcallback, 
                                                                                               transaction, 
                                                                                               Oldbarcode, 
                                                                                               Description, 
                                                                                               ClassificationID, 
                                                                                               AssetTypeID, 
                                                                                               Condition, 
                                                                                               Photo,
                                                                                               Barcode,
                                                                                               Make,
                                                                                               Model,
                                                                                               SerialNumber,
                                                                                               Custodian,
                                                                                               ParentBarcode,
                                                                                               Qty,
                                                                                               Username,
                                                                                               Room);
                                                             }
                                                             else {//Does not exists in AscAssetCapture
                                                                 var insertassetcapturecallback = function(tx, result) {
                                                                     var get_tags = document.getElementById("GeneralSpecFields").getElementsByTagName("input");

                                                                     var mSpecs = new Array();
                                                                     var mSpecIDs = new Array();
                                                                     var mSpecsDescriptions = new Array();
                                                                     var mCompulses = new Array();
                                                                     var count = 0;
                                                                     var Descriptioncount = 0;
                                                                     var Compulsorycount = 0;
                                                                     for (var i = 0; i < get_tags.length; i++) {
                                                                         if (get_tags[i].type == "text") {
                                                                             mSpecs[count] = get_tags[i].value;
                                                                             var specid = get_tags[i].id;
                                                                             specid = specid.replace('spec', '');
                                                                             mSpecIDs[count] = specid;
                                                                             count++;
                                                                         }
                                                                         else if (get_tags[i].type == "hidden") {
                                                                             if (get_tags[i].id == "description") {
                                                                                 mSpecsDescriptions[Descriptioncount] = get_tags[i].value;
                                                                                 Descriptioncount++;
                                                                             }
                                                                             else
                                                                             {
                                                                                  mCompulses[Compulsorycount] = get_tags[i].value;
                                                                                 Compulsorycount++;
                                                                             }
                                                                         }
                                                                     }
                          
                                                                     //Only do this if there is specs
                                                                     var AssetBarCode = viewModel.barcode;
                                                                     if (mSpecs.length > 0) {
                                                                         try {
                                                                             for (var i = 0; i < mSpecs.length; i++) {
                                                                                 var getSpecValuecallback = (function(i) {
                                                                                     return function(tx, result) {
                                                                                         if (result != null && result.rows != null) {
                                                                                             if (result.rows.length > 0) {
                                                                                                 data.InsertSingleAscSpecValueCapture(tx, mSpecsDescriptions[i], mSpecs[i], mSpecIDs[i], result.rows.item(0).ID, AssetBarCode, mCompulses[i]);
                                                                                             }
                                                                                             else {
                                                                                                 debugger;
                                                                                                 data.InsertSingleAscSpecValueCapture(tx, mSpecsDescriptions[i], mSpecs[i], mSpecIDs[i], 0, AssetBarCode, mCompulses[i]);
                                                                                             }
                                                                                         }
                                                                                     }
                                                                                 })(i);
                                                                                 data.GetSpecValueByBarcodeAndSpecID(getSpecValuecallback, viewModel.barcode, mSpecIDs[i]);
                                                                             }
                                                                             viewModel.clearfields();
                                                                         }
                                                                         catch (e) {
                                                                             data.DeleteSingleAssetCapture(AssetBarCode);
                                                                             data.DeleteSingleAscSpecValueCaptureByBarcode(AssetBarCode);
                                                                             utils.showError("Insert of the Specs failed: " + e.message);
                                                                         }
                                                                     } 
                                                                     else {
                                                                         viewModel.clearfields();
                                                                     }
                                                                 }
                                                                 var grouping = "GEN";
                                                                 Oldbarcode = viewModel.oldBarcode;
                                                                 Description = viewModel.description;
                                                                 ClassificationID = viewModel.classificationID;
                                                                 AssetTypeID = viewModel.assetTypeID;
                                                                 Condition = viewModel.selectedCondition;
                                                                 Barcode = viewModel.barcode;
                                                                 Make = viewModel.make;
                                                                 Model = viewModel.model;
                                                                 SerialNumber = viewModel.serialNumber;
                                                                 Custodian = viewModel.selectedCustodian;
                                                                 ParentBarcode = viewModel.parentBarcode;
                                                                 Qty = viewModel.qty;
                                                                 Username = utils.userName;
                                                                 Room = viewModel.selectedRoom;
                                                                 Photo = document.getElementById('GeneralAssetImage').src;
                                                                 data.InsertSingleAssetCapture(insertassetcapturecallback, 
                                                                                               transaction, 
                                                                                               Barcode, 
                                                                                               grouping, 
                                                                                               Oldbarcode, 
                                                                                               Description, 
                                                                                               ClassificationID, 
                                                                                               AssetTypeID, 
                                                                                               Condition, 
                                                                                               Photo,
                                                                                               Make,
                                                                                               Model,
                                                                                               SerialNumber,
                                                                                               Custodian,
                                                                                               ParentBarcode,
                                                                                               Qty,
                                                                                               Username,
                                                                                               Room);
                                                             }
                                                         }
                                                     }
                                                     data.GetAssetCaptureByBarcode(assetgetcallback, viewModel.barcode);
                                                 } 
                                                 catch (e) {
                                                     utils.showError("An Error Occurred: " + e.message);
                                                 }
                                             } 
                                         },
                                         win: function(r) {
                                             utils.hideLoading(); 
                                             if (r.response.indexOf("Success") > -1) {
                                                 viewModel.clearfields();
                                             }
                                             else {
                                                 navigator.notification.alert("The photo could not be uploaded online. Try saving it offline." + error, null, "Photo Upload Failed");
                                             }
                                         },
                                         fail: function(error) {
                                             utils.hideLoading(); 
                                           
                                             navigator.notification.alert("The photo could not be uploaded online. Try saving it offline." + error, null, "Photo Upload Failed");
                                         },
                                         clearfields:function() {
                                             $("#GeneralSpecFields").html('');
                                             viewModel.set("barcode", "");
                                             viewModel.set("oldBarcode", "");
                                             viewModel.set("description", "");
                                             viewModel.set("assetTypeID", "");
                                             viewModel.set("make", "");
                                             viewModel.set("model", "");
                                             viewModel.set("serialNumber", "");
                                             viewModel.set("parentBarcode", "");
                                             viewModel.set("assetTypeID", "");
                                             viewModel.set("assetTypeText", "");
                                             viewModel.set("classificationID", "");
                                             viewModel.set("classificationText", "");
                                             viewModel.set("selectedCondition", "");
                                             viewModel.set("selectedCustodian", "");
                                             $('#GeneralAssetImage').prop('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==');
                                         }, 
                                         Validation: function() {
                                             if (viewModel.barcode == '' || viewModel.barcode == null) {
                                                 navigator.notification.alert("Asset Barcode is required", null, "Required")
                                                 return false;
                                             }
                                             if (viewModel.classificationText == '' || viewModel.classificationText == null) {
                                                 navigator.notification.alert("Classification is required", null, "Required")
                                                 return false;
                                             }
                                             if (viewModel.assetTypeText == '' || viewModel.assetTypeText == null) {
                                                 navigator.notification.alert("Asset Type is required", null, "Required")
                                                 return false;
                                             }
                                             if (viewModel.description == '' || viewModel.description == null) {
                                                 navigator.notification.alert("Description is required", null, "Required")
                                                 return false;
                                             }
                                             if (viewModel.selectedCustodian == '' || viewModel.selectedCustodian == null) {
                                                 navigator.notification.alert("Custodian is required", null, "Required")
                                                 return false;
                                             }
                                             
                                             //Do Spec validation
                                             var get_tags = document.getElementById("GeneralSpecFields").getElementsByTagName("input");
                                             debugger;
                                             var mSpecValues = new Array();
                                             var mIsCompulsory = new Array();
                                             var count = 0;
                                             var Compulsecount = 0;
                                             for (var i = 0; i < get_tags.length; i++) {
                                                 if (get_tags[i].type == "text") {
                                                     mSpecValues[count] = get_tags[i].value;
                                                     count++;
                                                 }
                                                 else if (get_tags[i].type == "hidden") {
                                                     if (get_tags[i].id == "compulsory") {
                                                         mIsCompulsory[Compulsecount] = get_tags[i].value;
                                                         Compulsecount++;
                                                     }
                                                 }
                                             }
                                             for (var j = 0; j < mSpecValues.length; j++) {
                                                 if (mSpecValues[j] == '' && mIsCompulsory[j] == '1') {
                                                     navigator.notification.alert("All attribute fields with a red border is required", null, "Required")
                                                     return false;
                                                 }
                                             }
                                             return true; 
                                         }
                                     });  
    kendo.bind($("#GeneralView"), viewModel);  
    return {
        init: function (initEvt) {
            viewModel.getYesNoList();
            viewModel.getConditionList();
            viewModel.getCustodian();
            viewModel.set("selectedRoom", $("#RoomSelect").val());
            // ... init event code ...
        },
 
        beforeShow: function (beforeShowEvt) {
        },
 
        show: function (showEvt) {
        },
        viewModel: viewModel
        
      
    }
});