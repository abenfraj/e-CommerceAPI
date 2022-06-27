//import express
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')

const {getAllProducts} = require('./helpers/products.js')
const {checkProductAvailability} = require('./helpers/products.js')
const {addProductToCart} = require('./helpers/cart.js')
const {getCart} = require('./helpers/cart.js')
const {createOrder} = require('./helpers/orders.js')

const app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(cors())

//Start server on port 8080
const PORT = 8080;
app.listen(PORT, () => {
    console.log('Server listening')
})

app.get('/products', getAllProducts);
app.get('/products/available', checkProductAvailability);
app.get('/products/addToCart', addProductToCart);
app.get('/cart', getCart);
app.post('/order', createOrder);