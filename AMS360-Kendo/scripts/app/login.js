define(["kendo", "app/account","app/data", "app/utils"], function (kendo, account, data, utils) {
    var viewModel = kendo.observable({
                                         isBusy: true,
                                         userName: account.userName,
                                         errorMessage: "",
                                         loginUsername: "Hannes",
                                         loginPassword: "",
                                         selectedDatabase: "",
                                         databaseList: [],
                                         login: function (clickEvt) {
                                             var userName = viewModel.loginUsername;
                                             var password = viewModel.loginPassword;
                                             var db = $("#DatabaseSelect").val();
                                             if (db == null) {
                                                 utils.showError("Please choose a database");
                                             }
                                             else {
                                                 utils.showLoading("Logging In...");
                                                 $.support.cors = true;
                                             
                                                 var URL = utils.ServiceURL + "/Login";
                                                 try {
                                                     $.ajax({
                                                                url: URL,
                                                                dataType: 'json',
                                                                type: "GET",
                                                                beforeSend: function (xhr) {
                                                                    utils.showLoading("Logging in");
                                                                    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(userName + ":" + password));  
                                                                    xhr.setRequestHeader('X-Auth-Token', db);  
                                                                },
                                                                complete: function (xhr) {
                                                                    utils.hideLoading();
                                                                },
                                                                error: function (xhr, ajaxOptions, thrownError) {
                                                                    if (xhr.status == "403" || xhr.status == "401")
                                                                        utils.showError("Login was unsuccessful");
                                                                },
                                                                success: function (model) {
                                                                    account.userName = userName;
                                                                    account.password = password;
                                                                    account.database = db;
                                                                    utils.navigate("#TheView");
                                                                }
                                                            });
                                                 }
                                                 catch (ex) {
                                                     utils.showError("User could not be logged in");
                                                     utils.hideLoading();
                                                 }
                                             }
                                         },
                                         logout: function (clickEvt) {
                                             viewModel.set("userName", "");
                                             account.isAuthenticated = false;
                                             account.userName = null;
                                             account.password = null;
                                             account.database = null;
                                             utils.navigate("#LoginView");
                                         },
      
                                         
                                         GetDatabases:function(e) {
                                             $.support.cors = true;
                                             
                                             var URL = utils.ServiceURL + "/Databases";
                                             try {
                                                 $.ajax({
                                                            url: URL,
                                                            dataType: 'json',
                                                            type: "GET",
                                                            beforeSend: function (xhr) {
                                                                utils.showLoading("Connecting to Host");
                                                                xhr.setRequestHeader('Authorization', 'Basic ' + btoa("AMS360:AmS36o@iPin"));  
                                                                xhr.setRequestHeader('X-Auth-Token', "Nothing");  
                                                            },
                                                            complete: function (xhr) {
                                                                utils.hideLoading();
                                                            },
                                                            error: function (xhr, ajaxOptions, thrownError) {
                                                                if (xhr.status == "403" || xhr.status == "401")
                                                                    utils.showError("You are not authorised to fetch databases");
                                                            },
                                                            success: function (model) {
                                                                viewModel.databaseList = model.GetDatabasesResult;
                                                                kendo.bind($("#LoginView"), viewModel);  
                                                            }
                                                        });
                                             }
                                             catch (ex) {
                                                 utils.showError("An error occurred: " + ex);
                                             }
                                         }
                                     });
    return {
        init: function (initEvt) {
            // ... init event code ...
            viewModel.GetDatabases();
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