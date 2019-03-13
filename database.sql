CREATE database delivereat

-- create tables

CREATE table menu (
  id serial PRIMARY KEY,
  item text NOT NULL,
  price numeric(4,2) NOT NULL,
  img text NOT NULL,
  course text NOT NULL
);

CREATE table purchase (
  id serial PRIMARY KEY,
  customer text NOT NULL,
  telephone text NOT NULL,
  created_at TIMESTAMP NOT NULL
);

CREATE table menu_purchase (
    id serial PRIMARY KEY,
    quantity numeric default 0,
    menu_id smallint,
    purchase_id smallint,
    FOREIGN KEY (menu_id) REFERENCES menu (id),
    FOREIGN KEY (purchase_id) REFERENCES purchase (id)

-- DROP TABLE menu_purchase
-- DROP TABLE purchase
-- DROP TABLE menu

-- insert items into menu table

INSERT INTO menu (item, price, img, course) VALUES ('Prawn Crackers', 3, 'prawncrackers.jpeg', 'starter');
INSERT INTO menu (item, price, img, course) VALUES ('Chicken Satay', 7.25, 'chickensatay.jpg', 'starter');
INSERT INTO menu (item, price, img, course) VALUES ('Spring Rolls', 6.25, 'springrolls.jpg', 'starter');
INSERT INTO menu (item, price, img, course) VALUES ('Pad Thai', 10.75, 'padthai.jpeg', 'main');
INSERT INTO menu (item, price, img, course) VALUES ('Massaman Curry', 12, 'massaman.jpg', 'main');
INSERT INTO menu (item, price, img, course) VALUES ('Panang Curry', 11.75, 'panang.jpg', 'main');
INSERT INTO menu (item, price, img, course) VALUES ('Jasmine Rice', 3.25, 'jasminerice.jpg', 'side');
INSERT INTO menu (item, price, img, course) VALUES ('Egg Fried Rice', 4.25, 'blueberry-cheesecake.jpg', 'side');
INSERT INTO menu (item, price, img, course) VALUES ('Sticky Rice', 3.75, 'stickyrice.jpg', 'side');
INSERT INTO menu (item, price, img, course) VALUES ('Coconut Ice Cream', 3.25, 'coconuticecream.jpeg', 'dessert');
INSERT INTO menu (item, price, img, course) VALUES ('Green Tea Ice Cream', 3.25, 'greenteaicecream.jpeg', 'dessert');
INSERT INTO menu (item, price, img, course) VALUES ('Mango Sticky Rice', 4, 'mangostickyrice.jpeg', 'dessert');
INSERT INTO menu (item, price, img, course) VALUES ('Chang', 4, 'chang.jpg', 'drink');
INSERT INTO menu (item, price, img, course) VALUES ('Mekhong', 5.25, 'mekhong.jpg', 'drink');
INSERT INTO menu (item, price, img, course) VALUES ('Lemongrass Iced Tea', 3, 'icedtea.jpg', 'drink');