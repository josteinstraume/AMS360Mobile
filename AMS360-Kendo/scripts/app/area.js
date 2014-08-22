define(["kendo", "app/data", "app/utils"], function (kendo, data, utils) {
    var PopulateList = function() {
        var htmlSelect = "";
        var callback = function(tx, result) {
            if (result != null && result.rows != null) {
                for (var i = 0; i < result.rows.length; i++) {
                    var row = result.rows.item(i);
                    htmlSelect += "<li><a onclick=app.views.area.GotoCapture('" + row.AreaCode + "') class='km-listview-link' data-role='listview-link'>" + row.Description + "</a></li>";
                }
              
                $("#area-listview").html(htmlSelect);
            }
        }
        data.GetAreas(callback);
    }
    var GotoCapture = function GotoCapture(area) {
       
        utils.area = area;
        utils.navigate("#CaptureView");
    }
   
    return {
        init: function (initEvt) {
            // ... init event code ...
        },
 
        beforeShow: function (beforeShowEvt) {
            // ... before show event code ...
        },
 
        show: function (showEvt) {
            PopulateList();
        },
       GotoCapture: GotoCapture
    }
});