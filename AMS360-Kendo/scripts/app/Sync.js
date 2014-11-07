define(["kendo","app/account","app/data", "app/utils", "app/app"], function (kendo, account, data, utils, app) {
    var viewModel = kendo.observable({
                                         SyncAssetTypeSpecValue: "Asset Type Spec Values",
                                         SyncAssetTypeSpecLink: "Asset Type Link",
                                         SyncAssetTypeSpec: "Asset Type Spec",
                                         SyncSpecValue: "Spec Values",
                                         SyncAsset: "Assets",
                                         SyncClassification: "Classifications",
                                         SyncAssetType: "Asset Types",
                                         SyncRoom: "Rooms",
                                         SyncBuilding: "Buildings",
                                         SyncProject: "Projects",
                                         SyncSite: "Sites",
                                         SyncArea: "Area",
                                         SyncUser: "Users",
                                         SyncConditionHeader: "Condition Assesment Setup",
                                         SyncConditionGroup: "Condition Assesment Group",
                                         SyncConditionCriteria: "Condition Assesment Criteria",
                                         SyncAssetCapture: "Assets",
                                         SyncGISLines: "Ready to sync GIS Lines",
                                         SyncGISPoints: "Ready to sync GIS Points",
                                         SyncGISPolygons: "Ready to sync GIS Polygons",
                                         SyncPhotos: "Ready to sync Photos",
                                         SyncFailPhotos: "",
                                         IncludeAssets: false,
                                         SyncAll:function() {
                                             data.DropTables();
                                             data.CreateTables();
                                            
                                             viewModel.GetUsers();
                                         },
                                         GetUsers: function() {
                                             var URL = utils.ServiceURL + "/GetUsers";
                                             $.ajax({
                                                        url: URL,
                                                        dataType: 'json',
                                                        type: "GET",
                                                        beforeSend: function (xhr) {
                                                            viewModel.set("SyncUser", "Downloading users...");
                                                            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(account.userName + ":" + account.password));  
                                                            xhr.setRequestHeader('X-Auth-Token', account.database); 
                                                        },
                                                        complete: function (xhr) {
                                                            viewModel.GetRooms();
                                                        },
                                                        error: function (xhr, ajaxOptions, thrownError) {
                                                            if (xhr.status == "403" || xhr.status == "401") {
                                                                viewModel.set("SyncUser", "You are not authorised to fetch users");
                                                            } else {
                                                                viewModel.set("SyncUser", "Failed to download users");
                                                            }
                                                        },
                                                        success: function (model) {
                                                            try {
                                                                var result = model.GetUsersResult;
                                                                data.InsertUsers(result);
                                                                viewModel.set("SyncUser", "Successful: Users");
                                                            } catch (e) {
                                                                viewModel.set("SyncUser", "Failed to downloaded users: " + e);
                                                            }
                                                        }
                                                    });
                                         },
                                         GetRooms: function() {
                                             var URL = utils.ServiceURL + "/GetRooms";
                                             $.ajax({
                                                        url: URL,
                                                        dataType: 'json',
                                                        type: "GET",
                                                        beforeSend: function (xhr) {
                                                            viewModel.set("SyncRoom", "Downloading rooms...");
                                                            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(account.userName + ":" + account.password));  
                                                            xhr.setRequestHeader('X-Auth-Token', account.database); 
                                                        },
                                                        complete: function (xhr) {
                                                            viewModel.GetBuildings();
                                                        },
                                                        error: function (xhr, ajaxOptions, thrownError) {
                                                            if (xhr.status == "403" || xhr.status == "401") {
                                                                viewModel.set("SyncRoom", "You are not authorised to fetch rooms");
                                                            } else {
                                                                viewModel.set("SyncRoom", "Failed to download rooms");
                                                            }
                                                        },
                                                        success: function (model) {
                                                            try {
                                                                debugger;
                                                                var result = model.GetRoomsResult;
                                                                data.InsertRooms(result);
                                                                viewModel.set("SyncRoom", "Successful: Rooms");
                                                            } catch (e) {
                                                                viewModel.set("SyncRoom", "Failed to downloaded rooms: " + e);
                                                            }
                                                        }
                                                    });
                                         },
                                         GetBuildings: function() {
                                             var URL = utils.ServiceURL + "/GetBuildings";
                                             $.ajax({
                                                        url: URL,
                                                        dataType: 'json',
                                                        type: "GET",
                                                        beforeSend: function (xhr) {
                                                            viewModel.set("SyncBuilding", "Downloading buildings...");
                                                            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(account.userName + ":" + account.password));  
                                                            xhr.setRequestHeader('X-Auth-Token', account.database); 
                                                        },
                                                        complete: function (xhr) {
                                                            viewModel.GetProjects();
                                                        },
                                                        error: function (xhr, ajaxOptions, thrownError) {
                                                            if (xhr.status == "403" || xhr.status == "401") {
                                                                viewModel.set("SyncBuilding", "You are not authorised to fetch buildings");
                                                            } else {
                                                                viewModel.set("SyncBuilding", "Failed to download buildings");
                                                            }
                                                        },
                                                        success: function (model) {
                                                            try {
                                                                var result = model.GetBuildingsResult;
                                                              
                                                                data.InsertBuildings(result);
                                                                viewModel.set("SyncBuilding", "Successful: Buildings");
                                                            } catch (e) {
                                                                viewModel.set("SyncBuilding", "Failed to downloaded buildings: " + e);
                                                            }
                                                        }
                                                    });
                                         },
                                         GetProjects: function() {
                                             var URL = utils.ServiceURL + "/GetProjects";
                                             $.ajax({
                                                        url: URL,
                                                        dataType: 'json',
                                                        type: "GET",
                                                        beforeSend: function (xhr) {
                                                            viewModel.set("SyncProject", "Downloading projects...");
                                                            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(account.userName + ":" + account.password));  
                                                            xhr.setRequestHeader('X-Auth-Token', account.database); 
                                                        },
                                                        complete: function (xhr) {
                                                            viewModel.GetSites(); 
                                                        },
                                                        error: function (xhr, ajaxOptions, thrownError) {
                                                            if (xhr.status == "403" || xhr.status == "401") {
                                                                viewModel.set("SyncProject", "You are not authorised to fetch projects");
                                                            } else {
                                                                viewModel.set("SyncProject", "Failed to download sites");
                                                            }
                                                        },
                                                        success: function (model) {
                                                            try {
                                                                var result = model.GetProjectsResult;
                                                                data.InsertProjects(result);
                                                                viewModel.set("SyncProject", "Successful: Projects");
                                                            } catch (e) {
                                                                viewModel.set("SyncProject", "Failed to downloaded projects: " + e);
                                                            }
                                                        }
                                                    });
                                         },
                                         GetSites: function() {
                                             var URL = utils.ServiceURL + "/GetSites";
                                             $.ajax({
                                                        url: URL,
                                                        dataType: 'json',
                                                        type: "GET",
                                                        beforeSend: function (xhr) {
                                                            viewModel.set("SyncSite", "Downloading sites...");
                                                            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(account.userName + ":" + account.password));  
                                                            xhr.setRequestHeader('X-Auth-Token', account.database); 
                                                        },
                                                        complete: function (xhr) {
                                                            viewModel.GetConditionHeader(); 
                                                        },
                                                        error: function (xhr, ajaxOptions, thrownError) {
                                                            if (xhr.status == "403" || xhr.status == "401") {
                                                                viewModel.set("SyncSite", "You are not authorised to fetch sites");
                                                            } else {
                                                                viewModel.set("SyncSite", "Failed to download sites");
                                                            }
                                                        },
                                                        success: function (model) {
                                                            try {
                                                                var result = model.GetSitesResult;
                                                                data.InsertSites(result);
                                                                viewModel.set("SyncSite", "Successful: Sites");
                                                            } catch (e) {
                                                                viewModel.set("SyncSite", "Failed to downloaded sites: " + e);
                                                            }
                                                        }
                                                    });
                                         },
                                         GetConditionHeader: function() {
                                             var URL = utils.ServiceURL + "/GetConHeaders";
                                             $.ajax({
                                                        url: URL,
                                                        dataType: 'json',
                                                        type: "GET",
                                                        beforeSend: function (xhr) {
                                                            viewModel.set("SyncConditionHeader", "Downloading assessment...");
                                                            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(account.userName + ":" + account.password));  
                                                            xhr.setRequestHeader('X-Auth-Token', account.database); 
                                                        },
                                                        complete: function (xhr) {
                                                            viewModel.GetConditionGroup(); 
                                                        },
                                                        error: function (xhr, ajaxOptions, thrownError) {
                                                            if (xhr.status == "403" || xhr.status == "401") {
                                                                viewModel.set("SyncConditionHeader", "You are not authorised to fetch condition assessments");
                                                            } else {
                                                                viewModel.set("SyncConditionHeader", "Failed to download conditions");
                                                            }
                                                        },
                                                        success: function (model) {
                                                            try {
                                                                var result = model.GetConHeadersResult;
                                                                data.InsertConHeaders(result);
                                                                viewModel.set("SyncConditionHeader", "Successful: Condition Assesment");
                                                            } catch (e) {
                                                                viewModel.set("SyncConditionHeader", "Failed to downloaded condition assessment: " + e);
                                                            }
                                                        }
                                                    });
                                         },
                                         GetConditionGroup: function() {
                                             var URL = utils.ServiceURL + "/GetConGroups";
                                             $.ajax({
                                                        url: URL,
                                                        dataType: 'json',
                                                        type: "GET",
                                                        beforeSend: function (xhr) {
                                                            viewModel.set("SyncConditionGroup", "Downloading condition groups...");
                                                            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(account.userName + ":" + account.password));  
                                                            xhr.setRequestHeader('X-Auth-Token', account.database); 
                                                        },
                                                        complete: function (xhr) {
                                                            viewModel.GetConditionCriteria(); 
                                                        },
                                                        error: function (xhr, ajaxOptions, thrownError) {
                                                            if (xhr.status == "403" || xhr.status == "401") {
                                                                viewModel.set("SyncConditionGroup", "You are not authorised to fetch condition groups");
                                                            } else {
                                                                viewModel.set("SyncConditionGroup", "Failed to download condition groups");
                                                            }
                                                        },
                                                        success: function (model) {
                                                            try {
                                                                var result = model.GetConGroupsResult;
                                                                data.InsertConGroups(result);
                                                                viewModel.set("SyncConditionGroup", "Successful: Condition Groups");
                                                            } catch (e) {
                                                                viewModel.set("SyncConditionGroup", "Failed to downloaded condition groups: " + e);
                                                            }
                                                        }
                                                    });
                                         },
                                         GetConditionCriteria: function() {
                                             var URL = utils.ServiceURL + "/GetConCriterias";
                                             $.ajax({
                                                        url: URL,
                                                        dataType: 'json',
                                                        type: "GET",
                                                        beforeSend: function (xhr) {
                                                            viewModel.set("SyncConditionCriteria", "Downloading condition criteria...");
                                                            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(account.userName + ":" + account.password));  
                                                            xhr.setRequestHeader('X-Auth-Token', account.database); 
                                                        },
                                                        complete: function (xhr) {
                                                            viewModel.GetHierarchies(); 
                                                        },
                                                        error: function (xhr, ajaxOptions, thrownError) {
                                                            if (xhr.status == "403" || xhr.status == "401") {
                                                                viewModel.set("SyncConditionCriteria", "You are not authorised to fetch condition criteria");
                                                            } else {
                                                                viewModel.set("SyncConditionCriteria", "Failed to download condition criteria");
                                                            }
                                                        },
                                                        success: function (model) {
                                                            try {
                                                                var result = model.GetConCriteriasResult;
                                                                data.InsertConCriterias(result);
                                                                viewModel.set("SyncConditionCriteria", "Successful: Condition Criteria");
                                                            } catch (e) {
                                                                viewModel.set("SyncConditionCriteria", "Failed to downloaded condition criteria: " + e);
                                                            }
                                                        }
                                                    });
                                         },
                                         GetHierarchies: function() {
                                             var URL = utils.ServiceURL + "/GetHierarchies";
                                             $.ajax({
                                                        url: URL,
                                                        dataType: 'json',
                                                        type: "GET",
                                                        beforeSend: function (xhr) {
                                                            viewModel.set("SyncClassification", "Downloading classifications...");
                                                            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(account.userName + ":" + account.password));  
                                                            xhr.setRequestHeader('X-Auth-Token', account.database); 
                                                        },
                                                        complete: function (xhr) {
                                                            viewModel.GetAssetTypes();
                                                        },
                                                        error: function (xhr, ajaxOptions, thrownError) {
                                                            if (xhr.status == "403" || xhr.status == "401") {
                                                                viewModel.set("SyncClassification", "You are not authorised to fetch classifications");
                                                            } else {
                                                                viewModel.set("SyncClassification", "Failed to download classifications");
                                                            }
                                                        },
                                                        success: function (model) {
                                                            try {
                                                                var result = model.GetHierarchiesResult;
                                                                data.InsertHierarchies(result);
                                                                viewModel.set("SyncClassification", "Successful: Classifications");
                                                            } catch (e) {
                                                                viewModel.set("SyncClassification", "Failed to downloaded classifications: " + e);
                                                            }
                                                        }
                                                    });
                                         },
                                         GetAssetTypes: function() {
                                             var URL = utils.ServiceURL + "/GetAssetTypes";
                                             $.ajax({
                                                        url: URL,
                                                        dataType: 'json',
                                                        type: "GET",
                                                        beforeSend: function (xhr) {
                                                            viewModel.set("SyncAssetType", "Downloading asset types...");
                                                            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(account.userName + ":" + account.password));  
                                                            xhr.setRequestHeader('X-Auth-Token', account.database); 
                                                        },
                                                        complete: function (xhr) {
                                                            viewModel.GetAssetTypeSpecLink();
                                                        },
                                                        error: function (xhr, ajaxOptions, thrownError) {
                                                            if (xhr.status == "403" || xhr.status == "401") {
                                                                viewModel.set("SyncAssetType", "You are not authorised to fetch asset types");
                                                            } else {
                                                                viewModel.set("SyncAssetType", "Failed to download asset types");
                                                            }
                                                        },
                                                        success: function (model) {
                                                            try {
                                                                var result = model.GetAssetTypesResult;
                                                                data.InserAssetTypes(result);
                                                                viewModel.set("SyncAssetType", "Successful: Asset types");
                                                            } catch (e) {
                                                                viewModel.set("SyncAssetType", "Failed to downloaded asset types: " + e);
                                                            }
                                                        }
                                                    });
                                         },
                                         GetAssetTypeSpecLink: function() {
                                             var URL = utils.ServiceURL + "/GetAssetTypeSpecLink";
                                             $.ajax({
                                                        url: URL,
                                                        dataType: 'json',
                                                        type: "GET",
                                                        beforeSend: function (xhr) {
                                                            viewModel.set("SyncAssetTypeSpecLink", "Downloading spec links...");
                                                            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(account.userName + ":" + account.password));  
                                                            xhr.setRequestHeader('X-Auth-Token', account.database); 
                                                        },
                                                        complete: function (xhr) {
                                                            viewModel.GetAssetTypeSpecValues();
                                                        },
                                                        error: function (xhr, ajaxOptions, thrownError) {
                                                            if (xhr.status == "403" || xhr.status == "401") {
                                                                viewModel.set("SyncAssetTypeSpecLink", "You are not authorised to fetch spec links");
                                                            } else {
                                                                viewModel.set("SyncAssetTypeSpecLink", "Failed to download spec links");
                                                            }
                                                        },
                                                        success: function (model) {
                                                            try {
                                                                var result = model.GetAssetTypeSpecLinkResult;
                                                                data.InsertAssetTypeLink(result);
                                                                viewModel.set("SyncAssetTypeSpecLink", "Successful: Spec links");
                                                            } catch (e) {
                                                                viewModel.set("SyncAssetTypeSpecLink", "Failed to downloaded spec links: " + e);
                                                            }
                                                        }
                                                    });
                                         },
                                         GetAssetTypeSpecValues: function() {
                                             var URL = utils.ServiceURL + "/GetAssetTypeSpecValue";
                                             $.ajax({
                                                        url: URL,
                                                        dataType: 'json',
                                                        type: "GET",
                                                        beforeSend: function (xhr) {
                                                            viewModel.set("SyncAssetTypeSpecValue", "Downloading spec values...");
                                                            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(account.userName + ":" + account.password));  
                                                            xhr.setRequestHeader('X-Auth-Token', account.database); 
                                                        },
                                                        complete: function (xhr) {
                                                            viewModel.GetAssetTypeSpecs();
                                                        },
                                                        error: function (xhr, ajaxOptions, thrownError) {
                                                            if (xhr.status == "403" || xhr.status == "401") {
                                                                viewModel.set("SyncAssetTypeSpecValue", "You are not authorised to fetch spec values");
                                                            } else {
                                                                viewModel.set("SyncAssetTypeSpecValue", "Failed to download spec values");
                                                            }
                                                        },
                                                        success: function (model) {
                                                            try {
                                                                var result = model.GetAssetTypeSpecValueResult;
                                                                data.InsertAscSpecValue(result);
                                                                viewModel.set("SyncAssetTypeSpecValue", "Successful: Spec values");
                                                            } catch (e) {
                                                                viewModel.set("SyncAssetTypeSpecValue", "Failed to downloaded spec values: " + e);
                                                            }
                                                        }
                                                    });
                                         },
                                        
                                         GetAssetTypeSpecs: function() {
                                             var URL = utils.ServiceURL + "/GetAssetTypeSpec";
                                             $.ajax({
                                                        url: URL,
                                                        dataType: 'json',
                                                        type: "GET",
                                                        beforeSend: function (xhr) {
                                                            viewModel.set("SyncAssetTypeSpec", "Downloading specs...");
                                                            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(account.userName + ":" + account.password));  
                                                            xhr.setRequestHeader('X-Auth-Token', account.database); 
                                                        },
                                                        complete: function (xhr) {
                                                            viewModel.GetSpecValues();
                                                        },
                                                        error: function (xhr, ajaxOptions, thrownError) {
                                                            if (xhr.status == "403" || xhr.status == "401") {
                                                                viewModel.set("SyncAssetTypeSpec", "You are not authorised to fetch specs");
                                                            } else {
                                                                viewModel.set("SyncAssetTypeSpec", "Failed to download specs");
                                                            }
                                                        },
                                                        success: function (model) {
                                                            try {
                                                                var result = model.GetAssetTypeSpecResult;
                                                                data.InsertAssetTypeSpec(result);
                                                                viewModel.set("SyncAssetTypeSpec", "Successful: Specs");
                                                            } catch (e) {
                                                                viewModel.set("SyncAssetTypeSpec", "Failed to downloaded specs: " + e);
                                                            }
                                                        }
                                                    });
                                         },
                                         GetSpecValues: function () {
                                             var URL = utils.ServiceURL + "/GetSpecValues";
                                             $.ajax({
                                                        url: URL,
                                                        dataType: 'json',
                                                        type: "GET",
                                                        beforeSend: function (xhr) {
                                                            viewModel.set("SyncSpecValue", "Downloading spec values...");
                                                            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(account.userName + ":" + account.password));  
                                                            xhr.setRequestHeader('X-Auth-Token', account.database); 
                                                        },
                                                        complete: function (xhr) {
                                                            if (viewModel.IncludeAssets) {
                                                                viewModel.GetAssets();
                                                            }
                                                        },
                                                        error: function (xhr, ajaxOptions, thrownError) {
                                                            if (xhr.status == "403" || xhr.status == "401") {
                                                                viewModel.set("SyncSpecValue", "You are not authorised to fetch spec values");
                                                            } else {
                                                                viewModel.set("SyncSpecValue", "Failed to download spec values");
                                                            }
                                                        },
                                                        success: function (model) {
                                                            try {
                                                                var result = model.GetSpecValuesResult;
                                                                data.InsertSpecValues(result);
                                                                viewModel.set("SyncSpecValue", "Successful: Spec values");
                                                            } catch (e) {
                                                                viewModel.set("SyncSpecValue", "Failed to downloaded spec values: " + e);
                                                            }
                                                        }
                                                    });
                                         },
                                         GetProjectForAssets: function() {
                                             $("#SyncProjectPage").show().data().kendoMobileModalView.open();
                                             var callback = function(tx, result) {
                                                 var htmlSelect = "";
              
                                                 if (result != null && result.rows != null) {
                                                     for (var i = 0; i < result.rows.length; i++) {
                                                         var row = result.rows.item(i);
                                                      
                                                         htmlSelect += "<li><a onclick=app.views.sync.viewModel.GetAssets('" + row.ID + "') class='km-listview-link' data-role='listview-link'>" + row.Name + "</a></li>";
                                                     }
                                                     $("#ProjectSyncList").html(htmlSelect);
                                                 }
                                             }
                                             data.GetProjects(callback); 
                                         },
                                         GetAssets:function(ProjectID) {
                                             $("#SyncProjectPage").data().kendoMobileModalView.close();
                                             var URL = utils.ServiceURL + "/GetAssets";
                                             $.ajax({
                                                        url: URL,
                                                        dataType: 'json',
                                                        type: "GET",
                                                        beforeSend: function (xhr) {
                                                            viewModel.set("SyncAsset", "Downloading assets...");
                                                            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(account.userName + ":" + account.password));  
                                                            xhr.setRequestHeader('X-Auth-Token', account.database); 
                                                        },
                                                        complete: function (xhr) {
                                                            utils.hideLoading();
                                                        },
                                                        error: function (xhr, ajaxOptions, thrownError) {
                                                            if (xhr.status == "403" || xhr.status == "401") {
                                                                viewModel.set("SyncAsset", "You are not authorised to fetch assets");
                                                            } else {
                                                                viewModel.set("SyncAsset", "Failed to download assets");
                                                            }
                                                        },
                                                        success: function (model) {
                                                            try {
                                                                var result = model.GetAssetsResult;
                                                                data.InsertAssets(result);
                                                                viewModel.set("SyncAsset", "Successful: Assets");
                                                            } catch (e) {
                                                                viewModel.set("SyncAsset", "Failed to downloaded assets: " + e);
                                                            }
                                                        }
                                                    });
                                         },
                                         GetInfraAreas: function() {
                                             $.ajax(utils.ServiceURL + "/GetInfraAreas", {
                                                        beforeSend: function (xhr) {
                                                            viewModel.set("SyncArea", "Busy downloading areas...");
                                                        },
                                                        complete: function () {
                                                        },
                                                        contentType: 'application/json',
                                                        dataType: 'jsonp',
                                                        jsonp: 'callback',
                                                        type: 'GET',
                                                        error: function (xhr, status, text) {
                                                            viewModel.set("SyncArea", "Failed to downloaded areas: ");
                                                        },
                                                        success: function (dataResult) {
                                                            try {
                                                                var result = dataResult.GetInfraAreasResult;
                                                                data.InsertInfrAreas(result);
                                                                viewModel.set("SyncArea", "Successfully downloaded areas");
                                                            } catch (e) {
                                                                viewModel.set("SyncArea", "Failed to downloaded areas: " + e);
                                                            }
                                                        }
                                                    });
                                         },
                                        
                                         PostAssets: function() {
                                             var callback = function(tx, result) {
                                                 if (result != null && result.rows != null) {
                                                     if (result.rows.length == 0) {
                                                         viewModel.UploadPhotos();
                                                         viewModel.set("SyncAssetCapture", "Success: No assets were found on the mobile device to sync");
                                                     } else {
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
                                      
                                                                         CS.push({ AssetBarCode: result.rows.item(i).AssetBarCode, Photo: result.rows.item(i).Photo, GroupingName: result.rows.item(i).GroupingName, OldBarCode: result.rows.item(i).OldBarCode, Description: result.rows.item(i).Description, AssetHierarchyID: result.rows.item(i).AssetHierarchyID, AssetTypeID: result.rows.item(i).AssetTypeID, Condition: result.rows.item(i).Condition, Specs: SpecList });
                                        
                                                                         if (result.rows.length - 1 == i) {
                                                                             console.log(JSON.stringify(CS));
                                                                             $.ajax({
                                                                                        url: utils.ServiceURL + '/PostCaptureAssets',
                                                                                        type: 'POST',
                                                                                        data: JSON.stringify(CS),
                                                                                        dataType: 'json',
                                                                                        contentType: "application/json; charset=utf-8",
                                                                                        success: function (res) {
                                                                                            if (res) {
                                                                                                viewModel.set("SyncAssetCapture", "Successfully send assets");
                                                                                                data.ReCreateAssetCapture();
                                                                                                viewModel.UploadPhotos();
                                                                                            } else {
                                                                                                viewModel.set("SyncAssetCapture", "Failed to send Assets");
                                                                                                viewModel.set("SyncPhotos", "The assets failed. Not Photos were synced");
                                                                                            }
                                                                                        },
                                                                                        error: function (res) {
                                                                                            viewModel.set("SyncAssetCapture", "Failed to send Assets2");
                                                                                            viewModel.set("SyncPhotos", "The assets failed. Not Photos were synced");
                                                                                        }
                                                                                    });
                                                                         }
                                                                     }
                                                                 }
                                                             })(i)
                           
                                                             data.GetSpecCapture(callback2, result.rows.item(i).AssetBarCode, result.rows.item(i).ProjectID);
                                                         }
                                                     }
                                                 }
                                             }
                                             data.GetAssetCapture(callback);
                                         },
                                         PostGIS: function() {
                                             //Do the Lines
                                             if (utils.mFeatureLine == null) {
                                                 viewModel.set("SyncGISLines", "Success: No GIS line data to send");
                                             } else {
                                                 var CS = [];
                                                 CS.push({ GeoData: JSON.stringify(utils.mFeatureLine), GeoType: "Line", AreaCode: utils.area, GroupingName: utils.grouping });

                                                 $.ajax({
                                                            url: utils.ServiceURL + '/PostCaptureGIS',
                                                            type: 'POST',
                                                            data: JSON.stringify(CS),
                                                            dataType: 'json',
                                                            contentType: "application/json; charset=utf-8",
                                                            success: function (res) {
                                                                if (res) {
                                                                    viewModel.set("SyncGISLines", "Successfully send GIS Lines");

                                                                    utils.mFeatureLine = null;
                                                                } else {
                                                                    viewModel.set("SyncGISLines", "Failed to send GIS Lines");
                                                                }
                                                            },
                                                            error: function (res) {
                                                                viewModel.set("SyncGISLines", "Failed to send GIS Lines");
                                                            }
                                                        });
                                             } 
           
                                             //Do the Points
            
                                             if (utils.mFeaturePoint == null) {
                                                 viewModel.set("SyncGISPoints", "Success: No GIS point data to send");
                                             } else {
                                                 var CS = [];
                                                 CS.push({ GeoData: JSON.stringify(utils.mFeaturePoint), GeoType: "Point", AreaCode: utils.area, GroupingName: utils.grouping });

                                                 $.ajax({
                                                            url: utils.ServiceURL + '/PostCaptureGIS',
                                                            type: 'POST',
                                                            data: JSON.stringify(CS),
                                                            dataType: 'json',
                                                            contentType: "application/json; charset=utf-8",
                                                            success: function (res) {
                                                                if (res) {
                                                                    viewModel.set("SyncGISPoints", "Successfully send GIS Points");
                               
                                                                    utils.mFeaturePoint = null;
                                                                } else {
                                                                    viewModel.set("SyncGISPoints", "Failed to send GIS Points");
                                                                }
                                                            },
                                                            error: function (res) {
                                                                $("#SyncGISPoints").html("Failed to send GIS Points");
                                                            }
                                                        });
                                             }

                                             //Do the Polygons
          
                                             if (utils.mFeaturePolygon == null) {
                                                 viewModel.set("SyncGISPolygons", "Success: No GIS polygon data to send");
                                             } else {
                                                 var CS = [];
                                                 CS.push({ GeoData: JSON.stringify(utils.mFeaturePolygon), GeoType: "Polygon", AreaCode: utils.area, GroupingName: utils.grouping });

                                                 $.ajax({
                                                            url: utils.ServiceURL + '/PostCaptureGIS',
                                                            type: 'POST',
                                                            data: JSON.stringify(CS),
                                                            dataType: 'json',
                                                            contentType: "application/json; charset=utf-8",
                                                            success: function (res) {
                                                                if (res) {
                                                                    viewModel.set("SyncGISPolygons", "Successfully send GIS Polygons");

                                                                    utils.mFeaturePolygon = null;
                                                                } else {
                                                                    viewModel.set("SyncGISPolygons", "Failed to send GIS Polygons");
                                                                }
                                                            },
                                                            error: function (res) {
                                                                viewModel.set("SyncGISPolygons", "Failed to send GIS Polygons");
                                                            }
                                                        });
                                             }
                                         },
                                         UploadPhotos: function() {
                                             var IsSuccess = true;
                                             var photoCallback = function(tx, Photoresult) {
                                                 if (Photoresult != null && Photoresult.rows != null) {
                                                     if (Photoresult.rows.length == 0) {
                                                         viewModel.set("SyncPhotos", "Success: No photos were found on the mobile device to sync");
                                                     } else {
                                                         for (var i = 0; i < Photoresult.rows.length; i++) {
                                                             var options = new FileUploadOptions(); 

                                                             options.chunkedMode = false;

                                                             options.fileKey = Photoresult.rows.item(i).AssetBarCode; 

                                                             var imagefilename = Photoresult.rows.item(i).AssetBarCode; 

                                                             options.fileName = imagefilename;
                                                             options.mimeType = "image/jpeg"; 
                                                             var ft = new FileTransfer(); 

                                                             ft.upload(Photoresult.rows.item(i).Path, utils.ServiceURL + "/SaveImage", viewModel.win, viewModel.fail, options);
                                                             //function(r) {//Success
                                                             /*   console.log(r);
                                                             //if (Photoresult.rows.length - 1 == i) {
                                                             //    if (IsSuccess) {
                                                             //        viewModel.set("SyncPhotos", "Successfully uploaded photos");
                                                             //        data.ClearPhotoTable();
                                                             //    }
                                                             //    else {
                                                             //        viewModel.set("SyncPhotos", "Failed to upload photos");
                                                             //        viewModel.set("SyncFailPhotos", "Some Photos did not sync. However all photos are still on the device.");
                                                             //    } 
                                                             //}
                                                             }, function(error) {//Fail
                                                             console.log(error);
                                                             //if (Photoresult.rows.length - 1 == i) {
                                                             //    viewModel.set("SyncPhotos", "Failed to upload photos - Fail");
                                                             //    viewModel.set("SyncFailPhotos", "Some Photos did not sync. However all photos are still on the device.");
                                                             //}
                                                             //IsSuccess = false;
                                                             }, options);*/
                                                         }
                                                     }
                                                 }
                                             }
                                             data.GetPhotos(photoCallback);
                                         },
                                         win: function(r) {
                                             viewModel.set("SyncPhotos", "Successfully uploaded photos");
                                             data.ClearPhotoTable();
                                         },
                                         fail: function(error) {
                                             viewModel.set("SyncFailPhotos", "Some Photos did not sync. However all photos are still on the device.");
                                         }

          
        
                                     });

    return {
        init: function (initEvt) {
            // ... init event code ...
        },
 
        beforeShow: function (beforeShowEvt) {
            // ... before show event code ...
            viewModel.set("SyncAssetTypeSpecValue", "Asset Type Spec Values"); 
            viewModel.set("SyncAssetTypeSpecLink", "Asset Type Link"); 
            viewModel.set("SyncAssetTypeSpec", "Asset Type Spec"); 
            viewModel.set("SyncSpecValue", "Spec Values"); 
            viewModel.set("SyncAsset", "Assets"); 
            viewModel.set("SyncClassification", "Classifications"); 
            viewModel.set("SyncAssetType", "Asset Types"); 
            viewModel.set("SyncRoom", "Rooms"); 
            viewModel.set("SyncBuilding", "Buildings"); 
            viewModel.set("SyncProject", "Projects"); 
            viewModel.set("SyncSite", "Sites"); 
            viewModel.set("SyncArea", "Area"); 
            viewModel.set("SyncUser", "Users"); 
            viewModel.set("SyncAssetCapture", "Assets"); 
            viewModel.set("SyncGISLines", "Ready to sync GIS Lines"); 
            viewModel.set("SyncGISPoints", "Ready to sync GIS Points"); 
            viewModel.set("SyncGISPolygons", "Ready to sync GIS Polygons"); 
            viewModel.set("SyncPhotos", "Ready to sync Photos"); 
            viewModel.set("SyncFailPhotos", ""); 
            viewModel.set("IncludeAssets", false); 
        },
 
        show: function (showEvt) {
            // ... show event code ...
        },
        viewModel: viewModel
    }
});