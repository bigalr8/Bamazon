/*
 Create a MySQL Database called `bamazon`.

2. Then create a Table inside of that database called `products`.

3. The products table should have each of the following columns:

   * item_id (unique id for each product)

   * product_name (Name of product)

   * department_name

   * price (cost to customer)

   * stock_quantity (how much of the product is available in stores)

4. Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).*/

DROP DATABASE IF EXISTS bamazonDB;



CREATE database bamazonDB;

USE bamazonDB;

DROP TABLE products;

CREATE TABLE products (
  item_id INT AUTO_INCREMENT  PRIMARY KEY, 
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL,
  units_sold INT NOT NULL,
  product_sales DECIMAL(10,2)  AS (price * units_sold)
);
  ALTER TABLE products AUTO_INCREMENT = 1000;
  
  TRUNCATE TABLE products;
  
INSERT INTO  products (product_name, department_name, price, stock_quantity, units_sold)
VALUES ("Strideline US Soccer Premium Socks","Sports and Outdoors", 18.00, 20, 4 );

INSERT INTO products (product_name, department_name, price, stock_quantity, units_sold)
VALUES ("Contigo Kids Water Bottles - 14oz  2-Pack", "Home and Kitchen", 18.99, 31, 11);

INSERT INTO products (product_name, department_name, price, stock_quantity, units_sold)
VALUES ("Adjustable Notebook Stand for Laptop (17 inch)", "Office Products", 34.99, 9, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity, units_sold)
VALUES ("Sundown Naturals Kids Multivitamin Gummies","Household and Baby Care", 12.49, 42, 84 );

INSERT INTO products (product_name, department_name, price, stock_quantity, units_sold)
VALUES ("Cobber Refillable Torch Cigar Lighter","Home and Kitchen ", 19.99, 22, 9 );

INSERT INTO products (product_name, department_name, price, stock_quantity, units_sold)
VALUES ("Avantina Pot and Pan Protectors (6 Pcs) - 16 In.","Home and Kitchen", 11.00, 36, 30 );

INSERT INTO products (product_name, department_name, price, stock_quantity, units_sold)
VALUE ("Pilot G2 Limited Roller Ball Pen","Office Products", 13.00, 9, 400 );

INSERT INTO products (product_name, department_name, price, stock_quantity, units_sold)
VALUE ("TriggerPoint CORE Solid Foam Roller","Sports and Outdoors", 26.99, 26, 7 );

INSERT INTO products (product_name, department_name, price, stock_quantity, units_sold)
VALUE ("MiToo Digital Alarm Clock","Electronics", 12.99, 58, 3 );

INSERT INTO products (product_name, department_name, price, stock_quantity, units_sold)
VALUE ("Boogie Board Electronic Writing Tablet 8 1/2 x 11","Electronics", 39.99, 17, 40 );




SELECT * FROM products;