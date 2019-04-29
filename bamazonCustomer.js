var mysql = require("mysql");
var inquirer = require("inquirer");
var csv = require("csv");
var Table = require("cli-table");

//Connect to database
var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  //T O   D O   S E C U R E   P W 
    // Your password
    password: "Coboldman09!",
    database: "bamazonDB"
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    queryProducts();
  });

//Select data
function queryProducts() {
    //connection.query("SELECT * FROM top5000", function(err, res) {
    var sql = "SELECT * from products";
    console.log("sql: " + sql);
    connection.query(sql, function(err, res) {
    if (err) throw err;
    console.log(res);
    formatData(res);
    
    
});
}

//Format data
function formatData (res) {
    //T O   D O   R E P L A C E   ,   &   ""
    //T O   D O   F O R M A T   P R I C E   T O   I N C L U D E   .00   D E C I M A L 
    var dataRowStr = "";
    var dataHeader = "Item,Product,Department,Price, Inventory, Units Sold\n"
    var dataRows = "";
    dataRows = dataHeader;
    for (i=0; i < res.length; i++) {
        
      dataRows = dataRows + res[i].item_id + "," +
                            res[i].product_name + "," +   
                            res[i].department_name + "," +
                            res[i].price + "," +
                            res[i].stock_quantity + "," +
                            res[i].product_sales + "\n";
        //dataRows.push(dataRowStr);
                
        
    }
    displayData(dataRows);
}

//Display data
function displayData(dataRows) {
    console.log(dataRows);
    csv().from.string(dataRows).to.array(function(dataRows) {
        var
          headers = dataRows[0],
          values = dataRows.slice(1),
          table = new Table({ head: headers })
          ;
      
        table.push.apply(table, values);
        console.log(table.toString());
      });
    connection.end();
}