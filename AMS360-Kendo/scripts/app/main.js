define(["kendo", "app/account", "app/data", "app/utils"], function (kendo, account, data, utils) {
    return {
        init: function (initEvt) {
            // ... init event code ...
        },
 
        beforeShow: function (beforeShowEvt) {
            console.log(account.userName);
        },
 
        show: function (showEvt) {
            //Check if database is empty
            var callback = function(tx, result) {
                if (result != null && result.rows != null) {
                    if (result.rows.length == 0) {
                         navigator.notification.alert("You need to download lookup data to be able to scan.", null, "Download Data")
                    }
                }
            }
            data.CheckData(callback);
            
             //Check if asset capture has assets
            var callbackCapture = function(tx, result) {
                if (result != null && result.rows != null) {
                    if (result.rows.length > 0) {
                        navigator.notification.alert("There were assets scanned offline. Please upload these assets to the server.", null, "Offline Data")

                    }
                }
            }
            data.CheckAssetCapture(callbackCapture);
            console.log("User2 " + account.userName);
        },
       
    }
});