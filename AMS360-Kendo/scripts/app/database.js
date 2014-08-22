viewModel = kendo.observable({

    
                                 selectedDatabase: null,
    
                                 // type array populates the drop down
                                 databaseList: [],

                                 // expenseType holds the currently selected value of the dropdown list
                                 expenseType: "food", 

                                 // the values are bound to the merchant and amount fields
                                 merchant: null,
                                 amount: null,

                                 // event to execute on click of add button
                                 create: function(e) {
                                     // add the items to the array of expenses 
                                     this.get("expenses").push({
                                                                   Type: this.get("expenseType"), 
                                                                   Merchant: this.get("merchant"), 
                                                                   Amount: this.get("amount")
                                                               });

                                     // reset the form 
                                     this.set("expenseType", "food");
                                     this.set("merchant", "");
                                     this.set("amount", "");
                                 },
                                 GetDatabases:function(e) {
                                     $.ajax(utils.ServiceURL + "/Databases", {
                                                dataType: 'json',
                                                type: "GET",
                                                beforeSend: function (xhr) {
                                                    xhr.setRequestHeader("Authorization", "Basic " + encodeBase64("hannes:Hans@0507"));
                                                },
                                                error: function (xhr, ajaxOptions, thrownError) {
                                                },
                                                success: function (model) {
                                                    try {
                                                        this.databaseList = model.GetDatabasesResult;
                                                     
                                                    }
                                                    catch (e) {
                                                       
                                                    }
                                                }
                                            });
                                 }
                             });

// apply the bindings
kendo.bind(document.body.children, viewModel);