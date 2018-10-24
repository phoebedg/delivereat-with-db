DROP TABLE menu_purchase;
DROP TABLE menu;
DROP TABLE purchase;


create table menu (
  id serial primary key,
  name varchar(100) not null,
  price numeric(4,2) not null
);

create table purchase (
  id serial primary key
);

create table menu_purchase (
  id serial primary key,
  menu_id int not null,
  purchase_id int not null,
  quantity int not null,
  FOREIGN KEY (menu_id) REFERENCES menu (id),
  FOREIGN KEY (purchase_id) REFERENCES purchase (id)
);

INSERT INTO menu (name, price) VALUES ('French Onion Soup', 8.5);
INSERT INTO menu (name, price) VALUES ('Strawberry Cheesecake', 6.5);
INSERT INTO menu (name, price) VALUES ('Steak tartare', 12.75);
