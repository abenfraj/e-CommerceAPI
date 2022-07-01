//import express
const express = require('express');

//import body parser
const cors = require('cors')
const bodyParser = require('body-parser')

const {getAllProducts} = require('./helpers/products.js')
const {getProductById} = require('./helpers/products.js')
const {addProductToCart} = require('./helpers/cart.js')
const {getCart} = require('./helpers/cart.js')
const {createOrder} = require('./helpers/orders.js')
const {getProductColors} = require("./helpers/products");
const {getProductSizesOfColor} = require("./helpers/products");
const {getProductByNameColorSize} = require("./helpers/products");
const {removeProductFromCart} = require('./helpers/cart.js')
const {getAllOrders} = require("./helpers/orders");

const app = express();
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(cors()) //to allow cross-origin requests

//Start server on port 8080
const PORT = 8080;
app.listen(PORT, () => {
    console.log('Server listening')
})

/* link: localhost:8080/products */
app.get('/products', getAllProducts);

/* link: localhost:8080/product/by-id/:id */
app.get('/product/by-id/:id', getProductById);

/* link: localhost:8080/find/:name/:color/:size */
app.get('/product/find/:name/:color/:size', getProductByNameColorSize);

/* link: localhost:8080/product/:name/colors */
app.get('/product/:name/colors', getProductColors);

/* link: localhost:8080/product/:name/:color/sizes */
app.get('/product/:name/:color/sizes', getProductSizesOfColor);

/* link: localhost:8080/products/addToCart?id={number}&quantity={number} */
app.get('/products/addProductToCart', addProductToCart);

/* link: localhost:8080/cart */
app.get('/cart', getCart);

/* link: localhost:8080/cart/removeProductFromCart/:id */
app.get('/cart/removeProductFromCart/:id', removeProductFromCart);

/* link: localhost:8080/order */
app.post('/order', createOrder);

/* link: localhost:8080/orders */
app.get('/orders', getAllOrders);