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
            } else {
                // For debugin in simulator fallback to native SQL Lite
                db = window.openDatabase("AMS360", "1.0", "AMS360", 200000);
            }
        },
        CreateTables: function() {
            db.transaction(function (tx) {
                tx.executeSql('DROP TABLE IF EXISTS AlsCondition', [], nullHandler, this.errorHandler);

                tx.executeSql('CREATE TABLE IF NOT EXISTS AMSUser(Username TEXT NOT NULL PRIMARY KEY, EmployeeName TEXT NOT NULL,Password TEXT NOT NULL, Surname TEXT NOT NULL)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS AlsSite(SiteID TEXT NOT NULL PRIMARY KEY, SiteDescription TEXT NOT NULL, LatExt REAL, LongExt REAL, ZoomLevel INTEGER)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS AscScanProject(ID TEXT NOT NULL PRIMARY KEY, Name TEXT NOT NULL)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS AlsInfraArea(AreaCode TEXT NOT NULL PRIMARY KEY, Description TEXT NOT NULL, LatExt REAL, LongExt REAL, Zoom INTEGER)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS AlsBuilding(BuildingCode TEXT NOT NULL PRIMARY KEY, BuildingDescription TEXT NOT NULL, SiteID TEXT NOT NULL)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS AlsRoom(RoomCode TEXT NOT NULL PRIMARY KEY, RoomDescription TEXT NOT NULL, BuildingCode TEXT NOT NULL, Username TEXT)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS CseAssetType(TypeCode TEXT NOT NULL PRIMARY KEY, TypeDescription TEXT NOT NULL, HierarchyID INTEGER, GroupingID TEXT, ConditionSetupID TEXT)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS CseAssetHierarchy(ID TEXT NOT NULL PRIMARY KEY, Description TEXT NOT NULL, ParentID TEXT)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS AscAssetCaptureOld(AssetBarCode TEXT NOT NULL PRIMARY KEY, GroupingName TEXT, OldBarCode TEXT, Description TEXT, AssetHierarchyID INTEGER, AssetTypeID TEXT, CustodianName TEXT, Condition TEXT, Make TEXT, Model TEXT, RegistrationNumber TEXT, SerialNumber TEXT, QTY INTEGER, Username TEXT, RoomCode TEXT, AssetID INTEGER)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS AscAssetCapture(AssetBarCode TEXT NOT NULL, GroupingName TEXT, OldBarCode TEXT, Description TEXT, AssetHierarchyID INTEGER, AssetTypeID TEXT, CustodianName TEXT, Condition TEXT, Make TEXT, Model TEXT, RegistrationNumber TEXT, SerialNumber TEXT, QTY INTEGER, Username TEXT, RoomCode TEXT, TitleDeedNumber TEXT, AssetID INTEGER, ParentBarCode TEXT, Photo BLOB, ProjectID TEXT NOT NULL, PRIMARY KEY ( AssetBarCode, ProjectID) )', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS AscSpecValue(ID INTEGER NOT NULL PRIMARY KEY, Description TEXT NOT NULL, SpecValue TEXT, SpecID INTEGER, SpecValueID INTEGER, AssetCode TEXT, IsCompulsory INTEGER)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS AscSpecValueCapture(Description TEXT NOT NULL, SpecValue TEXT, SpecID INTEGER, SpecValueID INTEGER, AssetCode TEXT, IsCompulsory INTEGER, ProjectID TEXT)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS CseAssetTypeSpec(ID INTEGER NOT NULL PRIMARY KEY, Description TEXT NOT NULL)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS CseAssetTypeSpecLink(ID INTEGER NOT NULL PRIMARY KEY, IsCompulsory INTEGER, SpecID INTEGER, TypeCode TEXT)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS CseAssetTypeSpecValue(ID INTEGER NOT NULL PRIMARY KEY, Description TEXT, SpecID INTEGER)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS AlsCondition(Description TEXT)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS Photo(AssetBarCode TEXT, Path TEXT, ProjectID TEXT)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS ConHeader(ID TEXT NOT NULL PRIMARY KEY, Description TEXT NOT NULL, OverallRating INTEGER, NewScore INTEGER, GoodScore INTEGER, FairScore INTEGER, PoorScore INTEGER, VeryPoorScore INTEGER)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS ConGrouping(ID INTEGER NOT NULL PRIMARY KEY, Description TEXT NOT NULL, HeaderID TEXT NOT NULL)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS ConCriteriaLine(ID INTEGER NOT NULL PRIMARY KEY, Description TEXT NOT NULL, GroupID INTEGER NOT NULL, Rating INTEGER)', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS ConAssessmentCapture(AssetBarCode TEXT NOT NULL, ProjectID TEXT NOT NULL, OverallRating INTEGER, NewCondition TEXT, OldCondition TEXT, FinalScore INTEGER, TranDate TEXT, CapturedBy TEXT, RoomCode TEXT )', [], nullHandler, this.errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS ConAssessmentCaptureLine(AssetBarCode TEXT NOT NULL, ProjectID TEXT NOT NULL, CriteriaLineID INTEGER, CriteriaDescription TEXT, Score INTEGER)', [], nullHandler, this.errorHandler);
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
                tx.executeSql('DROP TABLE IF EXISTS AscScanProject', [], nullHandler, this.errorHandler);
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
                tx.executeSql('DROP TABLE IF EXISTS ConHeader', [], nullHandler, this.errorHandler);
                tx.executeSql('DROP TABLE IF EXISTS ConGrouping', [], nullHandler, this.errorHandler);
                tx.executeSql('DROP TABLE IF EXISTS ConCriteriaLine', [], nullHandler, this.errorHandler);
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
                transaction.executeSql('CREATE TABLE IF NOT EXISTS Photo(AssetBarCode TEXT, Path TEXT, ProjectID TEXT)', [], nullHandler, this.errorHandler);
            });
        },
        InsertAscSpecValue:function(result) {
            var counter = 0;
            var sqlString = "INSERT INTO CseAssetTypeSpecValue(ID, Description, SpecID)";

            $.each(result, function (index, output) {
                if (counter == 0) {
                    sqlString += " SELECT " + output.ID + " as 'ID', '" + output.Description.replace("'", "''") + "' as 'Description', " + output.SpecID + " as 'SpecID'";
                } else {
                    sqlString += " UNION SELECT " + output.ID + ", '" + output.Description.replace("'", "''") + "', " + output.SpecID;
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
                } else {
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
                    sqlString += " SELECT " + output.ID + " as 'ID', " + output.IsCompulsory + " as 'IsCompulsory', " + output.SpecID + " as 'SpecID', '" + output.TypeCode.replace("'", "''") + "' as 'TypeCode'";
                } else {
                    sqlString += " UNION SELECT " + output.ID + ", " + output.IsCompulsory + ", " + output.SpecID + ", '" + output.TypeCode.replace("'", "''") + "'";
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
                } else {
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
                    sqlString += " SELECT " + output.ID + " as 'ID', '" + output.Description.replace("'", "''") + "' as 'Description'";
                } else {
                    sqlString += " UNION SELECT " + output.ID + ", '" + output.Description.replace("'", "''") + "'";
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
                } else {
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
                    sqlString += " SELECT " + output.ID + " as 'ID', '" + output.Description.replace("'", "''") + "' as 'Description', '" + output.SpecValue.replace("'", "''") + "' as 'SpecValue', " + output.SpecID + " as 'SpecID', " + output.SpecValueID + " as 'SpecValueID', '" + output.AssetCode.replace("'", "''") + "' as 'AssetCode', " + output.IsCompulsory + " as 'IsCompulsory'";
                } else {
                    sqlString += " UNION SELECT " + output.ID + ", '" + output.Description.replace("'", "''") + "', '" + output.SpecValue.replace("'", "''") + "', " + output.SpecID + ", " + output.SpecValueID + ", '" + output.AssetCode.replace("'", "''") + "', " + output.IsCompulsory;
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
                } else {
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
            debugger;
            var counter = 0;
            var sqlString = "INSERT INTO AscAssetCaptureOld(AssetBarCode, GroupingName, OldBarCode, Description, AssetHierarchyID, AssetTypeID, CustodianName, Condition, Make, Model, RegistrationNumber, SerialNumber, QTY, Username, RoomCode, AssetID)";

            $.each(result, function (index, output) {
                if (counter == 0) {
                    sqlString += " SELECT '" 
                                 + output.AssetBarCode.toString().replace("'", "''") + "' as 'AssetBarCode', '" 
                                 + output.GroupingName.toString().replace("'", "''") + "' as 'GroupingName', '" 
                                 + output.OldBarCode.toString().replace("'", "''") + "' as 'OldBarCode', '" 
                                 + output.Description.toString().replace("'", "''") + "' as 'Description', " 
                                 + output.AssetHierarchyID + " as 'AssetHierarchID', '" 
                                 + output.AssetTypeID.toString().replace("'", "''") + "' as 'AssetTypeID', '" 
                                 + output.CustodianName.toString().replace("'", "''") + "' as 'CustodianName', '" 
                                 + output.Condition.toString().replace("'", "''") + "' as 'Condition', '" 
                                 + output.Make.toString().replace("'", "''") + "' as 'Make', '" 
                                 + output.Model.toString().replace("'", "''") + "' as 'Model', '" 
                                 + output.RegistrationNumber.toString().replace("'", "''") + "' as 'RegistrationNumber', '" 
                                 + output.SerialNumber.toString().replace("'", "''") + "' as 'SerialNumber', " 
                                 + output.Qty + " as 'QTY', '" 
                                 + output.Username.toString().replace("'", "''") + "' as 'Username', '" 
                                 + output.RoomCode.toString().replace("'", "''") + "' as 'RoomCode', " 
                                 + output.AssetID + " as 'AssetID'" ;
                } else {
                    sqlString += " UNION SELECT '" + output.AssetBarCode.toString().replace("'", "''") + "', '" 
                                 + output.GroupingName.toString().replace("'", "''") + "', '" 
                                 + output.OldBarCode.toString().replace("'", "''") + "', '" 
                                 + output.Description.toString().replace("'", "''") + "', " 
                                 + output.AssetHierarchyID + ", '" 
                                 + output.AssetTypeID.toString().replace("'", "''") + "', '" 
                                 + output.CustodianName.toString().replace("'", "''") + "', '" 
                                 + output.Condition.toString().replace("'", "''") + "', '" 
                                 + output.Make.toString().replace("'", "''") + "', '" 
                                 + output.Model.toString().replace("'", "''") + "', '" 
                                 + output.RegistrationNumber.toString().replace("'", "''") + "', '" 
                                 + output.SerialNumber.toString().replace("'", "''") + "', " 
                                 + output.Qty + ", '" 
                                 + output.Username.toString().replace("'", "''") + "', '" 
                                 + output.RoomCode.toString().replace("'", "''") + "', " 
                                 + output.AssetID;
                }

                if (counter == 499) {
                    db.transaction(function (transaction) {
                        transaction.executeSql(sqlString, [], function (transaction, res) {
                        }, function (e) {
                            utils.showError("Error syncing assets", e);
                        });
                    });
                    counter = 0;
                    sqlString = "INSERT INTO AscAssetCaptureOld(AssetBarCode, GroupingName, OldBarCode, Description, AssetHierarchyID, AssetTypeID, CustodianName, Condition, Make, Model, RegistrationNumber, SerialNumber, QTY, Username, RoomCode, AssetID)";
                } else {
                    counter++;
                }
            });
            //Insert into table
            if (counter > 0) {
                db.transaction(function (transaction) {
                    transaction.executeSql(sqlString, [], function (transaction, res) {
                    }, function (e) {
                        debugger;
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
                    sqlString += " SELECT '" + output.HierarchyID.toString().replace("'", "''") + "' as 'ID', '" + output.Description.toString().replace("'", "''") + "' as 'Description', '" + output.ParentID.toString().replace("'", "''") + "' as 'ParentID'";
                } else {
                    sqlString += " UNION SELECT '" + output.HierarchyID.toString().replace("'", "''") + "', '" + output.Description.toString().replace("'", "''") + "', '" + output.ParentID.toString().replace("'", "''") + "'";
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
                } else {
                    counter++;
                }
            });
            //Insert into table
            if (counter > 0) {
                db.transaction(function (transaction) {
                    transaction.executeSql(sqlString, [], function (transaction, res) {
                    }, function (e) {
                        debugger;
                        utils.showError("Error syncing classifications", e);
                    });
                });
            }
        },
        InserAssetTypes: function(result) {
            var counter = 0;
            var sqlString = "INSERT INTO CseAssetType(TypeCode, TypeDescription, HierarchyID, GroupingID, ConditionSetupID)";

            $.each(result, function (index, output) {
                if (counter == 0) {
                    sqlString += " SELECT '" + output.TypeCode.replace("'", "''") + "' as 'TypeCode', '" + output.TypeDescription.replace("'", "''") + "' as 'TypeDescription', " + output.HierarchyID.replace("'", "''") + " as 'HierarchyID', '" + output.GroupingID.replace("'", "''") + "' as 'GroupingID', '" + output.ConditionSetupID.replace("'", "''") + "' as 'ConditionSetupID'";
                } else {
                    sqlString += " UNION SELECT '" + output.TypeCode.replace("'", "''") + "', '" + output.TypeDescription.replace("'", "''") + "', " + output.HierarchyID.replace("'", "''") + ", '" + output.GroupingID.replace("'", "''") + "', '" + output.ConditionSetupID.replace("'", "''") + "'";
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
                    sqlString = "INSERT INTO CseAssetType(TypeCode, TypeDescription, HierarchyID, GroupingID, ConditionSetupID)";
                } else {
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
            var sqlString = "INSERT INTO AlsRoom(RoomCode, RoomDescription, BuildingCode, Username)";

            $.each(result, function (index, output) {
                if (counter == 0) {
                    sqlString += " SELECT '" + output.RoomCode.replace("'", "''") + "' as 'RoomCode', '" + output.RoomDescription.replace("'", "''") + "' as 'RoomDescription', '" + output.BuildingCode.replace("'", "''") + "' as 'BuildingCode', '" + output.Username.replace("'", "''") + "' as 'Username'";
                } else {
                    sqlString += " UNION SELECT '" + output.RoomCode.replace("'", "''") + "', '" + output.RoomDescription.replace("'", "''") + "', '" + output.BuildingCode.replace("'", "''") + "', '" + output.Username.replace("'", "''") + "'";
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
                    sqlString = "INSERT INTO AlsRoom(RoomCode, RoomDescription, BuildingCode, Username)";
                } else {
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
                    sqlString += " SELECT '" + output.BuildingCode.replace("'", "''") + "' as 'BuildingCode', '" + output.BuildingDescription.replace("'", "''") + "' as 'BuildingDescription', '" + output.SiteCode.replace("'", "''") + "' as 'SiteID'";
                } else {
                    sqlString += " UNION SELECT '" + output.BuildingCode.replace("'", "''") + "', '" + output.BuildingDescription.replace("'", "''") + "', '" + output.SiteCode.replace("'", "''") + "'";
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
                } else {
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
                    sqlString += " SELECT '" + output.SiteID.replace("'", "''") + "' as 'SiteID', '" + output.SiteDescription.replace("'", "''") + "' as 'SiteDescription', " + output.LatExt + " as 'LatExt', " + output.LongExt + " as 'LongExt', " + output.ZoomLevel + " as 'ZoomLevel'";
                } else {
                    sqlString += " UNION SELECT '" + output.SiteID.replace("'", "''") + "', '" + output.SiteDescription.replace("'", "''") + "', " + output.LatExt + ", " + output.LongExt + ", " + output.ZoomLevel;
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
                } else {
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
        InsertConHeaders: function(result) {
            var counter = 0;
            var sqlString = "INSERT INTO ConHeader(ID, Description, OverallRating, NewScore, GoodScore, FairScore, PoorScore, VeryPoorScore)";

            $.each(result, function (index, output) {
                if (counter == 0) {
                    sqlString += " SELECT '" + output.ID.replace("'", "''") + "' as 'ID', '" + output.Description.replace("'", "''") + "' as 'Description', " + output.OverallRating + " as OverallRating, " + output.NewScore + " as NewScore, " + output.GoodScore + " as GoodScore, " + output.FairScore + " as FairScore, " + output.PoorScore + " as PoorScore, " + output.VeryPoorScore + " as VeryPoorScore";
                } else {
                    sqlString += " UNION SELECT '" + output.ID.replace("'", "''") + "', '" + output.Description.replace("'", "''") + "', " + output.OverallRating + ", " + output.NewScore + ", " + output.GoodScore + ", " + output.FairScore + ", " + output.PoorScore + ", " + output.VeryPoorScore;
                }
                if (counter == 499) {
                    db.transaction(function (transaction) {
                        transaction.executeSql(sqlString, [], function (transaction, res) {
                            $("#ConHeaderDownload").html(res.insertId);
                        }, function (e) {
                            utils.showError("Error syncing condition setup", e);
                        });
                    });
                    counter = 0;
                    sqlString = "INSERT INTO ConHeader(ID, Description, OverallRating, NewScore, GoodScore, FairScore, PoorScore, VeryPoorScore)";
                } else {
                    counter++;
                }
            });
            //Insert into table
            if (counter > 0) {
                db.transaction(function (transaction) {
                    debugger;
                    transaction.executeSql(sqlString, [], function (transaction, res) {
                    }, function (e) {
                        utils.showError("Error syncing condition setup", e);
                    });
                });
            }
        },
        InsertConGroups: function(result) {
            var counter = 0;
            var sqlString = "INSERT INTO ConGrouping(ID, Description, HeaderID)";

            $.each(result, function (index, output) {
                if (counter == 0) {
                    sqlString += " SELECT " + output.ID + " as 'ID', '" + output.Description.replace("'", "''") + "' as 'Description', '" + output.HeaderID.replace("'", "''") + "'";
                } else {
                    sqlString += " UNION SELECT " + output.ID + ", '" + output.Description.replace("'", "''") + "', '" + output.HeaderID.replace("'", "''") + "'";
                }
                if (counter == 499) {
                    db.transaction(function (transaction) {
                        transaction.executeSql(sqlString, [], function (transaction, res) {
                            $("#ConGroupDownload").html(res.insertId);
                        }, function (e) {
                            utils.showError("Error syncing condition groups", e);
                        });
                    });
                    counter = 0;
                    sqlString = "INSERT INTO ConHeader(ID, Description, HeaderID)";
                } else {
                    counter++;
                }
            });
            //Insert into table
            if (counter > 0) {
                db.transaction(function (transaction) {
                    transaction.executeSql(sqlString, [], function (transaction, res) {
                    }, function (e) {
                        utils.showError("Error syncing condition group", e);
                    });
                });
            }
        },
        InsertConCriterias: function(result) {
            var counter = 0;
            var sqlString = "INSERT INTO ConCriteriaLine(ID, Description, GroupID, Rating)";

            $.each(result, function (index, output) {
                if (counter == 0) {
                    sqlString += " SELECT " + output.ID + " as 'ID', '" + output.Description.replace("'", "''") + "' as 'Description', '" + output.GroupID + "', " + output.Rating + " as 'Rating'";
                } else {
                    sqlString += " UNION SELECT " + output.ID + ", '" + output.Description.replace("'", "''") + "', '" + output.GroupID + "', " + output.Rating;
                }
                if (counter == 499) {
                    db.transaction(function (transaction) {
                        transaction.executeSql(sqlString, [], function (transaction, res) {
                            $("#ConCriteriaDownload").html(res.insertId);
                        }, function (e) {
                            utils.showError("Error syncing condition criteria", e);
                        });
                    });
                    counter = 0;
                    sqlString = "INSERT INTO ConCriteriaLine(ID, Description, GroupID, Rating)";
                } else {
                    counter++;
                }
            });
            //Insert into table
            if (counter > 0) {
                db.transaction(function (transaction) {
                    transaction.executeSql(sqlString, [], function (transaction, res) {
                    }, function (e) {
                        utils.showError("Error syncing condition criteria", e);
                    });
                });
            }
        },
        InsertProjects: function(result) {
            var counter = 0;
            var sqlString = "INSERT INTO AscScanProject(ID, Name)";

            $.each(result, function (index, output) {
                if (counter == 0) {
                    sqlString += " SELECT '" + output.ID.replace("'", "''") + "' as 'ID', '" + output.Name.replace("'", "''") + "' as 'Name'";
                } else {
                    sqlString += " UNION SELECT '" + output.ID.replace("'", "''") + "', '" + output.Name.replace("'", "''") + "'";
                }
                if (counter == 499) {
                    db.transaction(function (transaction) {
                        transaction.executeSql(sqlString, [], function (transaction, res) {
                            $("#SiteDownload").html(res.insertId);
                        }, function (e) {
                            utils.showError("Error syncing projects", e);
                        });
                    });
                    counter = 0;
                    sqlString = "INSERT INTO AscScanProject(ID, Name)";
                } else {
                    counter++;
                }
            });
            //Insert into table
            if (counter > 0) {
                db.transaction(function (transaction) {
                    transaction.executeSql(sqlString, [], function (transaction, res) {
                    }, function (e) {
                        utils.showError("Error syncing projects", e);
                    });
                });
            }
        },
        InsertInfrAreas: function(result) {
            var counter = 0;
            var sqlString = "INSERT INTO AlsInfraArea(AreaCode, Description, LatExt, LongExt, Zoom)";

            $.each(result, function (index, output) {
                if (counter == 0) {
                    sqlString += " SELECT '" + output.AreaCode.replace("'", "''") + "' as 'AreaCode', '" + output.Description.replace("'", "''") + "' as 'Description', " + output.LatExt + " as 'LatExt', " + output.LongExt + " as 'LongExt', " + output.Zoom + " as 'Zoom'";
                } else {
                    sqlString += " UNION SELECT '" + output.AreaCode.replace("'", "''") + "', '" + output.Description.replace("'", "''") + "', " + output.LatExt + ", " + output.LongExt + ", " + output.Zoom;
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
                } else {
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
                    sqlString += " SELECT '" + output.Username.replace("'", "''") + "' as 'Username', '" + output.EmployeeName.replace("'", "''") + "' as 'EmployeeName', '" + output.Password + "' as 'Password', '" + output.Surname.replace("'", "''") + "' as 'Surname'";
                } else {
                    sqlString += " UNION SELECT '" + output.Username.replace("'", "''") + "', '" + output.EmployeeName.replace("'", "''") + "', '" + output.Password + "', '" + output.Surname.replace("'", "''") + "'";
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
                } else {
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
                                           roomCode,
                                           projectid) {
            if (condition == "VERY")
                condition = "VERY POOR";
                                              
            transaction.executeSql('INSERT INTO AscAssetCapture(AssetBarCode, GroupingName, RoomCode, OldBarCode, Description, AssetHierarchyID, AssetTypeID, Condition, Photo, Make, Model, SerialNumber, CustodianName, ParentBarCode, Qty, Username, ProjectID) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', 
                                   [barcode, grouping, roomCode, oldbarcode, description, hierarchyid, assettypeid, condition, photo, make, model, serialNumber, custodian, parentBarcode, qty, username, projectid], callback, errorHandler);
        },
        InsertPhoto: function(barcode, photo, projectid) {
            db.transaction(function (transaction) {
                transaction.executeSql('Select * from Photo where AssetBarCode = ? and ProjectID = ?', [barcode, projectid], function(tx, result) {
                    if (result != null && result.rows != null) {
                        if (result.rows.length == 0) {
                            tx.executeSql('INSERT INTO Photo(AssetBarCode, Path, ProjectID) VALUES (?,?,?)', [barcode, photo,projectid], nullHandler, errorHandler);
                        } else {
                            tx.executeSql('Update Photo set Path = ? where AssetBarCode = ? and ProjectID = ?', [photo, barcode, projectid], nullHandler, errorHandler);
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
                                           roomCode,
                                           projectid) {
            if (condition == "VERY")
                condition = "VERY POOR";
            transaction.executeSql('UPDATE AscAssetCapture set OldBarCode = ?, RoomCode = ?, Description = ?, AssetHierarchyID = ?, AssetTypeID = ?, Condition = ?, Photo = ?, Make = ?, Model = ?, SerialNumber = ?, CustodianName = ?, ParentBarCode = ?, Qty = ?, Username = ?  where AssetBarCode = ? and ProjectID = ?', 
                                   [oldbarcode, roomCode, description, hierarchyid, assettypeid, condition, photo, make, model, serialNumber, custodian, parentBarcode, qty, username, assetbarcode, projectid], callback, errorHandler);
        },
        DeleteSingleAssetCapture: function(barcode, projectid) {
            db.transaction(function (transaction) {
                transaction.executeSql('Delete from AscAssetCapture where AssetBarCode = ? and ProjectID = ?', [barcode, projectid], this.nullHandler, this.errorHandler);
            });
        },
        UpdateSingleAscSpecValueCapture: function(callback, transaction, description, specvalue, specid, specvaluesid, assetcode, compulsory, projectid) {
            transaction.executeSql('UPDATE AscSpecValueCapture set Description = ?, SpecValue = ?, SpecID = ?, SpecValueID = ?, AssetCode = ?, IsCompulsory = ? where AssetCode = ? and SpecID = ? and ProjectID = ?', [description, specvalue, specid, specvaluesid, assetcode,compulsory, assetcode, specid, projectid], callback, errorHandler);
        },
        InsertSingleAscSpecValueCapture: function(transaction, description, specvalue, specid, specvaluesid, assetcode, compulsory, projectid) {
            transaction.executeSql('INSERT INTO AscSpecValueCapture (Description, SpecValue, SpecID, SpecValueID, AssetCode, IsCompulsory, ProjectID) VALUES (?,?,?,?,?,?,?)', [description,specvalue, specid, specvaluesid, assetcode, compulsory, projectid], nullHandler, errorHandler);
        },
        DeleteSingleAscSpecValueCaptureByBarcode: function(barcode, projectid) {
            db.transaction(function (transaction) {
                transaction.executeSql('Delete from AscSpecValueCapture where AssetCode = ? and ProjectID = ?', [barcode, projectid], this.nullHandler, this.errorHandler);
            });
        },
        GetAreas: function(callback) {
            db.transaction(function (transaction) {
                transaction.executeSql('Select AreaCode, Description from AlsInfraArea', [], callback, this.errorHandler);
            });
        },
        GetPhotos: function(callback) {
            db.transaction(function (transaction) {
                transaction.executeSql('Select AssetBarCode, Path, ProjectID from Photo', [], callback, this.errorHandler);
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
        GetOldAssetsByBarcode: function(callback, barcode, projectid) {
            db.transaction(function (transaction) {
                transaction.executeSql('Select * from AscAssetCaptureOld where AssetBarCode = ? and ProjectID = ?', [barcode, projectid], callback, this.errorHandler);
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
        GetAssetTypeByHierarchyID: function(callback, HierarchyID) {
            db.transaction(function (transaction) {
                transaction.executeSql('Select * from CseAssetType where HierarchyID = ? order by TypeDescription', [HierarchyID], callback, this.errorHandler);
            });
        },
        GetAssetTypeByTypeCode: function(callback, TypeCode) {
            db.transaction(function (transaction) {
                transaction.executeSql('Select * from CseAssetType where TypeCode = ?', [TypeCode], callback, this.errorHandler);
            });
        },
        GetAssetCaptureByBarcode: function(callback, barcode, projectid) {
            db.transaction(function (transaction) {
                transaction.executeSql("Select * from AscAssetCapture where AssetBarCode = ? and ProjectID = ?", [barcode, projectid], callback, this.errorHandler);
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
        GetSpecCapture: function(callback, Barcode, projectid) {
            db.transaction(function (transaction) {
                transaction.executeSql('SELECT * FROM AscSpecValueCapture where AssetCode = ? and ProjectID = ?', [Barcode, projectid], callback, errorHandler);
            });
        },
        ReCreateAssetCapture: function() {
            db.transaction(function (tx) {
                tx.executeSql('DROP TABLE IF EXISTS AscAssetCapture', [], nullHandler, errorHandler);
                tx.executeSql('CREATE TABLE IF NOT EXISTS AscAssetCapture(AssetBarCode TEXT NOT NULL, GroupingName TEXT, OldBarCode TEXT, Description TEXT, AssetHierarchyID INTEGER, AssetTypeID TEXT, CustodianName TEXT, Condition TEXT, Make TEXT, Model TEXT, RegistrationNumber TEXT, SerialNumber TEXT, QTY INTEGER, Username TEXT, RoomCode TEXT, TitleDeedNumber TEXT, AssetID INTEGER, ParentBarCode TEXT, Photo BLOB, ProjectID TEXT NOT NULL, PRIMARY KEY ( AssetBarCode, ProjectID) )', [], nullHandler, errorHandler);
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
        GetRoom: function(callback, RoomCode) {
            db.transaction(function (transaction) {
                transaction.executeSql('SELECT RoomCode, RoomDescription, BuildingCode, Username FROM AlsRoom where RoomCode = ?', [RoomCode], callback, errorHandler);
            });
        },
        GetUsers: function(callback) {
            db.transaction(function (transaction) {
                transaction.executeSql('SELECT Username, ifnull(EmployeeName,"") || " " || ifnull(Surname,"") as Name FROM AMSUser order by EmployeeName asc', [], callback, errorHandler);
            });
        },
        GetUser: function(callback, Username) {
            db.transaction(function (transaction) {
                transaction.executeSql('SELECT Username, ifnull(EmployeeName,"") || " " || ifnull(Surname,"") as Name FROM AMSUser where Username = ?', [Username], callback, errorHandler);
            });
        },
        GetProjects: function(callback) {
            db.transaction(function (transaction) {
                transaction.executeSql('SELECT ID, Name FROM AscScanProject', [], callback, errorHandler);
            });
        },
        GetConGroupingByHeaderID: function(callback, HeaderID) {
            db.transaction(function (transaction) {
                transaction.executeSql('Select * from ConGrouping where HeaderID = ?', [HeaderID], callback, errorHandler);
            });
        },
        GetConCriteriaByGroupID: function(callback, GroupID) {
            db.transaction(function (transaction) {
                transaction.executeSql('Select c.Description as CritDescription, c.ID as ID, g.Description as GroupDescription, c.Rating as Rating, c.GroupID as GroupID from ConCriteriaLine as c inner join ConGrouping as g on c.GroupID = g.ID where c.GroupID = ?', [GroupID], callback, errorHandler);
            });
        },
        UpdateAssesmentCapture: function(callback, transaction, barcode, projectid, overallRating, newCondition, oldCondition, finalScore, tranDate, capturedBy, roomCode) {
            transaction.executeSql('UPDATE ConAssessmentCapture set OverallRating = ?, NewCondition = ?, OldCondition = ?, FinalScore = ?, TranDate = ?,CapturedBy = ?,RoomCode = ? where AssetBarCode = ? and ProjectID = ?', [overallRating, newCondition, oldCondition, finalScore, tranDate, capturedBy, roomCode, barcode, projectid], callback, errorHandler);
        
        },
        InsertAssesmentCapture: function(transaction, barcode, projectid, overallRating, newCondition, oldCondition, finalScore, tranDate, capturedBy, roomCode) {
            transaction.executeSql('INSERT INTO ConAssessmentCapture (AssetBarCode, ProjectID, OverallRating, NewCondition, OldCondition, FinalScore, TranDate, CapturedBy, RoomCode) VALUES (?,?,?,?,?,?,?,?,?)', [barcode, projectid, overallRating, newCondition, oldCondition, finalScore, tranDate, capturedBy, roomCode], nullHandler, errorHandler);
        },
    }
});