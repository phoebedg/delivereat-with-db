require("dotenv").config();

const express = require("express");
const pgp = require("pg-promise")();
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use("/static", express.static("static"));
app.set("view engine", "hbs");

const db = pgp({
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD
});

// Example menu obj to show obj structure
const menu = {
  1: {
    id: 1,
    item: "Prawn Crackers",
    price: 3,
    img: "prawncrackers.jpeg",
    course: "starter"
  },
  2: {
    id: 2,
    item: "Chicken Satay",
    price: 7.25,
    img: "chickensatay.jpg",
    course: "starter"
  }
};

// Example menu_purchases obj to show obj structure
const menu_purchases = {
  items: {
    1: {
      id: 1,
      quantity: 2
    },
    2: {
      id: 2,
      quantity: 4
    }
  },
  customer: "Phoebe",
  telephone: "07443 975 112"
};

app.get("/", function(req, res) {
  res.render("index");
});

// Get all menu items from menu table
app.get("/api/menu", function(req, res) {
  db.any("SELECT * FROM menu")
    .then(menu => {
      const menuObject = menu.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});
      return res.json(menuObject);
    })
    .catch(function(error) {
      res.json({ error: error.message });
    });
});

// Get a single menu item from menu table
app.get("/api/menu/:id", function(req, res) {
  const id = req.params.id;
  db.any("SELECT * FROM menu WHERE id=$1", [id])
    .then(menuItem => {
      if (menuItem.length) {
        const menuObject = menuItem[0];
        return res.json(menuObject);
      } else {
        res.json({
          error: `Error: Menu item with ID = ${id} could not be found, please contact us for help`
        });
      }
    })
    .catch(function(error) {
      res.json({ error: error.message });
    });
});

// Add a single order to purchase and menu_purchase table
app.post("/api/order", (req, res) => {
  // 1. insert items, customer, telephone and time from body request into purchase table
  const { items, customer, telephone } = req.body;
  db.one(
    `INSERT INTO purchase (customer, telephone, created_at) VALUES($1, $2, NOW()) RETURNING id`,
    [customer, telephone]
  )
    .then(result => {
      // set RETURNING id from INSERT INTO
      const orderId = result.id;
      // 2. insert into menu_purchase table for each item
      return Promise.all(
        Object.values(items).map(item => {
          return db.none(
            `INSERT INTO menu_purchase (quantity, menu_id, purchase_id) VALUES($1, $2, $3)`,
            [item.quantity, item.id, orderId]
          );
        })
      ).then(() => orderId); // orderId is returned when Promise.all is complete
    })
    .then(orderId => {
      // sendSMS(orderId, customer, telephone);
      return res.json({ orderId, customer, telephone });
    })
    .catch(error => res.json({ error: error.message }));
});

// Get all orders from menu_purchase table
app.get("/api/orders", function(req, res) {
  db.any("SELECT * FROM menu_purchase")
    .then(orders => {
      const ordersObject = orders.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});
      return res.json(ordersObject);
    })
    .catch(function(error) {
      res.json({ error: error.message });
    });
});

// Get a single order from menu_purchase table
app.get("/api/order/:id", function(req, res) {
  db.any("SELECT * FROM menu_purchase WHERE purchase_id=$1", [req.params.id])
    .then(order => {
      if (order.length) {
        return res.json(order);
      } else {
        res.json({
          error: `Error: Your order with ID = ${
            req.params.id
          } could not be found, please contact us for help`
        });
      }
    })
    .catch(function(error) {
      res.json({ error: error.message });
    });
});

const port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log(`Listening on port number ${port}`);
});
