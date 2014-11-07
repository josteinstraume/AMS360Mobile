define(["kendo", "app/data", "app/utils"], function (kendo, data, utils) {
    var PopulateList = function() {
        var htmlSelect = "";
        var callback = function(tx, result) {
            if (result != null && result.rows != null) {
                for (var i = 0; i < result.rows.length; i++) {
                    var row = result.rows.item(i);
                    htmlSelect += "<li><a onclick=app.views.project.GotoCapture('" + row.ID + "') class='km-listview-link' data-role='listview-link'>" + row.Name + "</a></li>";
                }
              
                $("#project-listview").html(htmlSelect);
            }
        }
        data.GetProjects(callback);
    }
    var GotoCapture = function GotoCapture(project) {
       
        utils.project = project;
        utils.navigate("#LocationView");
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