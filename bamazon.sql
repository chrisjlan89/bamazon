DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
  id INTEGER(10) AUTO_INCREMENT NOT NULL,
  product VARCHAR(100) NOT NULL,
  department_name VARCHAR(100),
  price INTEGER(10) NOT NULL,
  onHand INTEGER(10) NOT NULL,
  PRIMARY KEY(ID)
);


INSERT INTO products (product, department_name, price, onHand)
VALUES ("PS4", "Gaming", 299, 400);

INSERT INTO products (product, department_name, price, onHand)
VALUES ("Monster Hunter World", "Gaming", 60 , 717);


INSERT INTO products (product, department_name, price, onHand)
VALUES ("LG OLED TV 55 inch", "Electronics", 1500, 200);

INSERT INTO products (product, department_name, price, onHand)
VALUES ("Yamaha Reciever", "Electronics", 350, 277);


INSERT INTO products (product, department_name, price, onHand)
VALUES ("Lysol Disnfectant Wipes 80pk", "Home", 3, 1027);

INSERT INTO products (product, department_name, price, onHand)
VALUES ("Wonderful Pistachios 32oz", "Grocery", 10, 548);

INSERT INTO products (product, department_name, price, onHand)
VALUES ("bamazon basics 9 ft HDMI cord", "Electronics", 7, 876);


INSERT INTO products (product, department_name, price, onHand)
VALUES ("bamazon echo plus", "Electronics", 149 , 2177);

INSERT INTO products (product, department_name, price, onHand)
VALUES ("3 tier shoe caddy", "Home", 25, 77);



INSERT INTO products (product, department_name, price, onHand)
VALUES ("Super Nintendo Classic", "Gaming", 80, 2);


