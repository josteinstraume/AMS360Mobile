define(["kendo", "app/account", "app/data", "app/utils","libs/jSignature.min"], function (kendo, account, data, utils, signature) {
    var viewModel = kendo.observable({
                                         selectedRoom: "",
                                         custodian: "",
                                         Reset: function() {
                                             $("#signature").jSignature("reset");
                                         },
                                         GetCustodian: function() {
                                             var RoomCallback = function(tx, resultRoom) {
                                                 if (resultRoom != null && resultRoom.rows != null) {
                                                     for (var i = 0; i < resultRoom.rows.length; i++) {
                                                         var row = resultRoom.rows.item(i);
                                                         var UserCallback = function(tx, resultUser) {
                                                             if (resultUser != null && resultUser.rows != null) {
                                                                 for (var i = 0; i < resultUser.rows.length; i++) {
                                                                     var row = resultUser.rows.item(i);
                                                                     viewModel.set("custodian", row.Name);
                                                                 }
                                                             }
                                                         } 
                                                         data.GetUser(UserCallback, row.Username);
                                                     }
                                                 }
                                             } 
                                             data.GetRoom(RoomCallback, utils.room);
                                         },
                                         Submit: function() {
                                             var RoomStatus = {
                                                 Status: 'Completed', 
                                                 ScannedBy: 'Hannes',
                                                 RoomCode: utils.room,
                                                 ProjectID: utils.project
                                             }
                                             $.ajax({
                                                        url: utils.ServiceURL + '/MarkRoomStatus',
                                                        type: 'POST',
                                                        data: JSON.stringify(RoomStatus),
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
                                                                debugger;
                                                                var datapair = $("#signature").jSignature("getData");
                                                                var i = new Image();
                                                                i.src = datapair;
                                                                var image = i.src;
                                                                var options = new FileUploadOptions(); 

                                                                options.chunkedMode = false;
 
                                                                options.fileKey = utils.room; 
                                                                options.params = {'RoomCode': + utils.room};
                                                                var imagefilename = utils.room + " " + utils.project + " " + account.database; 

                                                                options.fileName = imagefilename;
                                                                options.mimeType = "image/jpeg"; 
                                                                var ft = new FileTransfer(); 
                                                                utils.showLoading();
                                                                ft.upload(image, utils.ImageURL + "/SaveSignature", viewModel.win, viewModel.fail, options);
                                                            }
                                                            else {
                                                                navigator.notification.alert("Room could not be marked. Message from server: " + res, null, "Could not mark room")
                                                                utils.navigate("#LocationView");
                                                            }
                                                        },
                                                        error: function (xhr, ajaxOptions, error) {
                                                            if (xhr.status == "403" || xhr.status == "401") {
                                                                navigator.notification.alert("You are not authorised to fetch assets", null, "Not Authorised")
                                                            }
                                                            else if (xhr.status == "0" && ajaxOptions == "") {
                                                                navigator.notification.alert("Could not connect to the network. Consider working offline.", null, "No Connection")
                                                            }
                                                            else {
                                                                navigator.notification.alert("Room could not be marked", null, "Could not mark room")
                                                            }
                                                        }
                                                    });
                                         },
                                         win: function(r) {
                                             utils.hideLoading(); 
                                             if (r.response.indexOf("Success") > -1) {
                                                 utils.navigate("#LocationView");
                                             }
                                             else {
                                                 navigator.notification.alert("The signature could not be uploaded.", null, "Signature Upload Failed");
                                             }
                                         },
                                         fail: function(error) {
                                             utils.hideLoading(); 
                                           
                                             navigator.notification.alert("The signature could not be uploaded.", null, "Signature Upload Failed");
                                         }
                                        
   
                                     });
   
    return {
        init: function (initEvt) {
            // ... init event code ...
           
            $("#signature").jSignature();
        },
 
        beforeShow: function (beforeShowEvt) {
            viewModel.set("selectedRoom", utils.room);
            viewModel.GetCustodian();
        },
 
        show: function (showEvt) {
           
        },
        viewModel: viewModel
        
    }
});