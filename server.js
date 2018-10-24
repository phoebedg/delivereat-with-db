require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use('/static', express.static('static'));
app.set('view engine', 'hbs');

const pgp = require('pg-promise')();
const db = pgp({
    host: 'localhost',
    port: 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
});

app.get('/', function(req, res){
  res.render('index');
});

app.get('/api/menu', function(req, res){
  db.many('SELECT * FROM menu')
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      console.log(error);
      res.status(400).json({message: 'an error has occurred'});
    })
});

app.post('/api/order', function(req, res){
  console.log(' ', req.body);

  if(!Object.keys(req.body).length){
    res.status(400).json({message: 'No order items submitted'});
    return;
  }

  db.one('INSERT INTO purchase VALUES(DEFAULT) RETURNING id')
    .then(data => {
      return Object.keys(req.body).map( menuId => {
          return db.one(`
            INSERT INTO menu_purchase (menu_id, purchase_id, quantity)
            VALUES ($1, $2, $3) RETURNING id, menu_id, purchase_id, quantity
          `, [menuId, data.id, req.body[menuId]]);
      });
    })
    .then(responses => {
      return Promise.all(responses)
    })
    .then(data => {
      console.log(data);

      const output = {}

      if(data.length){
        output.id = data[0].purchase_id;
        output.items = {};
      }

      data.forEach( item => {
        output.items[item.menu_id] = item.quantity;
      });

      res.json(output)
    })
    .catch(error => {
      console.log(error);
      res.status(400).json({message: 'an error has occurred'});
    })
});

const port = process.env.PORT || 8080;

app.listen(port, function(){
  console.log(`Listening on port ${port}`);
});
