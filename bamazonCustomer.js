var mysql = require("mysql");
var inquirer = require("inquirer");
var csv = require("csv");
var Table = require("cli-table");
var items = [];

//Connect to database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",
    //T O   D O   S E C U R E   P W 
    // Your password
    
    database: "bamazonDB"
});

//C O N N E C T 
connection.connect(function (err) {
    if (err) throw err;
    //console.log("connected as id " + connection.threadId);
    queryProducts();
});

//S E L E C T   F R O M   P R O D U C T S 
function queryProducts() {

    var sql = "SELECT * from products";
    //console.log("sql: " + sql);
    connection.query(sql, function (err, res) {
        if (err) throw err;
        //console.log(res);
        formatData(res);


    });
}

//F O R M A T   P R O D U C T S  
function formatData(res) {
    //T O   D O   R E P L A C E   ,   &   ""
    //T O   D O   F O R M A T   P R I C E   T O   I N C L U D E   .00   D E C I M A L 
    var dataRowStr = "";
    var dataHeader = "Item,Product,Department,Price,\n"
    /*Inventory, Units Sold, Sales */

    var dataRows = "";
    dataRows = dataHeader;
    for (i = 0; i < res.length; i++) {
        //console.log("price: " + res[i].price);   
        dataRows = dataRows + res[i].item_id + "," +
            res[i].product_name + "," +
            res[i].department_name + "," +
            res[i].price.toFixed(2) + "," +
            /*
                                    res[i].stock_quantity + "," +
                                    res[i].units_sold + "," +
                                    res[i].product_sales.toFixed(2) + 
            */
            "\n";
        items.push(res[i].item_id);
        //console.log("typeof res[i].item_id: " + typeof (res[i].item_id));
        //console.log("items: " + items)
        //dataRows.push(dataRowStr);
    }//end for
    //console.log("items: " + items);
    displayData(dataRows);
}

//D I S P L A Y   P R O D U C T S data using cli-table and csv packages
//T O   D O    
function displayData(dataRows) {
    //console.log(dataRows);
    csv().from.string(dataRows).to.array(function (dataRows) {
        var
            headers = dataRows[0],
            values = dataRows.slice(1),
            table = new Table({ head: headers })
            ;

        table.push.apply(table, values);
        // T A B L E   D I S P L A Y
        console.log(table.toString());
        orderOrExit();
    });
    
}

function orderOrExit() {
    // prompt for info about the item being put up for auction
    inquirer
        .prompt([
            {
                name: "orderOrExit",
                type: "list",
                message: "Welcome to Bamazon",
                choices: ["ORDER", "EXIT"]
            },
        ])
        .then(function(answer) {
            // based on their answer, either call take the order or quit the app
            //console.log("answer: " + answer)
            //console.log("orderOrExit: " + answer.orderOrExit);
             
            if (answer.orderOrExit === "ORDER") {
                //console.log(".then takeorder");    
                takeOrder();
            }
            else{
            console.log("\nThank you. Come again.")
                connection.end();
            }
            });    
}

function takeOrder() {
    //console.log("takeOrder");
                // prompt for info about the item being put up for auction
    inquirer
        .prompt([            
            {
                name: "item",
                type: "input",
                message: "Enter an item number or press [enter] to exit",
                validate: function (value) {
                    //console.log("\nvalue: " + value); 
                    if (value == "") {
                        //console.log("\nvalue: " + value);
                        return true;
                    }//end if
                    /*console.log("items: " + items);
                    console.log("value: " + value);
                    console.log("typeof value: " + typeof (value));
                    console.log("\nincludes: " + items.includes(value));*/
                    var valInt = parseInt(value);
                    if (!items.includes(valInt)) {
                        //console.log("\nincludes: " + items.includes(value));
                        console.log("\n" + value + " is not a valid item number");
                        return false;
                    }//end if
                    return true;
                }//end validate
                 
            }//end 
            
        ])//end prompt
        .then(function (answer) {
            //console.log(".then - answer.item: " + answer.item);
             if (answer.item == "") {
                //console.log(".then - answer.item: " + answer.item); 
                console.log("\nThank you. Come again.")
                connection.end();
             }//end if  
             console.log("Validating...");
             connection.end();
        });//end then
}//end function