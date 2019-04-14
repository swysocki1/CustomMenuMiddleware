use users;

/*  Build Tables  */

drop table if exists user;
create table if not exists user (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username varchar(50),
    password varchar(50),
    photoURL varchar(256),
    firstname varchar(25),
    lastname varchar(30),
    email varchar(100)
);

drop table if exists restaurant_owner;
create table if not exists restaurant_owner (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    owner int,
    restaurant int
);

drop table if exists restaurant;
create table if not exists restaurant (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    description varchar(1024)
);

drop table if exists menu;
create table if not exists menu (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    restaurant int,
    name VARCHAR(100),
    description varchar(1024)
);

drop table if exists menu_section;
create table if not exists menu_section (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    menu int,
    name VARCHAR(100),
    description varchar(1024),
    display_order int
);

drop table if exists addons;
create table if not exists addons (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name varchar(100),
    description varchar(1024),
    img_src varchar(256),
    price double
);

drop table if exists menu_section_addon;
create table if not exists menu_section_addon (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    menu_section int,
    addon int
);

drop table if exists food_in_section;
create table if not exists food_in_section (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    food int,
    section int
);

drop table if exists food;
create table if not exists food (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name varchar(100),
    description varchar(1024),
    img_src varchar(256),
    price double
);

drop table if exists food_addon;
create table if not exists food_addon (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    food int,
    addon int
);

/*  Load Sample Data  */

Insert into user (username, password, firstname, lastname, email) values ('testuser1', 'Test!123', 'John', 'Smith', 'johndoe@test.com');
Insert into restaurant (name, description) values ('Pizza Co.', 'The Best Pizza Place on the Block');
Insert into restaurant_owner (owner, restaurant) values (1,1);
insert into menu (restaurant, name, description) values (1, 'Happy Hour', 'From 5pm - 7pm on Monday through Friday');
insert into menu_section (menu, name, description, display_order) values (1, 'Appetizers', 'Hot bites at a hot price', 1);
insert into menu_section (menu, name, description, display_order) values (1, 'Entrees', 'Limited time meals', 2);
insert into menu_section (menu, name, description, display_order) values (1, 'Deserts', 'Treat yourself to something nice', 3);
insert into food (name, description, price) values ('Mozzerella Sticks', 'Fresh Mozzerella covered with a crumbled breading and fried to your order', 4.99);
insert into food_in_section (food, section) values (1,1);
insert into food (name, description, price) values ('Sweet Potato Fries', 'Hand cut daily and fried at 600 degree\'s to bring them right to your figer tips the way you like them', 3.99);
insert into food_in_section (food, section) values (2,1);
insert into food (name, description, price) values ('Chips & Guac', 'Fresh made guacamole mixed with a touch of salt, fresh chopped onion, fresh squeezed lemon, and a pinch of garlic', 5.99);
insert into food_in_section (food, section) values (3,1);
insert into food (name, description, price) values ('Margaritta Pizza', 'Brick oven Pizza with fresh Buffalo Mozzerella and our homemade sauce', 4.99);
insert into food_in_section (food, section) values (4,2);
insert into food (name, description, price) values ('Meat Lovers Pizza', 'Brick oven Pizza with Mozzerella cheese, Sausage, Peppereoni, Bacon, Ham, and our homemade sauce', 6.99);
insert into food_in_section (food, section) values (5,2);
insert into food (name, description, price) values ('House Burger', 'Classic Burger served with Letus, Onion, and Tomato. Cheese extra', 6.99);
insert into food_in_section (food, section) values (6,2);
insert into addons (name, description, price) values ('Chedder Cheese', 'Slice of Chedder Cheese', 1.00);
insert into addons (name, description, price) values ('Provalone Cheese', 'Slice of Provalone Cheese', 1.00);
insert into addons (name, description, price) values ('Mozzerella Cheese', 'Slice of Mozzerella Cheese', 1.00);
insert into addons (name, description, price) values ('Hand Cut Fries', 'Freshly fried french fries made daily', 3.00);
insert into food_addon (food, addon) values (6, 1);
insert into food_addon (food, addon) values (6, 2);
insert into food_addon (food, addon) values (6, 3);
insert into menu_section_addon (menu_section, addon) values (2, 4);
insert into food (name, description, price) values ('gelato', 'Choose 2 scoops of vanilla, chocolate, canoli, pastachio, stratilla, or lemonchello', 4.99);
insert into food_in_section (food, section) values (7,3);
insert into food (name, description, price) values ('Philly Cheese Cake', '1 Slice perfect to share', 3.99);
insert into food_in_section (food, section) values (8,3);
insert into food (name, description, price) values ('Cheese Platter', 'Ask for our seasonal Options', 5.99);
insert into food_in_section (food, section) values (9,3);


/* Test Queries */

select r.id as restaurantOwnerId, r.owner, r.restaurant, u.id as userId, u.username, u.photoURL, u.firstname, u.lastname, u.email from restaurant_owner as r JOIN user u ON r.owner=u.id where r.restaurant='1';

select ro.id as restaurantOwnerId, ro.owner, ro.restaurant, r.id as restaurantId, r.name, r.description from restaurant_owner as ro JOIN restaurant r ON ro.owner=r.id;
select * from restaurant;