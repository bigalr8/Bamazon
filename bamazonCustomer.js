var dotenv = require('dotenv').config(); // Package for storing credentials external to code
var mysql = require("mysql");			 // Package for database and SQL	
var inquirer = require("inquirer");		 // Package for predefined command line prompting   
var fs = require("fs");					 // Package for file handling
var csv = require("csv");				 // Package for console table formatting 
var Table = require("cli-table");		 // " 								   "
var util = require('util');				 // Package for Include util built-in package to format file output

//= Global variables =====================================
var items = [];				
var prodId = 0;
var prodNm = "";
var prodPrc = 0;
var prodInv = 0;
var prodSold = 0;
var orderQty = 0;
var orderCost = 0;
   
//= Configure to log output to both file and console
//= Open a writeable stream to "LIRI.log" in append mode vs write to append data to end of file
var log_file = fs.createWriteStream(__dirname + '/bama.log', {flags : 'a'});
//= Assign the standard output stream  
var log_stdout = process.stdout;

//= Set "console.log" function to use fs.write to use the writeable stream to write to the log file 
//= and to use process.stdout.write to write to the console
console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};



//= Database connection configuration =====================
//Connect to database
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME
});

//= Database connection and initial callback =============
connection.connect(function (err) {
	 
	if (err) throw err;
	queryProducts();
	//console.log("queryProducts return to DB connection")	 
});

//= Obtain all products for sale and call next functions
function queryProducts() {

	var sql = "SELECT * from products";
	connection.query(sql, function (err, res) {
		if (err) throw err;
		//console.log(res);
		formatData(res);
	});
}

//= Organize product data for display using cli-table package,
//= capture product codes, and call next function  
function formatData(res) {
	var dataRowStr = "";
	var dataHeader = "Item,Product,Department,Price,\n"
	var dataRows = "";
	dataRows = dataHeader;
	for (i = 0; i < res.length; i++) {
		dataRows = dataRows + res[i].item_id + "," +
		res[i].product_name + "," +
		res[i].department_name + "," +
		res[i].price.toFixed(2) + "," +
		"\n";
		//capture product codes for use in validating order data
		items.push(res[i].item_id);
		 
	} //end for
	displayData(dataRows);
}


 

//= Display products available for purchase in table format using
//= cli-table and csv package functions, and call next function
function displayData(dataRows) {
	csv().from.string(dataRows).to.array(function (dataRows) {
		var
			headers = dataRows[0],
			values = dataRows.slice(1),
			table = new Table({
				head: headers
			});
		table.push.apply(table, values);
		// T A B L E   D I S P L A Y
		console.log(table.toString());
		orderOrExit();
	});

}
//= Prompt user to intiate purchase and call next function=========
//= Always allowing user option to exit the app
function orderOrExit() {
	inquirer
		.prompt([{
			name: "orderOrExit",
			type: "list",
			message: "W e l c o m e   t o   B a m a z o n !",
			choices: ["ORDER", "EXIT STORE"]
		}, ])
		.then(function (answer) {
			if (answer.orderOrExit === "ORDER") {
			    takeOrder();
			} else {
				console.log("\n  Thank you. Come again.")
				connection.end();
			}
		});
}

//= Prompt user to specify item for purchase ===================== 
function takeOrder() {
	inquirer
		.prompt([{
				name: "item",
				type: "input",
				message: "Enter an item number or press [enter] to exit",

				//= Validate item code allowing for use to exit 
				validate: function (value) {
					if (value == "") {
						return true;
					} //end if
					//= Validate item code as an exisiting one
					var valInt = parseInt(value);
					if (!items.includes(valInt)) {
						console.log("\n  " + value + " is not a valid item number");
						return false;
					} //end if

					//= Get data for specified product for use in checking available qty, 
					//= computing order cost, and updating inventory and product toital sales  
					getProduct(valInt)
					return true;
				} //end validate

			} //end prompt
		]) //end prompt
		.then(function (answer) {
			if (answer.item == "") {
				console.log("\n  Thank you. Come again.")
				connection.end();
				return;
			} //end if  
			
			 
			takeOrderQty();
		}); //end then
} //end function    

//= Get data for specified product for use in checking available qty, 
//= computing order cost, and updating inventory and product toital sales  
function getProduct(item) {
	//console.log("getProduct item: " + item);
	var sql = "SELECT * from products where item_id = ?";
	//console.log("sql: " + sql);
	connection.query(sql, [parseInt(item)], function (err, res) {
		if (err) throw err;
		 
		prodId = res[0].item_id;
		prodNm = res[0].product_name;
		prodPrc = res[0].price;
		prodInv = res[0].stock_quantity;
		prodSold = res[0].units_sold;
	})
}

//= Prompt user to specify quantity for purchase, confirm product availability, 
//= and display order details 
function takeOrderQty() {
	inquirer
		.prompt([
			{
				name: "orderQty",
				type: "input",
				message: "Enter quantity or press [Enter] to exit",
				validate: function (value) {
                    if (isNaN(value) === true) {
						console.log("\n  Invalid Entry. Please re-enter")
                        return false;
                    }
                    if (parseInt(value) > prodInv) {
                        console.log("\n  Only " + prodInv + " left. More on the way.")
                        return false;
                    }
					return true;
				}
			}
		]) //end prompt
		.then(function (answer) {
			  
			if (answer.orderQty == "") {
				console.log("\n  Thank you. Come again.")
				connection.end();
			} //end if  
			 else 
			 {
				orderQty = (parseInt(answer.orderQty));
				orderCost = (parseInt(answer.orderQty) * parseFloat(prodPrc));
				
				console.log("\n  " + orderQty + " " + prodNm + " At $" + prodPrc + " - Total $" + orderCost );
				confirmOrder();
			}
		}); //end then   
}

//= Prompt user for order verification =============================
function confirmOrder() {
	// prompt for order confrimation
	inquirer
		.prompt([{
			name: "confirm",
			type: "list",
			message: "Proceed",
			choices: ["PLACE ORDER", "CANCEL"]
		}, ])
		.then(function (answer) {
 
			if (answer.confirm === "PLACE ORDER") {
				processOrder();
			} else {
				console.log("\n  Thank you. Come again.")
			}
			connection.end();
			//return;
		});
}

//= Compute updated inventory and product total sales and update in database
function processOrder() {
    //console.log("answer: " + item);
	var newInv = prodInv - orderQty;
	var newSold = prodSold + orderQty;

	//console.log("old inv: " + prodInv + "  ord qty: " + orderQty + "  new Inv: " + newInv);
	//console.log("old units sold: " + prodSold + "  ord qty: " + orderQty + "  new units sold: " + newSold);
 
	var sql = "UPDATE products SET stock_quantity = ?, units_sold = ? where item_id = ?";
	
	connection.query(sql, [newInv,newSold,prodId], function (err, res) {
		if (err) throw err;
		 
	})
	console.log("\n  Your purchase is complete.")
	console.log("\n  Thank you. Come again.")
	}//end function