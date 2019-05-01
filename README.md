# Bamazon
Node.JS and mySQL

## Description 
This command line interface (CLI) app models a retail sales operation. 

It facilitates the presentation of product offerings, customer purchases, the verification and updating of available inventory, and the updating of product sales. 

## Technologies and tools
The app is developed using node.JS and SQL. It uses a mySQL RDBMS for data management. 

It uses the following NPM packages: 
* The 'dotenv' package for storing credentials external to code
* The 'mysql' package for database connectivity and SQL	
* The 'inquirer' package for customizable command line prompting   
* The 'cli-table' and 'csv' package for displaying console data in table format 
* The 'fs" and "utils" packages for logging output to both the console and a log file.

## Sources
The data used for the app is manufactured for demonstration purposes.   

## Functionality

A database table of products availble for sale was created wit hthe following columns: 
* Product code 
* Product name/description
* Sales department
* Price 
* Available inventory
* Total units sold
* Total product revenue

The app retrieves all products available for purchase from the database and displayed as a table. The user is prompted for the product code from the displayed items to initiate a purchase, along with the quantity. The app validates the product code and the availabilty of inventory to meet the order. The app provides the details and cost of suitable orders, and requests user confirmation for it. Upon user confirmation the inventory, total sales, and total revenue for the pruduct are updated in the database. 

 

## Components
* `bamazonCustomer.js` - Contains the Node.JS javascript and MySql SQL code for the app.  
* `bamazon.sql` - Contains the SQL for creating and seeding the database.
* `node_modules/` - Contains the node packages used by the app   
* `package.json` - Contains manifest data about the external package used by the app as well the urls for the git repo and issue list for the app    
* `package-lock.json` - Contains version and location information for every module from every external package used by the app   
* `README.md` - Contains documentation for the app.
* `.env` - Contains credentials that will be loaded into environment variables by the dotenv package. Note that this is not pushed to github and that users must provide thier own credentials in thier own file. 
* `.gitignore` - Contains a list of files which are not to be pushed to github.  


## Instructions 
* Create the database by running the bamazon.sql script againt the MySQL database.
* include the appropriate database credentials and identifier in the .env file
* Execute the CLI app with the "node bamazonCustomer.js" command

## Artifacts
* `bigalr8/Bamazon` - github repo
* `https://drive.google.com/file/d/10YBj9KhSnsP6TPs1PTinyYhDKqHrWnJR/view` - video recording of operations and output
* `bamazon.log` - Log file of output from the app for each operation 
* `Capture mySQL Workbench.PNG` - Screen capture image of database workbench query  
* `Capture mySQL Workbench2.PNG` - Screen capture image of database workbench query  
* `Bamazon Screen Copy.docx` - Screen copy         

## Notes
Additional optional functionality was specified for the facilitation of  managerial inventory queries and replenishment, and adding new product offerings 
 
Additional optional functionality was also specified for providing sales figures by department and the adding of new departments.

These were not deployed here.