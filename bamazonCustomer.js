var mysql = require("mysql");
var inquirer = require("inquirer");
var csv = require("csv");
var Table = require("cli-table");
var items = [];
var prodId = 0;
var prodNm = "";
var prodPrc = 0;
var prodInv = 0;
var orderQty = 0;
var orderCost = 0;

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

//C O N N E C T   A N D   I N V O KE   Q U E R Y 
connection.connect(function (err) {
	if (err) throw err;
	//console.log("connected as id " + connection.threadId);
	queryProducts();
});

//S E L E C T   F R O M   P R O D U C T S   A N D   F O R M A T   F O R   D  I S P L A Y
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
	} //end for
	//console.log("items: " + items);
	displayData(dataRows);
}

//F O R M A T   O R D E R   
function formatOrder() {
	//T O   D O   R E P L A C E   ,   &   ""
	//T O   D O   F O R M A T   P R I C E   T O   I N C L U D E   .00   D E C I M A L 
    var dataRowStr = "";
    //answer.orderQty + " " + prodNm + "At " + prodPrc + " - Total $" + (parseInt(answer.orderQty) * parseFloat(prodPrc)) 
	var dataHeader = "Qty,Product,Price,Total,\n"
	 

	var dataRows = "";
	dataRows = dataHeader;
	 
		  
		dataRows = dataRows + orderQty + "," +
			prodNm + "," +
			prodPrc + "," +
			orderCost.toFixed(2) + "," +
			"\n";
		 
		 
	 
	 
	displayOrder(dataRows);
}

function displayOrder(dataRows) {
	//console.log(dataRows);
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
		return;
	});

}

//D I S P L A Y   P R O D U C T S   A N D   F A C I L I T A T E   O R D E R I N G   O R   Q U I T T I N G  
//cli-table and csv packages
//T O   D O    
function displayData(dataRows) {
	//console.log(dataRows);
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
//F A C I L I T A T E   O R D E R I N G   O R   Q U I T T I N G    A N D   G E T   P R O D U C T   T O   B E   O R D E R E D
function orderOrExit() {
	// prompt for info about the item being put up for auction
	inquirer
		.prompt([{
			name: "orderOrExit",
			type: "list",
			message: "W e l c o m e   t o   B a m a z o n !",
			choices: ["ORDER", "EXIT STORE"]
		}, ])
		.then(function (answer) {
			// based on their answer, either call take the order or quit the app
			//console.log("answer: " + answer)
			//console.log("orderOrExit: " + answer.orderOrExit);

			if (answer.orderOrExit === "ORDER") {
				//console.log(".then takeorder");    
				takeOrder();
			} else {
				console.log("\nThank you. Come again.")
				connection.end();
			}
		});
}

function takeOrder() {
	//console.log("takeOrder");
	// prompt for info about the item being put up for auction
	inquirer
		.prompt([{
				name: "item",
				type: "input",
				message: "Enter an item number or press [enter] to exit",
				validate: function (value) {
					//console.log("\nvalue: " + value); 
					if (value == "") {
						//console.log("\nvalue: " + value);
						return true;
					} //end if
					/*console.log("items: " + items);
					console.log("value: " + value);
					console.log("typeof value: " + typeof (value));
					console.log("\nincludes: " + items.includes(value));*/
					var valInt = parseInt(value);
					if (!items.includes(valInt)) {
						//console.log("\nincludes: " + items.includes(value));
						console.log("\n" + value + " is not a valid item number");
						return false;
					} //end if
					//console.log("\nvalidate item: " + valInt);
					// Q U E R Y   F O R   S P E C I F I E D   P R O D U C T
					getProduct(valInt)

					return true;
				} //end validate

			} //end item

		]) //end prompt
		.then(function (answer) {
			//console.log(".then - answer.item: " + answer.item);
			if (answer.item == "") {
				//console.log(".then - answer.item: " + answer.item); 
				console.log("\nThank you. Come again.")
				connection.end();
			} //end if  
			//console.log("\nValidating...");

			//processOrder(answer.item, answer.orderQty);
			takeQty();
			//connection.end();
		}); //end then
} //end function    


function getProduct(item) {
	//console.log("getProduct item: " + item);
	var sql = "SELECT * from products where item_id = ?";
	//console.log("sql: " + sql);
	connection.query(sql, [parseInt(item)], function (err, res) {
		if (err) throw err;
		//console.log("processOrder DB qty: " + res[0].stock_quantity);
		//console.log("processOrder order qty: " + qty);

		prodId = res[0].item_id;
		prodNm = res[0].product_name;
		prodPrc = res[0].price;
		prodInv = res[0].stock_quantity;

        /*
		console.log("id: " + prodId);
		console.log("Nm: " + prodNm);
		console.log("Prc: " + prodPrc);
		console.log("Inv: " + prodInv);
        */
		//get Qty(); 
		//connection.end();   
	})
}

function takeQty() {
	inquirer
		.prompt([

			{
				name: "orderQty",
				type: "input",
				message: "Enter quantity or press [Enter] to exit",
				validate: function (value) {
                    if (isNaN(value) === true) {validating
                        
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
			//console.log(".then - answer.item: " + answer.orderQty);
			if (answer.orderQty == "") {
				//console.log(".then - answer.item: " + answer.item); 
				console.log("\nThank you. Come again.")
				connection.end();
			} //end if  
			//console.log("Validating...");
            
			//processOrder(answer.item, answer.orderQty);
            //getQty();
            //console.log("typeof answer.orderQty: " + typeof (answer.orderQty));
            //console.log("typeof prodPrc: " + typeof (prodPrc));
            orderQty = (parseInt(answer.orderQty));
            orderCost = (parseInt(answer.orderQty) * parseFloat(prodPrc));
            //formatOrder();
            //displayOrder();
            console.log("\n  " + orderQty + " " + prodNm + " At $" + prodPrc + " - Total $" + orderCost );
			confirmOrder(answer.orderQty);
		}); //end then   
}


function confirmOrder(qty) {
	// prompt for order confrimation
	inquirer
		.prompt([{
			name: "confirm",
			type: "list",
			message: "Proceed",
			choices: ["PLACE ORDER", "CANCEL"]
		}, ])
		.then(function (answer) {
			// based on their answer, either call take the order or quit the app
			//console.log("answer: " + answer)
			//console.log("orderOrExit: " + answer.orderOrExit);

			if (answer.orderOrExit === "PLACE ORDER") {
				//console.log(".then takeorder");    
				takeOrder();
			} else {
				console.log("\nThank you. Come again.")
				connection.end();
			}
		});
}

function processOrder(item, qty) {
	console.log("answer: " + item);
	var sql = "SELECT * from products where item_id = ?";
	console.log("sql: " + sql);
	connection.query(sql, [parseInt(item)], function (err, res) {
		if (err) throw err;
		//console.log("processOrder DB qty: " + res[0].stock_quantity);
		//console.log("processOrder order qty: " + qty);
		//connection.end();
    })
	}//end function