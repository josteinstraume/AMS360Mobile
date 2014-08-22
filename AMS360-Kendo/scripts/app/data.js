define(["app/utils"], function (utils) {
    var db;
    var nullHandler = function() {
    }
    var errorHandler = function(tx, error) {
        debugger;
        utils.showError("An error occurred in SQL Transaction:" + error.message);
        console.log(error);
    }
    return {
        errorHandler: errorHandler,
        nullHandler: nullHandler,
        CreateDB: function() {
            if (window.sqlitePlugin !== undefined) {
                db = window.sqlitePlugin.openDatabase("AMS360");
            }
            else {
                // For debugin in simulator fallback to native SQL Lite
                db = window.openDatabase("AMS360", "1.0", "AMS360", 200000);
            }
        },
        CreateTables: function() {
            db.transaction(function (tx) {
                tx.executeSql('DROP TABLE IF EXISTS AlsCondition', [], nullHandler, this.errorHandler);

                tx.executeSql('CREATE TABLE IF NOT EXISTS AMSUser(Username TEXT NOT NULL PRIMARY KEY, EmployeeName TEXT NOT NULL,Password TEXT NOT NULL, Surname TEXT NOT NULL)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS AlsSite(SiteID TEXT NOT NULL PRIMARY KEY, SiteDescription TEXT NOT NULL, LatExt REAL, LongExt REAL, ZoomLevel INTEGER)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS AlsInfraArea(AreaCode TEXT NOT NULL PRIMARY KEY, Description TEXT NOT NULL, LatExt REAL, LongExt REAL, Zoom INTEGER)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS AlsBuilding(BuildingCode TEXT NOT NULL PRIMARY KEY, BuildingDescription TEXT NOT NULL, SiteID TEXT NOT NULL)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS AlsRoom(RoomCode TEXT NOT NULL PRIMARY KEY, RoomDescription TEXT NOT NULL, BuildingCode TEXT NOT NULL)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS CseAssetType(TypeCode TEXT NOT NULL PRIMARY KEY, TypeDescription TEXT NOT NULL, HierarchyID INTEGER, GroupingID TEXT)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS CseAssetHierarchy(ID INTEGER NOT NULL PRIMARY KEY, Description TEXT NOT NULL, ParentID INTEGER)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS AscAssetCaptureOld(AssetBarCode TEXT NOT NULL PRIMARY KEY, GroupingName TEXT, OldBarCode TEXT, Description TEXT, AssetHierarchyID INTEGER, AssetTypeID TEXT, CustodianName TEXT, Condition TEXT, Make TEXT, Model TEXT, RegistrationNumber TEXT, SerialNumber TEXT, QTY INTEGER, Username TEXT, RoomCode TEXT, TitleDeedNumber TEXT, AssetID INTEGER, ParentBarCode TEXT )', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS AscAssetCapture(AssetBarCode TEXT NOT NULL PRIMARY KEY, GroupingName TEXT, OldBarCode TEXT, Description TEXT, AssetHierarchyID INTEGER, AssetTypeID TEXT, CustodianName TEXT, Condition TEXT, Make TEXT, Model TEXT, RegistrationNumber TEXT, SerialNumber TEXT, QTY INTEGER, Username TEXT, RoomCode TEXT, TitleDeedNumber TEXT, AssetID INTEGER, ParentBarCode TEXT, Photo BLOB )', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS AscSpecValue(ID INTEGER NOT NULL PRIMARY KEY, Description TEXT NOT NULL, SpecValue TEXT, SpecID INTEGER, SpecValueID INTEGER, AssetCode TEXT, IsCompulsory INTEGER)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS AscSpecValueCapture(Description TEXT NOT NULL, SpecValue TEXT, SpecID INTEGER, SpecValueID INTEGER, AssetCode TEXT, IsCompulsory INTEGER)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS CseAssetTypeSpec(ID INTEGER NOT NULL PRIMARY KEY, Description TEXT NOT NULL)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS CseAssetTypeSpecLink(ID INTEGER NOT NULL PRIMARY KEY, IsCompulsory INTEGER, SpecID INTEGER, TypeCode TEXT)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS CseAssetTypeSpecValue(ID INTEGER NOT NULL PRIMARY KEY, Description TEXT, SpecID INTEGER)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS AlsCondition(Description TEXT)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS Photo(AssetBarCode TEXT, Path TEXT)', [], nullHandler, this.errorHandler);
            });

            db.transaction(function (transaction) {
                var sqlString = 'INSERT INTO AlsCondition(Description) Select "GOOD" as Description UNION Select "FAIR" UNION Select "NEW" UNION Select "POOR" UNION Select "VERY POOR"';
                transaction.executeSql(sqlString, [], function (transaction, res) {
                    $("#AssetTypeDownload").html(res.insertId);
                }, function (e) {
                });
            });
        },
        CheckData: function(callBack) {
            db.transaction(function (transaction) {
                transaction.executeSql('SELECT * FROM AMSUser', [], callBack, this.errorHandler);
            });
        },
        CheckAssetCapture: function(callBack) {
            db.transaction(function (transaction) {
                transaction.executeSql('SELECT * FROM AscAssetCapture', [], callBack, this.errorHandler);
            });
        },
        DropTables: function() {
            db.transaction(function (tx) {
                tx.executeSql('DROP TABLE IF EXISTS AMSUser', [], nullHandler, this.errorHandler);
                tx.executeSql('DROP TABLE IF EXISTS AlsSite', [], nullHandler, this.errorHandler);
                tx.executeSql('DROP TABLE IF EXISTS AlsInfraArea', [], nullHandler, this.errorHandler);
                tx.executeSql('DROP TABLE IF EXISTS AlsBuilding', [], nullHandler, this.errorHandler);
                tx.executeSql('DROP TABLE IF EXISTS AlsRoom', [], nullHandler, this.errorHandler);
                tx.executeSql('DROP TABLE IF EXISTS CseAssetType', [], nullHandler, this.errorHandler);
                tx.executeSql('DROP TABLE IF EXISTS CseAssetHierarchy', [], nullHandler, this.errorHandler);
                tx.executeSql('DROP TABLE IF EXISTS AscAssetCaptureOld', [], nullHandler, this.errorHandler);
                tx.executeSql('DROP TABLE IF EXISTS AscSpecValue', [], nullHandler, this.errorHandler);
                tx.executeSql('DROP TABLE IF EXISTS CseAssetTypeSpec', [], nullHandler, this.errorHandler);
                tx.executeSql('DROP TABLE IF EXISTS CseAssetTypeSpecLink', [], nullHandler, this.errorHandler);
                tx.executeSql('DROP TABLE IF EXISTS CseAssetTypeSpecValue', [], nullHandler, this.errorHandler);
            });
        },
        Login: function (username, password, callBack) {
            db.transaction(function (transaction) {
                transaction.executeSql('Select Username, Password from AMSUser where UPPER(Username) = ?', [username.toUpperCase()], callBack, this.errorHandler);
            });
        },
        ClearPhotoTable: function() {
            db.transaction(function (transaction) {
                transaction.executeSql('DROP TABLE IF EXISTS Photo', [], nullHandler, this.errorHandler);
                transaction.executeSql('CREATE TABLE IF NOT EXISTS Photo(AssetBarCode TEXT, Path TEXT)', [], nullHandler, this.errorHandler);
            });
        },
        InsertAscSpecValue:function(result) {
            var counter = 0;
            var sqlString = "INSERT INTO CseAssetTypeSpecValue(ID, Description, SpecID)";

            $.each(result, function (index, output) {
                if (counter == 0) {
                    sqlString += " SELECT " + output.ID + " as 'ID', '" + output.Description + "' as 'Description', " + output.SpecID + " as 'SpecID'";
                }
                else {
                    sqlString += " UNION SELECT " + output.ID + ", '" + output.Description + "', " + output.SpecID;
                }

                if (counter == 499) {
                    db.transaction(function (transaction) {
                        transaction.executeSql(sqlString, [], function (transaction, res) {
                        }, function (e) {
                            utils.showError("Error syncing Asset Type Spec Value", e);
                        });
                    });
                    counter = 0;
                    sqlString = "INSERT INTO CseAssetTypeSpecValue(ID, Description, SpecID)";
                }
                else {
                    counter++;
                }
            });
            //Insert into table
            if (counter > 0) {
                db.transaction(function (transaction) {
                    transaction.executeSql(sqlString, [], function (transaction, res) {
                    }, function (e) {
                        utils.showError("Error syncing Asset Type Spec Value", e);
                    });
                });
            }
        },
        InsertAssetTypeLink:function(result) {
            var counter = 0;
            var sqlString = "INSERT INTO CseAssetTypeSpecLink(ID , IsCompulsory , SpecID , TypeCode)";

            $.each(result, function (index, output) {
                if (counter == 0) {
                    sqlString += " SELECT " + output.ID + " as 'ID', " + output.IsCompulsory + " as 'IsCompulsory', " + output.SpecID + " as 'SpecID', '" + output.TypeCode + "' as 'TypeCode'";
                }
                else {
                    sqlString += " UNION SELECT " + output.ID + ", " + output.IsCompulsory + ", " + output.SpecID + ", '" + output.TypeCode + "'";
                }

                if (counter == 499) {
                    db.transaction(function (transaction) {
                        transaction.executeSql(sqlString, [], function (transaction, res) {
                        }, function (e) {
                            utils.showError("Error syncing Asset Type Link", e);
                        });
                    });
                    counter = 0;
                    sqlString = "INSERT INTO CseAssetTypeSpecLink(ID , IsCompulsory , SpecID , TypeCode)";
                }
                else {
                    counter++;
                }
            });
            //Insert into table
            if (counter > 0) {
                db.transaction(function (transaction) {
                    transaction.executeSql(sqlString, [], function (transaction, res) {
                    }, function (e) {
                        utils.showError("Error syncing Asset Type Link", e);
                    });
                });
            }
        },
        InsertAssetTypeSpec: function(result) {
            var counter = 0;
            var sqlString = "INSERT INTO CseAssetTypeSpec(ID, Description)";

            $.each(result, function (index, output) {
                if (counter == 0) {
                    sqlString += " SELECT " + output.ID + " as 'ID', '" + output.Description + "' as 'Description'";
                }
                else {
                    sqlString += " UNION SELECT " + output.ID + ", '" + output.Description + "'";
                }

                if (counter == 499) {
                    db.transaction(function (transaction) {
                        transaction.executeSql(sqlString, [], function (transaction, res) {
                        }, function (e) {
                            utils.showError("Error syncing Asset Type Spec", e);
                        });
                    });
                    counter = 0;
                    sqlString = "INSERT INTO CseAssetTypeSpec(ID, Description)";
                }
                else {
                    counter++;
                }
            });
            //Insert into table
            if (counter > 0) {
                db.transaction(function (transaction) {
                    transaction.executeSql(sqlString, [], function (transaction, res) {
                    }, function (e) {
                        utils.showError("Error syncing Asset Type Spec", e);
                    });
                });
            }
        },
        InsertSpecValues: function(result) {
            var counter = 0;
            var sqlString = "INSERT INTO AscSpecValue(ID, Description, SpecValue, SpecID, SpecValueID, AssetCode, IsCompulsory)";

            $.each(result, function (index, output) {
                if (counter == 0) {
                    sqlString += " SELECT " + output.ID + " as 'ID', '" + output.Description + "' as 'Description', '" + output.SpecValue + "' as 'SpecValue', " + output.SpecID + " as 'SpecID', " + output.SpecValueID + " as 'SpecValueID', '" + output.AssetCode + "' as 'AssetCode', " + output.IsCompulsory + " as 'IsCompulsory'";
                }
                else {
                    sqlString += " UNION SELECT " + output.ID + ", '" + output.Description + "', '" + output.SpecValue + "', " + output.SpecID + ", " + output.SpecValueID + ", '" + output.AssetCode + "', " + output.IsCompulsory;
                }

                if (counter == 499) {
                    db.transaction(function (transaction) {
                        transaction.executeSql(sqlString, [], function (transaction, res) {
                        }, function (e) {
                            utils.showError("Error syncing spec values", e);
                        });
                    });
                    counter = 0;
                    sqlString = "INSERT INTO AscSpecValue(ID, Description, SpecValue, SpecID, SpecValueID, AssetCode, IsCompulsory)";
                }
                else {
                    counter++;
                }
            });
            //Insert into table
            if (counter > 0) {
                db.transaction(function (transaction) {
                    transaction.executeSql(sqlString, [], function (transaction, res) {
                    }, function (e) {
                        utils.showError("Error syncing spec values", e);
                    });
                });
            }
        },
        InsertAssets: function(result) {
            var counter = 0;
            var sqlString = "INSERT INTO AscAssetCaptureOld(AssetBarCode, GroupingName, OldBarCode, Description, AssetHierarchyID, AssetTypeID, CustodianName, Condition, Make, Model, RegistrationNumber, SerialNumber, QTY, Username, RoomCode, TitleDeedNumber, AssetID, ParentBarCode)";

            $.each(result, function (index, output) {
                if (counter == 0) {
                    sqlString += " SELECT '" + output.AssetBarCode + "' as 'AssetBarCode', '" + output.GroupingName + "' as 'GroupingName', '" + output.OldBarCode + "' as 'OldBarCode', '" + output.Description + "' as 'Description', " + output.AssetHierarchyID + " as 'AssetHierarchID', '" + output.AssetTypeID + "' as 'AssetTypeID', '" + output.CustodianName + "' as 'CustodianName', '" + output.Condition + "' as 'Condition', '" + output.Make + "' as 'Make', '" + output.Model + "' as 'Model', '" + output.RegistrationNumber + "' as 'RegistrationNumber', '" + output.SerialNumber + "' as 'SerialNumber', " + output.Qty + " as 'QTY', '" + output.Username + "' as 'Username', '" + output.RoomCode + "' as 'RoomCode', '" + output.TitleDeedNo + "' as 'TitleDeedNumber', " + output.AssetID + " as 'AssetID', '" + output.ParentBarCode + "' as 'ParentBarCode'";
                }
                else {
                    sqlString += " UNION SELECT '" + output.AssetBarCode + "', '" + output.GroupingName + "', '" + output.OldBarCode + "', '" + output.Description + "', " + output.AssetHierarchyID + ", '" + output.AssetTypeID + "', '" + output.CustodianName + "', '" + output.Condition + "', '" + output.Make + "', '" + output.Model + "', '" + output.RegistrationNumber + "', '" + output.SerialNumber + "', " + output.Qty + ", '" + output.Username + "', '" + output.RoomCode + "', '" + output.TitleDeedNo + "', " + output.AssetID + ", '" + output.ParentBarCode + "'";
                }

                if (counter == 499) {
                    db.transaction(function (transaction) {
                        transaction.executeSql(sqlString, [], function (transaction, res) {
                        }, function (e) {
                            utils.showError("Error syncing assets", e);
                        });
                    });
                    counter = 0;
                    sqlString = "INSERT INTO AscAssetCaptureOld(AssetBarCode, GroupingName, OldBarCode, Description, AssetHierarchyID, AssetTypeID, CustodianName, Condition, Make, Model, RegistrationNumber, SerialNumber, QTY, Username, RoomCode, TitleDeedNumber, AssetID, ParentBarCode)";
                }
                else {
                    counter++;
                }
            });
            //Insert into table
            if (counter > 0) {
                db.transaction(function (transaction) {
                    transaction.executeSql(sqlString, [], function (transaction, res) {
                    }, function (e) {
                        utils.showError("Error syncing assets", e);
                    });
                });
            }
        },
        InsertHierarchies: function(result) {
            var counter = 0;
            var sqlString = "INSERT INTO CseAssethierarchy(ID, Description, ParentID)";

            $.each(result, function (index, output) {
                if (counter == 0) {
                    sqlString += " SELECT " + output.HierarchyID + " as 'ID', '" + output.Description + "' as 'Description', " + output.ParentID + " as 'ParentID'";
                }
                else {
                    sqlString += " UNION SELECT " + output.HierarchyID + ", '" + output.Description + "', " + output.ParentID;
                }

                if (counter == 499) {
                    db.transaction(function (transaction) {
                        transaction.executeSql(sqlString, [], function (transaction, res) {
                            $("#AssetTypeDownload").html(res.insertId);
                        }, function (e) {
                            utils.showError("Error syncing classifications", e);
                        });
                    });
                    counter = 0;
                    sqlString = "INSERT INTO CseAssethierarchy(ID, Description, ParentID)";
                }
                else {
                    counter++;
                }
            });
            //Insert into table
            if (counter > 0) {
                db.transaction(function (transaction) {
                    transaction.executeSql(sqlString, [], function (transaction, res) {
                    }, function (e) {
                        utils.showError("Error syncing classifications", e);
                    });
                });
            }
        },
        InserAssetTypes: function(result) {
            var counter = 0;
            var sqlString = "INSERT INTO CseAssetType(TypeCode, TypeDescription, HierarchyID, GroupingID)";

            $.each(result, function (index, output) {
                if (counter == 0) {
                    sqlString += " SELECT '" + output.TypeCode + "' as 'TypeCode', '" + output.TypeDescription + "' as 'TypeDescription', " + output.HierarchyID + " as 'HierarchyID', '" + output.GroupingID + "' as 'GroupingID'";
                }
                else {
                    sqlString += " UNION SELECT '" + output.TypeCode + "', '" + output.TypeDescription + "', " + output.HierarchyID + ", '" + output.GroupingID + "'";
                }

                if (counter == 499) {
                    db.transaction(function (transaction) {
                        transaction.executeSql(sqlString, [], function (transaction, res) {
                            $("#AssetTypeDownload").html(res.insertId);
                        }, function (e) {
                            utils.showError("Error syncing asset types", e);
                        });
                    });
                    counter = 0;
                    sqlString = "INSERT INTO CseAssetType(TypeCode, TypeDescription, HierarchyID, GroupingID)";
                }
                else {
                    counter++;
                }
            });
            //Insert into table
            if (counter > 0) {
                db.transaction(function (transaction) {
                    transaction.executeSql(sqlString, [], function (transaction, res) {
                    }, function (e) {
                        utils.showError("Error syncing asset types", e);
                    });
                });
            }
        },
        InsertRooms: function(result) {
            var counter = 0;
            var sqlString = "INSERT INTO AlsRoom(RoomCode, RoomDescription, BuildingCode)";

            $.each(result, function (index, output) {
                if (counter == 0) {
                    sqlString += " SELECT '" + output.RoomCode + "' as 'RoomCode', '" + output.RoomDescription + "' as 'RoomDescription', '" + output.BuildingCode + "' as 'BuildingCode'";
                }
                else {
                    sqlString += " UNION SELECT '" + output.RoomCode + "', '" + output.RoomDescription + "', '" + output.BuildingCode + "'";
                }
                if (counter == 499) {
                    db.transaction(function (transaction) {
                        transaction.executeSql(sqlString, [], function (transaction, res) {
                            $("#RoomDownload").html(res.insertId);
                        }, function (e) {
                            utils.showError("Error syncing rooms", e);
                        });
                    });
                    counter = 0;
                    sqlString = "INSERT INTO AlsRoom(RoomCode, RoomDescription, BuildingCode)";
                }
                else {
                    counter++;
                }
            });
            //Insert into table
            if (counter > 0) {
                db.transaction(function (transaction) {
                    transaction.executeSql(sqlString, [], function (transaction, res) {
                    }, function (e) {
                        utils.showError("Error syncing rooms", e);
                    });
                });
            }
        },
        InsertBuildings: function(result) {
            var counter = 0;
            var sqlString = "INSERT INTO AlsBuilding(BuildingCode, BuildingDescription, SiteID)";

            $.each(result, function (index, output) {
                if (counter == 0) {
                    sqlString += " SELECT '" + output.BuildingCode + "' as 'BuildingCode', '" + output.BuildingDescription + "' as 'BuildingDescription', '" + output.SiteCode + "' as 'SiteID'";
                }
                else {
                    sqlString += " UNION SELECT '" + output.BuildingCode + "', '" + output.BuildingDescription + "', '" + output.SiteCode + "'";
                }
                if (counter == 499) {
                    db.transaction(function (transaction) {
                        transaction.executeSql(sqlString, [], function (transaction, res) {
                            $("#BuildingDownload").html(res.insertId);
                        }, function (e) {
                            utils.showError("Error syncing buildings", e);
                        });
                    });
                    counter = 0;
                    sqlString = "INSERT INTO AlsBuilding(BuildingCode, BuildingDescription, SiteID)";
                }
                else {
                    counter++;
                }
            });
            //Insert into table
            if (counter > 0) {
                db.transaction(function (transaction) {
                    transaction.executeSql(sqlString, [], function (transaction, res) {
                    }, function (e) {
                        utils.showError("Error syncing buildings", e);
                    });
                });
            }
        },
        InsertSites: function(result) {
            var counter = 0;
            var sqlString = "INSERT INTO AlsSite(SiteID, SiteDescription, LatExt, LongExt, ZoomLevel)";

            $.each(result, function (index, output) {
                if (counter == 0) {
                    sqlString += " SELECT '" + output.SiteID + "' as 'SiteID', '" + output.SiteDescription + "' as 'SiteDescription', " + output.LatExt + " as 'LatExt', " + output.LongExt + " as 'LongExt', " + output.ZoomLevel + " as 'ZoomLevel'";
                }
                else {
                    sqlString += " UNION SELECT '" + output.SiteID + "', '" + output.SiteDescription + "', " + output.LatExt + ", " + output.LongExt + ", " + output.ZoomLevel;
                }
                if (counter == 499) {
                    db.transaction(function (transaction) {
                        transaction.executeSql(sqlString, [], function (transaction, res) {
                            $("#SiteDownload").html(res.insertId);
                        }, function (e) {
                            utils.showError("Error syncing sites", e);
                        });
                    });
                    counter = 0;
                    sqlString = "INSERT INTO AlsSite(SiteID, SiteDescription, LatExt, LongExt, ZoomLevel)";
                }
                else {
                    counter++;
                }
            });
            //Insert into table
            if (counter > 0) {
                db.transaction(function (transaction) {
                    transaction.executeSql(sqlString, [], function (transaction, res) {
                    }, function (e) {
                        utils.showError("Error syncing sites", e);
                    });
                });
            }
        },
        InsertInfrAreas: function(result) {
            var counter = 0;
            var sqlString = "INSERT INTO AlsInfraArea(AreaCode, Description, LatExt, LongExt, Zoom)";

            $.each(result, function (index, output) {
                if (counter == 0) {
                    sqlString += " SELECT '" + output.AreaCode + "' as 'AreaCode', '" + output.Description + "' as 'Description', " + output.LatExt + " as 'LatExt', " + output.LongExt + " as 'LongExt', " + output.Zoom + " as 'Zoom'";
                }
                else {
                    sqlString += " UNION SELECT '" + output.AreaCode + "', '" + output.Description + "', " + output.LatExt + ", " + output.LongExt + ", " + output.Zoom;
                }
                if (counter == 499) {
                    db.transaction(function (transaction) {
                        transaction.executeSql(sqlString, [], function (transaction, res) {
                            $("#SiteDownload").html(res.insertId);
                        }, function (e) {
                            utils.showError("Error syncing areas", e);
                        });
                    });
                    counter = 0;
                    sqlString = "INSERT INTO AlsInfraArea(AreaCode, Description, LatExt, LongExt, Zoom)";
                }
                else {
                    counter++;
                }
            });
            //Insert into table
            if (counter > 0) {
                db.transaction(function (transaction) {
                    transaction.executeSql(sqlString, [], function (transaction, res) {
                    }, function (e) {
                        utils.showError("Error syncing areas", e);
                    });
                });
            }
        },
        InsertUsers: function(result) {
            var counter = 0;
            var sqlString = "INSERT INTO AMSUser(Username, EmployeeName, Password, Surname)";

            $.each(result, function (index, output) {
                if (counter == 0) {
                    sqlString += " SELECT '" + output.Username + "' as 'Username', '" + output.EmployeeName + "' as 'EmployeeName', '" + output.Password + "' as 'Password', '" + output.Surname + "' as 'Surname'";
                }
                else {
                    sqlString += " UNION SELECT '" + output.Username + "', '" + output.EmployeeName + "', '" + output.Password + "', '" + output.Surname + "'";
                }
                if (counter == 499) {
                    db.transaction(function (transaction) {
                        transaction.executeSql(sqlString, [], function (transaction, res) {
                        }, function (e) {
                            utils.showError("Error syncing users", e);
                        });
                    });
                    counter = 0;
                    sqlString = "INSERT INTO AMSUser(Username, EmployeeName, Password, Surname)";
                }
                else {
                    counter++;
                }
            });
            //Insert into table
            if (counter > 0) {
                db.transaction(function (transaction) {
                    transaction.executeSql(sqlString, [], function (transaction, res) {
                    }, function (e) {
                        utils.showError("Error syncing users", e);
                    });
                });
            }
        }, 
        InsertSingleAssetCapture: function(callback, transaction, 
                                           barcode, 
                                           grouping, 
                                           oldbarcode, 
                                           description, 
                                           hierarchyid, 
                                           assettypeid, 
                                           condition, 
                                           photo,
                                           make,
                                           model,
                                           serialNumber,
                                           custodian,
                                           parentBarcode,
                                           qty,
                                           username,
                                           roomCode) {
            if (condition == "VERY")
                condition = "VERY POOR";
                                              
            transaction.executeSql('INSERT INTO AscAssetCapture(AssetBarCode, GroupingName, RoomCode, OldBarCode, Description, AssetHierarchyID, AssetTypeID, Condition, Photo, Make, Model, SerialNumber, CustodianName, ParentBarCode, Qty, Username) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', 
                                   [barcode, grouping, roomCode, oldbarcode, description, hierarchyid, assettypeid, condition, photo, make, model, serialNumber, custodian, parentBarcode, qty, username], callback, errorHandler);
        },
        InsertPhoto: function(barcode, photo) {
            db.transaction(function (transaction) {
                transaction.executeSql('Select * from Photo where AssetBarCode = ?', [barcode], function(tx, result) {
                    if (result != null && result.rows != null) {
                        if (result.rows.length == 0) {
                            tx.executeSql('INSERT INTO Photo(AssetBarCode, Path) VALUES (?,?)', [barcode, photo], nullHandler, errorHandler);
                        }
                        else {
                            tx.executeSql('Update Photo set Path = ? where AssetBarCode = ?', [photo, barcode], nullHandler, errorHandler);
                        } 
                    }
                }, errorHandler);
            });
        },
        UpdateSingleAssetCapture: function(callback, transaction, 
                                           oldbarcode, 
                                           description, 
                                           hierarchyid, 
                                           assettypeid, 
                                           condition, 
                                           photo, 
                                           assetbarcode, 
                                           make, 
                                           model, 
                                           serialNumber, 
                                           custodian, 
                                           parentBarcode, 
                                           qty,
                                           username,
                                           roomCode) {
            console.log("parent " + parentBarcode);
            if (condition == "VERY")
                condition = "VERY POOR";
            transaction.executeSql('UPDATE AscAssetCapture set OldBarCode = ?, RoomCode = ?, Description = ?, AssetHierarchyID = ?, AssetTypeID = ?, Condition = ?, Photo = ?, Make = ?, Model = ?, SerialNumber = ?, CustodianName = ?, ParentBarCode = ?, Qty = ?, Username = ?  where AssetBarCode = ?', 
                                   [oldbarcode, roomCode, description, hierarchyid, assettypeid, condition, photo, make, model, serialNumber, custodian, parentBarcode, qty, username, assetbarcode], callback, errorHandler);
        },
        DeleteSingleAssetCapture: function(barcode) {
            db.transaction(function (transaction) {
                transaction.executeSql('Delete from AscAssetCapture where AssetBarCode = ?', [barcode], this.nullHandler, this.errorHandler);
            });
        },
        UpdateSingleAscSpecValueCapture: function(callback, transaction, description, specvalue, specid, specvaluesid, assetcode, compulsory) {
          
            transaction.executeSql('UPDATE AscSpecValueCapture set Description = ?, SpecValue = ?, SpecID = ?, SpecValueID = ?, AssetCode = ?, IsCompulsory = ? where AssetCode = ? and SpecID = ?', [description, specvalue, specid, specvaluesid, assetcode,compulsory, assetcode, specid], callback, errorHandler);
        	
        },
        InsertSingleAscSpecValueCapture: function(transaction, description, specvalue, specid, specvaluesid, assetcode, compulsory) {
           
            transaction.executeSql('INSERT INTO AscSpecValueCapture (Description, SpecValue, SpecID, SpecValueID, AssetCode, IsCompulsory) VALUES (?,?,?,?,?,?)', [description,specvalue, specid, specvaluesid, assetcode, compulsory], nullHandler, errorHandler);
       
        },
        DeleteSingleAscSpecValueCaptureByBarcode: function(barcode) {
            db.transaction(function (transaction) {
                transaction.executeSql('Delete from AscSpecValueCapture where AssetCode = ?', [barcode], this.nullHandler, this.errorHandler);
            });
        },
        GetAreas: function(callback) {
            db.transaction(function (transaction) {
                transaction.executeSql('Select AreaCode, Description from AlsInfraArea', [], callback, this.errorHandler);
            });
        },
        GetPhotos: function(callback) {
            db.transaction(function (transaction) {
                transaction.executeSql('Select AssetBarCode, Path from Photo', [], callback, this.errorHandler);
            });
        },
        GetSingleArea: function(callback, area) {
            db.transaction(function (transaction) {
                transaction.executeSql("Select AreaCode, Description, LatExt, LongExt, Zoom from AlsInfraArea where AreaCode = ?", [area], callback, this.errorHandler);
            });
        },
        GetAssetTypeByGrouping: function(callback, grouping) {
            db.transaction(function (transaction) {
                transaction.executeSql('Select * from CseAssetType where GroupingID = ?', [grouping], callback, this.errorHandler);
            });
        },
        setCondition: function(callback) {
            db.transaction(function (transaction) {
                transaction.executeSql('Select Description from AlsCondition', [], callback, this.errorHandler);
            });
        },
        GetOldAssetsByBarcode: function(callback, barcode) {
            db.transaction(function (transaction) {
                transaction.executeSql('Select * from AscAssetCaptureOld where AssetBarCode = ?', [barcode], callback, this.errorHandler);
            });
        },
        GetSpecValueByBarcode: function(callback, SelectedAssetCode) {
            db.transaction(function (transaction) {
             
                transaction.executeSql('Select * from AscSpecValue where AssetCode = ?', [SelectedAssetCode], callback, errorHandler);
                
            });
        },
        GetSpecValueByBarcodeAndSpecID: function(callback, SelectedAssetCode, SpecID) {
            db.transaction(function (transaction) {
                transaction.executeSql('Select * from AscSpecValue where AssetCode = ? and SpecID = ?', [SelectedAssetCode, SpecID], callback, this.errorHandler);
            });
        },
        GetAssetTypeSpecValuebySpectID: function(callback, specID) {
            db.transaction(function (transaction) {
                transaction.executeSql('Select * from CseAssetTypeSpecValue where SpecID = ?', [specID], callback, this.errorHandler);
            }); 
        },
        GetAssetTypeByTypeCode: function(callback, TypeCode) {
            db.transaction(function (transaction) {
                transaction.executeSql('Select * from CseAssetType where TypeCode = ?', [TypeCode], callback, this.errorHandler);
            });
        },
        GetClassificationByID: function(callback, ID) {
            db.transaction(function (transaction) {
                transaction.executeSql('Select * from CseAssetHierarchy where ID = ?', [ID], callback, this.errorHandler);
            });
        },
        GetAssetTypes: function(callback) {
            db.transaction(function (transaction) {
                transaction.executeSql('Select * from CseAssetType order by TypeDescription', null, callback, this.errorHandler);
            });
        },
        GetAssetCaptureByBarcode: function(callback, barcode) {
            db.transaction(function (transaction) {
                transaction.executeSql("Select * from AscAssetCapture where AssetBarCode = ?", [barcode], callback, this.errorHandler);
            });
        },
        GetAssetCapture: function(callback) {
            db.transaction(function (transaction) {
                transaction.executeSql('SELECT * FROM AscAssetCapture', [], callback, this.errorHandler);
            });
        },
        GetLowestLevelClassification: function(callback) {
            db.transaction(function (transaction) {
                transaction.executeSql('Select * from CseAssetHierarchy where ID not in (Select ParentID from CseAssetHierarchy) order by Description', [], callback, this.errorHandler);
            });
        },
        GetLowestLevelClassificationByDescription: function(callback, Description) {
            db.transaction(function (transaction) {
                var SQL = "Select * from CseAssetHierarchy where ID not in (Select ParentID from CseAssetHierarchy) and UPPER(Description) like UPPER('%" + Description + "%') order by Description";
        
                transaction.executeSql(SQL, [], callback , this.errorHandler);
            });
        },
        GetAssetTypeByHierarchyID: function(callback, HierarchyID) {
            db.transaction(function (transaction) {
                transaction.executeSql('Select * from CseAssetType where HierarchyID = ? order by TypeDescription', [HierarchyID], callback, this.errorHandler);
            });
        },
        GetAssetTypeSpecLinkByTypeCode: function(callback, TypCode) {
            db.transaction(function (transaction) {
                transaction.executeSql('Select * from CseAssetTypeSpecLink where TypeCode = ?', [TypCode], callback, this.errorHandler);
            });
        },
        GetAssetTypeSpecLinkBySpecID: function(callback, SpecID) {
            db.transaction(function (transaction) {
                transaction.executeSql('Select * from CseAssetTypeSpecLink where SpecID = ?', [SpecID], callback, this.errorHandler);
            });
        },
        GetAssetTypeSpecLinkBySpecID_TypeCode: function(callback, SpecID, TypeCode) {
            db.transaction(function (transaction) {
                transaction.executeSql('Select * from CseAssetTypeSpecLink where SpecID = ? and TypeCode = ?', [SpecID, TypeCode], callback, this.errorHandler);
            });
        },
        GetAssetTypeSpecByIDs: function(callback, IDs, TypeCode) {
            db.transaction(function (transaction) {
              
                var sql = 'Select a.ID, a.Description, b.IsCompulsory from CseAssetTypeSpec as a INNER JOIN CseAssetTypeSpecLink as b on a.ID = b.SpecID and b.TypeCode = ? where a.ID in (' + IDs + ')';
                transaction.executeSql(sql, [TypeCode], callback, errorHandler);
            });
        },
        GetAssetTypeByDescription: function(callback, Description) {
            db.transaction(function (transaction) {
                var SQL = "Select * from CseAssetType where UPPER(TypeDescription) like UPPER('%" + Description + "%') order by TypeDescription";
       
                transaction.executeSql(SQL, [], callback, this.errorHandler);
            });
        },
        GetSpecCapture: function(callback, Barcode) {
            db.transaction(function (transaction) {
                transaction.executeSql('SELECT * FROM AscSpecValueCapture where AssetCode = ?', [Barcode], callback, errorHandler);
            });
        },
        ReCreateAssetCapture: function() {
            db.transaction(function (tx) {
                tx.executeSql('DROP TABLE IF EXISTS AscAssetCapture', [], nullHandler, errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS AscAssetCapture(AssetBarCode TEXT NOT NULL PRIMARY KEY, GroupingName TEXT, OldBarCode TEXT, Description TEXT, AssetHierarchyID INTEGER, AssetTypeID TEXT, CustodianName TEXT, Condition TEXT, Make TEXT, Model TEXT, RegistrationNumber TEXT, SerialNumber TEXT, QTY INTEGER, Username TEXT, RoomCode TEXT, TitleDeedNumber TEXT, AssetID INTEGER, ParentBarCode TEXT, Photo BLOB )', [], nullHandler, errorHandler);
            });
        },
        GetSitesData: function(callback) {
            db.transaction(function (transaction) {
                transaction.executeSql('SELECT SiteID, SiteDescription FROM AlsSite', [], callback, errorHandler);
            });
        },
        GetBuildings: function(callback, SiteID) {
            db.transaction(function (transaction) {
                transaction.executeSql('SELECT BuildingCode, BuildingDescription, SiteID FROM AlsBuilding where SiteID = ?', [SiteID], callback, errorHandler);
            });
        },
        GetRooms: function(callback, BuildingCode) {
            db.transaction(function (transaction) {
                transaction.executeSql('SELECT RoomCode FROM AlsRoom where BuildingCode = ?', [BuildingCode], callback, errorHandler);
            });
        },
        GetUsers: function(callback) {
            db.transaction(function (transaction) {
                transaction.executeSql('SELECT Username, ifnull(EmployeeName,"") || " " || ifnull(Surname,"") as Name FROM AMSUser order by EmployeeName asc', [], callback, errorHandler);
            });
        }
    }
});