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
  name: "Phoebe",
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

const port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log(`Listening on port number ${port}`);
});
