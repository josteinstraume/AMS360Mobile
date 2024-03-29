define([], function () {
    var _kendoApp;

    return {
        grouping: "",
        area: "",
        project: "",
        room: "",
        lastScanField: "",
        selectedBarcode: "",
        mFeatureLine: null,
        mFeaturePoint: null,
        mFeaturePolygon: null,
        init: function (kendoApp) {
            _kendoApp = kendoApp;
        },

        parseQueryStringToObject: function () {
            var argsParsed = {},
            arg,
            kvp,
            hash = document.location.hash;

            if (!hash || hash.length == 0) {
                return argsParsed;
            }
            var args = document.location.hash.split('?');
            if (args.length < 2) {
                return argsParsed;
            }
            args = args[1].split('&');
            
            for (i=0; i < args.length; i++) {
                arg = decodeURIComponent(args[i]);
            
                if (arg.indexOf('=') == -1) {
                    argsParsed[arg.trim()] = true;
                }
                else {
                    kvp = arg.split('=');
                    var val = kvp[1].trim();
                    argsParsed[kvp[0].trim()] = isNaN(val) ? val : parseFloat(val);
                }
            }
            return argsParsed;
        },
     
        
        setViewTitle: function (view, title) {
            view.data("kendoMobileView").title = title;
            var navbar = view.find(".km-navbar").data("kendoMobileNavBar");
            if (navbar) {
                navbar.title(title);
            }
        },

        navigate: function (location) {
            _kendoApp.navigate(location);
        },

        redirect: function (location) {
            _kendoApp.pane.history.pop();
            _kendoApp.navigate(location);
        },

        scrollViewToTop: function (viewElement) {
            viewElement.data("kendoMobileView").scroller.reset();
        },
        
        showLoading: function (message) {
            $(".loading-message").text(message ? message : "Loading...");
            _kendoApp.showLoading();
        },
        
        hideLoading: function () {
            _kendoApp.hideLoading();
        },

      
         showLayer: function () {
            $("#LayerSelectionPage").show().data().kendoMobileModalView.open();
        },

        showError: function (message, error) {
            var errorMessage = message + (error === undefined ? "" : "\n" + error.status + ": " + error.statusText);
            $("#error-view .message").text(errorMessage);
            $("#error-view").show().data().kendoMobileModalView.open();
        },

        closeError: function () {
            $("#error-view").data().kendoMobileModalView.close();
        },
      
        closeSpec: function () {
            $("#SpecSelectionPage").data().kendoMobileModalView.close();
        },
        closeLayer: function () {
            $("#LayerSelectionPage").data().kendoMobileModalView.close();
        },
        closeAllPopovers: function() {
            $(".km-popup").each(function (idx, item) {
                var popover = $(item).data().kendoMobilePopOver;
                if (popover) {
                    popover.close();
                }
            });
        },
        ServiceURL: "",
        ImageURL:""
    };
});