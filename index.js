// Install required npm packages
// npm install express body-parser ejs

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Sample data storage
const vendors = [];
const clients = [];
const inventory = [];
const bills = [];
const employees = [];

// Routes

// Home route
app.get('/', (req, res) => {
  res.render('index');
});

// Vendor route
app.get('/vendors', (req, res) => {
  res.render('vendors', { vendors });
});

app.post('/vendors', (req, res) => {
  const { name, address, contact } = req.body;
  vendors.push({ name, address, contact });
  res.redirect('/vendors');
});

// Client route
app.get('/clients', (req, res) => {
  res.render('clients', { clients });
});

app.post('/clients', (req, res) => {
  const { name, address, contact } = req.body;
  clients.push({ name, address, contact });
  res.redirect('/clients');
});

// Inventory route
app.get('/inventory', (req, res) => {
  res.render('inventory', { inventory });
});

app.post('/inventory', (req, res) => {
  const { itemName, price, quantity } = req.body;
  inventory.push({ itemName, price, quantity });
  res.redirect('/inventory');
});

// Bill route
app.get('/bills', (req, res) => {
  res.render('bills', { bills, clients, inventory });
});

app.post('/bills', (req, res) => {
  const { clientId, items } = req.body;
  const client = clients.find((c) => c.name === clientId);
  const itemsArray = items.map((item) => {
    const inventoryItem = inventory.find((inv) => inv.itemName === item.itemName);
    return {
      itemName: item.itemName,
      quantity: item.quantity,
      price: inventoryItem ? inventoryItem.price : 0,
    };
  });
  const totalAmount = itemsArray.reduce((total, item) => total + item.quantity * item.price, 0);

  bills.push({ client, items: itemsArray, totalAmount });
  res.redirect('/bills');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});