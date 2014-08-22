define(["kendo", "app/account", "app/utils", "libs/jquery.geo-1.0.0-b1.5.min", "app/data", "app/app"], function (kendo, account, utils, geo, data, app) {
    var AllLayers = new Array();
    var DislayLayers = new Array();
    var NonDislayLayers = new Array();

    var mFeatureLineRem;
    var mFeaturePointRem;
    var mFeaturePolygonRem;

    var lastFeature;
    var lastAddedFeature;

    var geomap;
    var SelectedAssetCode;
    var Grouping;
    var areaCode;
    function setClassificationTextboxes(TypeCode) {
        var typecallback = function(tx, result) {
            if (result != null && result.rows != null) {
                var row = result.rows.item(0);
                
                $("#AssetTypeTextbox").val(row.TypeDescription);
                $("#AssetTypeIDTextbox").val(row.TypeCode);
                var classcallback = function(txx, resultClass) {
                    if (resultClass != null && resultClass.rows != null) {
                        var row = resultClass.rows.item(0);
                        $("#ClassificationTextbox").val(row.Description);
                        $("#ClassificationIDTextbox").val(row.ID);
                    }
                }
                data.GetClassificationByID(classcallback, row.HierarchyID);
            }
        }
        data.GetAssetTypeByTypeCode(typecallback, TypeCode);
    }

    function setFields(barcode) {
        var getOldAsset = function(tx, result) {
            if (result != null && result.rows != null) {
                if (result.rows.length > 0) {
                    var row = result.rows.item(0);
                    $("#OldBarcodeTextbox").val(row.OldBarCode);
                    $("#IDTextbox").val(row.AssetID);
                    $("#DescriptionTextbox").val(row.Description);
                    setClassificationTextboxes(row.AssetTypeID);
                    $("#ConditionSelect").val(row.Condition).attr('selected', true).siblings('option').removeAttr('selected');
                
                    SelectedAssetCode = row.AssetBarCode;

                    //Do the Specs
                    var getSpecValue = function(tx, resultSpec) {
                        var htmlString = '';

                        if (resultSpec != null && resultSpec.rows != null) {
                            for (var i = 0; i < resultSpec.rows.length; i++) {
                                var row = resultSpec.rows.item(i);
                               
                                htmlString += "<div><div ><input type='hidden' value='" + row.Description + "' /><label for='spec" + row.SpecID + "'>" + row.Description + ":</label></div><div style='display: inline-block;width: 90%;'><input class='ipin-textbox' type='text' name='spec" + row.SpecID + "' id='spec" + row.SpecID + "' value='" + row.SpecValue + "' /></div><div style='display: inline-block;'><input data-role='button' type='button' onclick='app.views.captureinfra.showSpecList(" + row.SpecID + ")' value='...' id='" + row.ID + "' name='" + row.ID + "'></input></div></div>";
                                $("#SpecFields").html(htmlString).trigger("create");
                            }
                        }
                    }
                    data.GetSpecValueByBarcode(getSpecValue, barcode);
                }
                else {
                    $("#OldBarcodeTextbox").val("");
                    $("#IDTextbox").val("");
                    $("#DescriptionTextbox").val("");
                    $("#ClassificationTextbox").val("");
                    $("#AssetTypeTextbox").val("");
                    $("#ConditionSelect").val('default').attr('selected', true).siblings('option').removeAttr('selected');
                    $("#SpecFields").html('');
                }
            }
        }
        data.GetOldAssetsByBarcode(getOldAsset, barcode);
    }
    var showSpecList = function(specID) {
        var specIDelement = "spec" + specID;
        var callback = function(tx, resultSpecValue) {
            var htmlString = '';

            if (resultSpecValue != null && resultSpecValue != null) {
                for (var j = 0; j < resultSpecValue.rows.length; j++) {
                    var rowValue = resultSpecValue.rows.item(j);
                    htmlString += "<input type='button' data-role='button' class='ipin-button' onclick='app.views.captureinfra.PopulateField(\"" + specIDelement + "\", \"" + rowValue.Description + "\")' value='" + rowValue.Description + "'></input>";
                }
            }

            $("#SpecSelectionPage").show().data().kendoMobileModalView.open();
            $("#SpecSelectionList").html(htmlString).trigger("create");
        }
        data.GetAssetTypeSpecValuebySpectID(callback, specID);
    }
    var PopulateField = function(SpecID, SpecValue) {
        utils.closeSpec();
        document.getElementById(SpecID).value = SpecValue;
    }
    function setConditionSelect() {
        var callback = function(tx, result) {
            var htmlSelect;
            htmlSelect = "<option value='default'>--Select Condition--</option>";
            if (result != null && result.rows != null) {
                for (var i = 0; i < result.rows.length; i++) {
                    var row = result.rows.item(i);
                    htmlSelect += "<option value=" + row.Description + ">" + row.Description + "</option>";
                }
                $("#ConditionSelect").html(htmlSelect);
                $("#ConditionSelect").val('default').attr('selected', true).siblings('option').removeAttr('selected');
            }
        }
           
        data.setCondition(callback);
    }
   
    function RestoreLastFeature() {
        $(".geomap").geomap("remove", lastFeature);
        if (lastFeature.properties.ISVERIFIED == 0 || lastFeature.properties.ISVERIFIED == null) {
            if (lastFeature.geometry.type == "Point") {
                $(".geomap").geomap("append", lastFeature, { color: "blue", width: 12, height: 12 });
            }
            else {
                $(".geomap").geomap("append", lastFeature, { color: "blue" });
            }
        }
        else {
            if (lastFeature.geometry.type == "Point") {
                $(".geomap").geomap("append", lastFeature, { color: "green", width: 12, height: 12 });
            }
            else {
                $(".geomap").geomap("append", lastFeature, { color: "green" });
            }
        }
    }
    $("#BarcodeTextbox").focusout(function () {
        var barcode = $("#BarcodeTextbox").val();

        setFields(barcode);
        //First lines
        for (var geomKey in utils.mFeatureLine.features) {
            if (utils.mFeatureLine.features[geomKey].properties.BARCODE == barcode) {
                RestoreLastFeature();

                $(".geomap").geomap("remove", utils.mFeatureLine.features[geomKey]);
                if (utils.mFeatureLine.features[geomKey].geometry.type == "Point") {
                    $(".geomap").geomap("append", utils.mFeatureLine.features[geomKey], { color: "yellow" });
                }
                else {
                    $(".geomap").geomap("append", utils.mFeatureLine.features[geomKey], { color: "yellow", width: 12, height: 12 });
                }

                $(".geomap").geomap("refresh", true);

                break;
            }
        }
        $(".geomap").geomap("refresh", true);
    });
   
    function getGisDataLine() {
        $.ajax(utils.ServiceURL + "/GetGIS/" + utils.area + "/" + utils.grouping + "/Line", {
            beforeSend: function (xhr) {
            },
            complete: function () {
                $(".geomap").geomap("refresh", true);
            },
            contentType: 'application/json',
            dataType: 'json',
            type: 'GET',
            error: function (xhr, status, text) {
                utils.showError("Error downloading lines", xhr);
            },
            success: function (result) {
                utils.mFeatureLine = result;
                for (var geomKey in utils.mFeatureLine.features) {
                    if (utils.mFeatureLine.features[geomKey].properties.ISVERIFIED == 1) {
                        geomap.geomap("append", utils.mFeatureLine.features[geomKey], false, { color: "green" });
                    }
                    else {
                        geomap.geomap("append", utils.mFeatureLine.features[geomKey], false, { color: "blue" });
                    }
                }
                $(".geomap").geomap("refresh", true);
            }

        });
    }
    function getGisDataPoint() {
        $.ajax(utils.ServiceURL + "/GetGIS/" + utils.area + "/" + utils.grouping + "/Point", {
            beforeSend: function (xhr) {
            },
            complete: function () {
                $(".geomap").geomap("refresh", true);
            },
            contentType: 'application/json',
            dataType: 'json',
            type: 'GET',
            error: function (xhr, status, text) {
                utils.showError("Error downloading points", xhr);
            },
            success: function (result) {
                utils.mFeaturePoint = result;
                for (var geomKey in utils.mFeaturePoint.features) {
                    if (utils.mFeaturePoint.features[geomKey].properties.ISVERIFIED == 1) {
                        geomap.geomap("append", utils.mFeaturePoint.features[geomKey], false, { color: "green", width: 12, height: 12 });
                    }
                    else {
                        geomap.geomap("append", utils.mFeaturePoint.features[geomKey], false, { color: "blue", width: 12, height: 12 });
                    }
                }
                $(".geomap").geomap("refresh", true);
            }

        });
    }
    function getGisDataPolygon() {
        $.ajax(utils.ServiceURL + "/GetGIS/" + utils.area + "/" + utils.grouping + "/Polygon", {
            beforeSend: function (xhr) {
            },
            complete: function () {
                $(".geomap").geomap("refresh", true);
            },
            contentType: 'application/json',
            dataType: 'json',
            type: 'GET',
            error: function (xhr, status, text) {
                utils.showError("Error downloading polygons", xhr);
            },
            success: function (result) {
                utils.mFeaturePolygon = result;
                for (var geomKey in utils.mFeaturePolygon.features) {
                    if (utils.mFeaturePolygon.features[geomKey].properties.ISVERIFIED == 1) {
                        geomap.geomap("append", utils.mFeaturePolygon.features[geomKey], false, { color: "green" });
                    }
                    else {
                        geomap.geomap("append", utils.mFeaturePolygon.features[geomKey], false, { color: "blue" });
                    }
                }
                $(".geomap").geomap("refresh", true);
            }

        });
    }
    
    function ClearFields() {
        try {
            $("#BarcodeTextbox").val("");
            $("#OldBarcodeTextbox").val("");
            $("#DescriptionTextbox").val("");
            $("#ClassificationTextbox").val("");
            $("#ClassificationIDTextbox").val("");
            $("#AssetTypeTextbox").val("");
            $("#AssetTypeIDTextbox").val("");
             
            $("#ConditionSelect").val('default').attr('selected', true).siblings('option').removeAttr('selected');
            $("#SpecFields").html('');
             
            $('#AssetImage').prop('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==');
        }
        catch (e) {
        }
    }
  
    function setupPage() {
        //Clear everything
        ClearFields();
        setMap();
       
        var callback = function(tx, result) {
            if (result != null && result != null) {
                for (var j = 0; j < result.rows.length; j++) {
                    var rowValue = result.rows.item(j);
                    DislayLayers[j] = rowValue.TypeCode;
                    AllLayers[j] = rowValue.TypeCode;
                }
                $("#ModeDisplay").html("Selected Mode: Verification");
                $(".geomap").geomap("refresh", true);
            }
        }
        if (utils.grouping == "Roads") {
            data.GetAssetTypeByGrouping(callback, 'ROA');
        }
        else if (utils.grouping == "Railway") {
            data.GetAssetTypeByGrouping(callback, 'RAI');
        }
        else if (utils.grouping == "Sanitation") {
            data.GetAssetTypeByGrouping(callback, 'SAN');
        }
        else if (utils.grouping == "Electricity") {
            data.GetAssetTypeByGrouping(callback, 'ELE');
        }
        else if (utils.grouping == "Building") {
            data.GetAssetTypeByGrouping(callback, 'BUI');
        }
        else if (utils.grouping == "Land") {
            data.GetAssetTypeByGrouping(callback, 'LAN');
        }
    }
    
    function setMap() {
        var Zoom;
        var LatExt;
        var LongExt;
        var GetArea = function(tx, result) {
            if (result != null && result.rows != null) {
                var row = result.rows.item(0);
                Zoom = row.Zoom;
                LatExt = row.LatExt;
                LongExt = row.LongExt;
                
                geomap = $(".geomap").geomap({
                    center: [LatExt, LongExt],
                    zoom: Zoom,
                    mode: "find",
                    cursors: { find: "crosshair" },
                    shape: function (e, geo) {
                        ClearFields();
                        if (lastFeature != null) {
                            RestoreLastFeature();
                        }
                        if (lastAddedFeature != null) {
                            $(".geomap").geomap("remove", lastAddedFeature);
                        }

                        if (geo.type == "Point") {
                            $(".geomap").geomap("append", geo, { color: "orange", width: 12, height: 12 });
                        }
                        else {
                            $(".geomap").geomap("append", geo, { color: "orange" });
                        }
                     
                        lastAddedFeature = geo;
                    },
                    click: function (e, geo) {
                        utils.showLoading("Loading");
                        var outputHtml = "";
                        result = geomap.geomap("find", geo, 8);

                        $.each(result, function () {
                            if (lastFeature != null) {
                                $(".geomap").geomap("remove", lastFeature);
                                if (lastFeature.properties.ISVERIFIED == 0 || lastFeature.properties.ISVERIFIED == null) {
                                    if (lastFeature.geometry.type == "Point") {
                                        $(".geomap").geomap("append", lastFeature, { color: "blue", width: 12, height: 12 });
                                    }
                                    else {
                                        $(".geomap").geomap("append", lastFeature, { color: "blue" });
                                    }
                                }
                                else {
                                    if (lastFeature.geometry.type == "Point") {
                                        $(".geomap").geomap("append", lastFeature, { color: "green", width: 12, height: 12 });
                                    }
                                    else {
                                        $(".geomap").geomap("append", lastFeature, { color: "green" });
                                    }
                                }
                            }

                            $(".geomap").geomap("remove", this);
                            if (this.geometry.type == "Point") {
                                $(".geomap").geomap("append", this, { color: "yellow", width: 12, height: 12 });
                            }
                            else {
                                $(".geomap").geomap("append", this, { color: "yellow" });
                            }

                            $(".geomap").geomap("refresh", true);
                            lastFeature = this;
                            console.log(lastFeature);
                            $("#BarcodeTextbox").val(this.properties.BARCODE);
                            //See if asset exists in AscAssetCaptureOld
                            var barcode = this.properties.BARCODE;

                            $('#AssetImage').attr('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==');
                            setFields(barcode);

                            //check to see if this item has been verified
                            if (this.properties.ISVERIFIED == 0 || this.properties.ISVERIFIED == null) {
                                this.properties.ISVERIFIED = 0;
                            }
                        });
                        $(".geomap").geomap("refresh", true);
                        utils.hideLoading();
                    }
                });
                getGisDataLine();
                getGisDataPoint();
                getGisDataPolygon();
                setConditionSelect();
            }
        }
      
        data.GetSingleArea(GetArea, utils.area);
    }
    $("#GetLocation").click(function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        }
        else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    });

    function showPosition(position) {
        $(".geomap").geomap({
            center: [position.coords.latitude, position.coords.longitude],
            zoom: 10
        });
        $(".geomap").geomap("append", { type: "Point", coordinates: [position.coords.longitude, position.coords.latitude] })
        $(".geomap").geomap("refresh", true);
    }

    $("#PhotoButton").click(function () {
        var options = {
            quality : 50,
            destinationType : Camera.DestinationType.FILE_URI,
            sourceType : Camera.PictureSourceType.CAMERA,
            allowEdit : false,
            correctOrientation: false
        } 
        navigator.camera.getPicture(onSuccess, onFail, options);

        function onSuccess(imageData) {
            var image = document.getElementById('AssetImage');
            image.src = imageData;
         
            data.InsertPhoto($('#BarcodeTextbox').val(), imageData);
        }

        function onFail(message) {
            utils.showError(message);
        }
    });
    $("#RefreshMapButton").click(function () {
        $(".geomap").geomap("refresh", true);
    });
    $("#NewLineButton").click(function () {
        $("#ModeDisplay").html("Selected Mode: Add New Line");
        geomap.geomap("option", "mode", "drawLineString");
    });
    $("#NewPointButton").click(function () {
        $("#ModeDisplay").html("Selected Mode: Add New Point");
        geomap.geomap("option", "mode", "drawPoint");
    });
    $("#NewPolygonButton").click(function () {
        $("#ModeDisplay").html("Selected Mode: Add New Polygon");
        geomap.geomap("option", "mode", "drawPolygon");
    });
    $("#VerificationModeButton").click(function () {
        $("#ModeDisplay").html("Selected Mode: Verification");
        if (lastAddedFeature != null) {
            $(".geomap").geomap("remove", lastAddedFeature);
            lastAddedFeature = null;
        }
        geomap.geomap("option", "mode", "find");
    });

    /////////////////////////////////////////////Capture features/////////////////////////////////////////////////////
    $("#StartLineCaptureButton").click(function () {
        utils.showLoading("Loading");
        $("#ModeDisplay").html("Selected Mode: Add New Line");
        geomap.geomap("option", "mode", "drawLineString");

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(BeginLine);
        }
        else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    });

    var LinePoints;

    function BeginLine(position) {
        //we clear the lastFeature
        if (lastFeature != null) {
            RestoreLastFeature();
            ClearFields();
        }
        PointCounter = 0;
        if (lastAddedFeature != null) {
            $(".geomap").geomap("remove", lastAddedFeature);
        }
        LinePoints = new Array();
        $(".geomap").geomap({center: [position.coords.longitude, position.coords.latitude]});
        LinePoints[0] = [position.coords.longitude, position.coords.latitude];
        PointCounter = PointCounter + 1;
        utils.hideLoading();
    }
    $("#LineCaptureButton").click(function () {
        utils.showLoading("Loading");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(AddLineCoordinate);
        }
        else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    });

    var PointCounter = 0;

    function AddLineCoordinate(position) {
        if (LinePoints != null) {
            $(".geomap").geomap({center: [position.coords.longitude, position.coords.latitude]});
            LinePoints[PointCounter] = [position.coords.longitude, position.coords.latitude];
        }

        utils.hideLoading();
    }
    $("#EndLineCaptureButton").click(function () {
        utils.showLoading("Loading");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(EndLine);
        }
        else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    });
    function EndLine(position) {
        LinePoints[PointCounter] = [position.coords.longitude, position.coords.latitude];

        lastAddedFeature = { type: "LineString", coordinates: LinePoints };
        $(".geomap").geomap({center: [position.coords.longitude, position.coords.latitude]});
        $(".geomap").geomap("append", lastAddedFeature, { color: "orange" })
        $(".geomap").geomap("refresh", true);
        LinePoints = null;
        utils.hideLoading();
    }
    $("#PointCaptureButton").click(function () {
        utils.showLoading("Loading");
        $("#ModeDisplay").html("Selected Mode: Add New Point");
        geomap.geomap("option", "mode", "drawPoint");

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPoint);
        }
        else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    });
    function showPoint(position) {
        //we clear the lastFeature
        ClearFields();
        if (lastFeature != null) {
            RestoreLastFeature();
        }
        if (lastAddedFeature != null) {
            $(".geomap").geomap("remove", lastAddedFeature);
        }
        lastAddedFeature = { type: "Point", coordinates: [position.coords.longitude, position.coords.latitude] };
        $(".geomap").geomap({center: [position.coords.longitude, position.coords.latitude]});
        $(".geomap").geomap("append", lastAddedFeature, { color: "orange", width: 12, height: 12 })
        $(".geomap").geomap("refresh", true);

        utils.hideLoading();
    }

    /////////////////////////////////////////////End Capture features/////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////Layer Selection///////////////////////////////////////////////////////////////////////////////
    $('#SelectAllButton').click(function () {
        $("#LayerList input[type='checkbox']").each(function(n) {
            $(this).prop("checked", "checked");
        });
    });

    $('#DeselectAllButton').click(function () {
        $("#LayerList input[type='checkbox']").each(function(n) {
            $(this).prop("checked", "");
        });
    });
    $("#SelectLayerButton").click(function () {
        var callback = function(tx, result) {
            var htmlString = '';
            if (result != null && result != null) {
                for (var j = 0; j < result.rows.length; j++) {
                    var rowValue = result.rows.item(j);
                    var IsDisplay = false;
                    for (var i = 0; i < DislayLayers.length; i++) {
                        if (DislayLayers[i] == rowValue.TypeCode) {
                            IsDisplay = true;
                            break;
                        }
                    }
                   
                    if (IsDisplay) {
                        htmlString += "<li><label style='font-size:1.1em;'><input  type='checkbox' checked='checked' id='" + rowValue.TypeCode + "checkbutton'  />" + rowValue.TypeDescription + "</label></li>";
                    }
                    else {
                        htmlString += "<li><label style='font-size:1.1em;'><input type='checkbox' id='" + rowValue.TypeCode + "checkbutton'  />" + rowValue.TypeDescription + "</label></li>";
                    }
                }
                $("#LayerList").html(htmlString);
            }
        }
       
        if ($('#LayerList').html() == '') {
            if (utils.grouping == "Roads") {
                data.GetAssetTypeByGrouping(callback, 'ROA');
            }
            else if (utils.grouping == "Railway") {
                data.GetAssetTypeByGrouping(callback, 'RAI');
            }
            else if (utils.grouping == "Sanitation") {
                data.GetAssetTypeByGrouping(callback, 'SAN');
            }
            else if (utils.grouping == "Electricity") {
                data.GetAssetTypeByGrouping(callback, 'ELE');
            }
            else if (utils.grouping == "Building") {
                data.GetAssetTypeByGrouping(callback, 'BUI');
            }
            else if (utils.grouping == "Land") {
                data.GetAssetTypeByGrouping(callback, 'LAN');
            }
        }
      
        utils.navigate("#LayerSelectionPage")
    });

    $('#ApplyLayerButton').click(function () {
        DislayLayers.length = 0;
        NonDislayLayers.length = 0;

        var LayerInputs = $('#LayerList');
        if (LayerInputs.length) {
            var inputs = LayerInputs.find('input');
        }
      
        for (var i = 0; i < inputs.length; i++) {
            console.log(inputs[i].checked);
            if (inputs[i].checked) {
                DislayLayers[i] = inputs[i].id.replace("checkbutton", "");
            }
            else {
                NonDislayLayers[i] = inputs[i].id.replace("checkbutton", "");
            }
        }
        var counter = 0;
        //Clear the map
        $(".geomap").geomap("empty", false);
        //First put back the removed features on Map
        for (var geomKey in utils.mFeaturePolygon.features) {
            if (utils.mFeaturePolygon.features[geomKey].properties.ISVERIFIED == 1) {
                geomap.geomap("append", utils.mFeaturePolygon.features[geomKey], false, { color: "green" });
            }
            else {
                geomap.geomap("append", utils.mFeaturePolygon.features[geomKey], false, { color: "blue" });
            }
        }
        for (var geomKey in utils.mFeatureLine.features) {
            if (utils.mFeatureLine.features[geomKey].properties.ISVERIFIED == 1) {
                geomap.geomap("append", utils.mFeatureLine.features[geomKey], false, { color: "green" });
            }
            else {
                geomap.geomap("append", utils.mFeatureLine.features[geomKey], false, { color: "blue" });
            }
        }
        for (var geomKey in utils.mFeaturePoint.features) {
            if (utils.mFeaturePoint.features[geomKey].properties.ISVERIFIED == 1) {
                geomap.geomap("append", utils.mFeaturePoint.features[geomKey], false, { color: "green", width: 12, height: 12 });
            }
            else {
                geomap.geomap("append", utils.mFeaturePoint.features[geomKey], false, { color: "blue", width: 12, height: 12 });
            }
        }
        geomap.geomap("refresh", true);
        //Remove features from normal collections and put them in Remove Collections
        //Polygon
        for (var geomKey in utils.mFeaturePolygon.features) {
            for (var i = 0; i < NonDislayLayers.length; i++) {
                if (utils.mFeaturePolygon.features[geomKey].properties.TYPECODE == NonDislayLayers[i]) {
                    geomap.geomap("remove", utils.mFeaturePolygon.features[geomKey]);
                }
            }
        }
        //Line
        for (var geomKey in utils.mFeatureLine.features) {
            for (var i = 0; i < NonDislayLayers.length; i++) {
                if (utils.mFeatureLine.features[geomKey].properties.TYPECODE == NonDislayLayers[i]) {
                    geomap.geomap("remove", utils.mFeatureLine.features[geomKey]);
                }
            }
        }
        //Point
        for (var geomKey in utils.mFeaturePoint.features) {
            for (var i = 0; i < NonDislayLayers.length; i++) {
                if (utils.mFeaturePoint.features[geomKey].properties.TYPECODE == NonDislayLayers[i]) {
                    geomap.geomap("remove", utils.mFeaturePoint.features[geomKey]);
                }
            }
        }
        // $(".geomap").geomap("refresh", true);
        utils.navigate("#CaptureView");
    });

    ////////////////////////////////////////////////////////////////////////Layer Selection END///////////////////////////////////////////////////////////////////////////////
    function Validation() {
        if ($("#BarcodeTextbox").val() == '') {
            utils.showError("Asset Barcode is required");
            return false;
        }
        if ($("#ClassificationTextbox").val() == '') {
            utils.showError("Classification is required");
            return false;
        }
        if ($("#AssetTypeTextbox").val() == '') {
            utils.showError("Asset Type is required");
            return false;
        }
        if ($("#DescriptionTextbox").val() == '') {
            utils.showError("Description is required");
            return false;
        }
        if ($("#ConditionSelect").val() == 'default') {
            utils.showError("Condition is required");
            return false;
        }
        if (lastFeature == null && lastAddedFeature == null) {
            utils.showError("You must add a new feature or select an existing one");
            return false;
        }
        return true;
    }
    $("#SubmitButton").click(function () {
        var AssetBarCode = $('#BarcodeTextbox').val();
        var OldBarcode = $('#OldBarcodeTextbox').val();
        var Description = $('#DescriptionTextbox').val();
        var ClassID = $('#ClassificationIDTextbox').val();
        var AssetTypeID = $('#AssetTypeIDTextbox').val();
        var Condition = $('#ConditionSelect').val();
        try {
            if (!Validation())
                return;
            var assetgetcallback = function(transaction, result) {
                if (result != null && result.rows != null) {
                    var rows = result.rows;
                    if (rows.length > 0) {//Does exists
                        console.log("Update");
                        //Check if it is an added feature
                        if (lastAddedFeature != null) {
                            utils.showError("You have tried to capture a new asset but the barcode already exists. Set the the mode to verification to capture an existing asset.");
                            return;
                        }
                        var updateassetcallback = function(tx, result) {
                            var get_tags = document.getElementById("SpecFields").getElementsByTagName("input");

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
                                    mSpecsDescriptions[Descriptioncount] = get_tags[i].value;
                                    Descriptioncount++;
                                }
                            }
                            //only do this if specs exists
                            if (mSpecIDs.length > 0) {
                                var speclinkcallback = function(tx, linkresult) {
                                    //check to see if asset type has changed
                                    if (linkresult != null && linkresult.rows != null) {
                                        var rows = linkresult.rows;
                                        if (rows.length > 0) {
                                            if (rows.item(0).TypeCode == AssetTypeID) {
                                                //Here we know the asset type has not changed. Do normal stuff
                                                var speccallback = function(tx, resultSpecValue) {
                                                    try {
                                                        if (resultSpecValue != null && resultSpecValue.rows != null) {
                                                            for (var i = 0; i < mSpecs.length; i++) {
                                                                var rows = resultSpecValue.rows;
                                                                var updatespecvaluecallback = function(tx, result) {
                                                                }
                                                                data.UpdateSingleAscSpecValueCapture(updatespecvaluecallback, tx, rows.item(i).Description, mSpecs[i], rows.item(i).SpecID, rows.item(i).SpecValueID, rows.item(i).AssetCode);
                                                            }
                                                            DoSuccesJob();
                                                        }
                                                    }
                                                    catch (e) {
                                                        utils.showError("Update of the Specs failed: ", e);
                                                    }
                                                }
                                                data.GetSpecValueByBarcode(speccallback, AssetBarCode);
                                            }
                                            else {
                                                //The asset type has changed. We need to create new specs for this asset. The deletion of the old specs will be done on server side
                                                try {
                                                    for (var i = 0; i < mSpecs.length; i++) {
                                                        data.InsertSingleAscSpecValueCapture(tx, mSpecsDescriptions[i], mSpecs[i], mSpecIDs[i], 0, AssetBarCode);
                                                    }
                                                    DoSuccesJob();
                                                }
                                                catch (e) {
                                                    utils.showError("Insert of the Specs failed: ", e);
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        utils.showError("There is a problem in the spec data setup. Please review the data.");
                                        return;
                                    }
                                }
                               
                                data.GetAssetTypeSpecLinkBySpecID(speclinkcallback, mSpecIDs[0]);
                            }
                        }
                        data.UpdateSingleAssetCapture(updateassetcallback, transaction, OldBarcode, Description, ClassID, AssetTypeID, Condition, document.getElementById('AssetImage').src, AssetBarCode);
                    }
                    else {//Does not exists in AscAssetCapture
                        console.log("Insert");
                        var insertassetcapturecallback = function(tx, result) {
                            var get_tags = document.getElementById("SpecFields").getElementsByTagName("input");

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
                                    mSpecsDescriptions[Descriptioncount] = get_tags[i].value;
                                    Descriptioncount++;
                                }
                            }
                          
                            //Only do this if there is specs
                            if (mSpecs.length > 0) {
                                try {
                                    for (var i = 0; i < mSpecs.length; i++) {
                                        var getSpecValuecallback = (function(i) {
                                            return function(tx, result) {
                                                if (result != null && result.rows != null) {
                                                    if (result.rows.length > 0) {
                                                        data.InsertSingleAscSpecValueCapture(tx, mSpecsDescriptions[i], mSpecs[i], mSpecIDs[i], result.rows.item(0).ID, AssetBarCode);
                                                    }
                                                    else {
                                                        data.InsertSingleAscSpecValueCapture(tx, mSpecsDescriptions[i], mSpecs[i], mSpecIDs[i], 0, AssetBarCode);
                                                    }
                                                }
                                            }
                                        })(i);
                                        data.GetSpecValueByBarcodeAndSpecID(getSpecValuecallback, AssetBarCode, mSpecIDs[i]);
                                    }
                                    DoSuccesJob();
                                }
                                catch (e) {
                                    data.DeleteSingleAssetCapture(AssetBarCode);
                                    data.DeleteSingleAscSpecValueCaptureByBarcode(AssetBarCode);
                                    utils.showError("Insert of the Specs failed: " + e.message);
                                }
                            }
                        }
                        var grouping = "";
                        if (utils.grouping == "Roads") {
                            grouping = "Road";
                        }
                        else if (utils.grouping == "Railway") {
                            grouping = "Railway";
                        }
                        else if (utils.grouping == "Sanitation") {
                            grouping = "Sanitation";
                        }
                        else if (utils.grouping == "Electricity") {
                            grouping = "Electricity";
                        }
                        else if (utils.grouping == "Building") {
                            grouping = "Building";
                        }
                        else if (utils.grouping == "Land") {
                            grouping = "Land";
                        }
                       
                        data.InsertSingleAssetCapture(insertassetcapturecallback, transaction, AssetBarCode, grouping, OldBarcode, Description, ClassID, AssetTypeID, Condition, document.getElementById('AssetImage').src);
                    }
                }
            }
            data.GetAssetCaptureByBarcode(assetgetcallback, AssetBarCode);
        } 
        catch (e) {
            utils.showError("An Error Occurred: " + e.message);
        }
        //ID INTEGER NOT NULL PRIMARY KEY, Description TEXT NOT NULL, SpecValue TEXT, SpecID INTEGER, SpecValueID INTEGER, AssetCode INTEGER, IsCompulsory INTEGER
    });
    function DoSuccesJob() {
        //now we add to Feature Collection if lastAddedFeature is not null
        if (lastAddedFeature != null) {
            lastAddedFeature.geometry = {};
            lastAddedFeature.properties = {};
           
            lastAddedFeature.geometry.coordinates = lastAddedFeature.coordinates;
            lastAddedFeature.properties.ISVERIFIED = 1;
            lastAddedFeature.properties.BARCODE = $('#BarcodeTextbox').val();
            lastAddedFeature.properties.TYPECODE = $('#AssetTypeIDTextbox').val();
            lastAddedFeature.properties.CLASS1 = $('#ClassificationIDTextbox').val();
          
            if (lastAddedFeature.type == "Point") {
                delete lastAddedFeature.type;
                delete lastAddedFeature.coordinates;
                lastAddedFeature.geometry.type = "Point";
                lastAddedFeature.type = "Feature";
                utils.mFeaturePoint.features.push(lastAddedFeature);
            }
            else if (lastAddedFeature.type == "LineString") {
                delete lastAddedFeature.type;
                delete lastAddedFeature.coordinates;
                lastAddedFeature.geometry.type = "LineString";
                lastAddedFeature.type = "Feature";
                utils.mFeatureLine.features.push(lastAddedFeature);
            }
            else if (lastAddedFeature.type == "Polygon") {
                delete lastAddedFeature.type;
                delete lastAddedFeature.coordinates;
                lastAddedFeature.geometry.type = "Polygon";
                lastAddedFeature.type = "Feature";
                utils.mFeaturePolygon.features.push(lastAddedFeature);
            }
          
            //Make lastAddedFeature equals to lastFeature. And clear lastAddedFeature
            lastFeature = lastAddedFeature;
            lastAddedFeature = null;
        }
        else {
            lastFeature.properties.ISVERIFIED = 1;
            lastFeature.properties.BARCODE = $('#BarcodeTextbox').val();
            lastFeature.properties.TYPECODE = $('#AssetTypeIDTextbox').val();
            lastFeature.properties.CLASS1 = $('#ClassificationIDTextbox').val();
        }
    
        $(".geomap").geomap("remove", lastFeature);
        if (lastFeature.geometry.type == "Point") {
            $(".geomap").geomap("append", lastFeature, { color: "green", width: 12, height: 12 });
        }
        else {
            $(".geomap").geomap("append", lastFeature, { color: "green" });
        }
                 
        $(".geomap").geomap("refresh", true);
        lastFeature = null;
                  
        ClearFields();
    }
    
    //Class selection
    $("#ClassificationButton").click(function() {
        var callback = function(tx, result) {
            var htmlSelect = "";
                   
            if (result != null && result.rows != null) {
                for (var i = 0; i < result.rows.length; i++) {
                    var row = result.rows.item(i);
                    htmlSelect += "<li><a onclick=app.views.captureinfra.GoBackFromClass('" + row.ID + "') class='km-listview-link' data-role='listview-link'>" + row.Description + "</a></li>";
                }
                $("#class-listview").html(htmlSelect);
            } 
        } 
        data.GetLowestLevelClassification(callback);
        utils.navigate("#ClassSelectionPage")
    });
    
    var GoBackFromClass = function(ID) {
        var callback = function(tx, result) {
            if (result != null && result.rows != null) {
                var row = result.rows.item(0);
                $("#ClassificationTextbox").val(row.Description);
                $("#ClassificationIDTextbox").val(row.ID);
                $("#AssetTypeTextbox").val('');
                $("#AssetTypeIDTextbox").val('');
                $("#SpecFields").html('');
            }
        }
      
        data.GetClassificationByID(callback, ID);
        
        utils.navigate("#CaptureView")
    }
    $("#AssetTypeButton").click(function() {
        var callback = function(tx, result) {
            var htmlSelect = "";
                  
            if (result != null && result.rows != null) {
                for (var i = 0; i < result.rows.length; i++) {
                    var row = result.rows.item(i);
                    var typecode = row.TypeCode.toString().replace(">", "-");
                    htmlSelect += "<li><a onclick=app.views.captureinfra.GoBackFromAssetType('" + typecode + "') class='km-listview-link' data-role='listview-link'>" + row.TypeDescription + "</a></li>";
                }
                $("#assettype-listview").html(htmlSelect);
            }
        }
        data.GetAssetTypeByHierarchyID(callback, $("#ClassificationIDTextbox").val());
        utils.navigate("#AssetTypeSelectionPage")
    }); 
    var GoBackFromAssetType = function(TypeCode) {
        TypeCode = TypeCode.toString().replace("-", ">");
        var callbackassettype = function(tx, result) {
            if (result != null && result.rows != null) {
                var row = result.rows.item(0);
                $("#AssetTypeTextbox").val(row.TypeDescription);
                $("#AssetTypeIDTextbox").val(row.TypeCode);
                var callbackassethierarchy = function(tx, result) {
                    if (result != null && result.rows != null) {
                        var row = result.rows.item(0);
                        $("#ClassificationTextbox").val(row.Description);
                        $("#ClassificationIDTextbox").val(row.ID);
                    }
                }
                data.GetClassificationByID(callbackassethierarchy, row.HierarchyID);
                   
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
                                    htmlString += "<div><div ><input type='hidden' value='" + row.Description + "' /><label for='spec" + row.ID + "'>" + row.Description + ":</label></div><div style='display: inline-block; width:90%;'><input class='ipin-textbox' type='text' name='spec" + row.ID + "' id='spec" + row.ID + "' value='' /></div><div style='display: inline-block;'><input data-role='button' type='button' onclick='app.views.captureinfra.showSpecList(" + row.ID + ")' value='...' id='" + row.ID + "' name='" + row.ID + "'></input></div></div>";
                                }
                                $("#SpecFields").html(htmlString).trigger("create");
                            }
                        }
                        data.GetAssetTypeSpecByIDs(callbackTypeSpec, IDs);
                    }
                }
                data.GetAssetTypeSpecLinkByTypeCode(callbackspeclink, row.TypeCode);
            }
        }
        data.GetAssetTypeByTypeCode(callbackassettype, TypeCode);
      
        utils.navigate("#CaptureView")
    }

    $("#ClassSearchButton").click(function() {
        var callback = function(tx, result) {
            var htmlSelect = "";
                  
            if (result != null && result.rows != null) {
                for (var i = 0; i < result.rows.length; i++) {
                    var row = result.rows.item(i);
                    htmlSelect += "<li><a onclick=app.views.captureinfra.GoBackFromClass('" + row.ID + "') class='km-listview-link' data-role='listview-link'>" + row.Description + "</a></li>";
                }
                $("#class-listview").html(htmlSelect);
            }
        }
        data.GetLowestLevelClassificationByDescription(callback, $('#ClassSearchTextbox').val());
    });
   
    $("#AssetTypeSearchButton").click(function() {
        var callback = function(tx, result) {
            var htmlSelect = "";
              
            if (result != null && result.rows != null) {
                for (var i = 0; i < result.rows.length; i++) {
                    var row = result.rows.item(i);
                       
                    var typecode = row.TypeCode.toString().replace(">", "-");
                    htmlSelect += "<li><a onclick=app.views.captureinfra.GoBackFromAssetType('" + typecode + "') class='km-listview-link' data-role='listview-link'>" + row.TypeDescription + "</a></li>";
                }
                $("#assettype-listview").html(htmlSelect);
            }
        }
        data.GetAssetTypeByDescription(callback, $('#AssetTypeSearchTextbox').val()); 
    });
    
    return {
        init: function (initEvt) {
            setupPage();
        },
 
        beforeShow: function (beforeShowEvt) {
            // ... before show event code ...
        },
 
        show: function (showEvt) {
        },
        GoBackFromClass: GoBackFromClass,
        GoBackFromAssetType: GoBackFromAssetType,
        showSpecList: showSpecList,
        PopulateField: PopulateField
       
       
    }
});