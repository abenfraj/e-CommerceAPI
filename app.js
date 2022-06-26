//import express
const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser')

const {products} = require('./data/products.json')
const {cart} = require('./data/cart.json')
const {shippingInformation} = require('./data/shippingInformation.json')
const {orders} = require('./data/orders.json')
const {emptyCart} = require('./helpers/cart.js')

const app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

//Start server on port 8080
const PORT = 8080;
app.listen(PORT, () => {
    console.log('Server listening')
})

//Get all products
app.get('/products', (req, res) => {
    let filteredProducts = products;
    const productColor = req.query.color;
    const productQuantity = req.query.quantity;
    const productSize = req.query.size;

    if (productColor != null) {
        filteredProducts = filteredProducts.filter(product => {
            return product.color === productColor
        })
    }

    if (productQuantity != null) {
        filteredProducts = filteredProducts.filter(product => {
            return product.quantity === productQuantity
        })
    }

    if (productSize != null) {
        filteredProducts = filteredProducts.filter(product => {
            return product.size === productSize
        })
    }

    if (filteredProducts.length === 0) {
        return res.status(404).send('No products found')
    }

    return res.status(200).json(filteredProducts);

});

//Check if product is available
app.get('/products/available', (req, res) => {
    const productId = req.query.id;
    const product = products.find(product => product.id === productId);

    if (product != null) {
        return res.status(404).json({
            message: 'Product not found'
        })
    }

    if (product.quantity > 0) {
        return res.status(200).json({
            message: 'Product available : quantity = ' + product.quantity
        })
    }

    return res.status(200).json({
        message: 'Product not available : quantity = ' + product.quantity
    })
});

//Add product to cart
app.get('/products/addToCart', (req, res) => {
    const productId = req.query.id;
    const productQuantity = req.query.quantity;
    const product = products.find(product => product.id === productId);
    const updatedCart = cart;

    if (product === undefined) {
        return res.status(404).json({
            message: 'Product not found'
        })
    }

    if (productQuantity === undefined) {
        return res.status(400).json({
            message: 'Missing parameter : quantity'
        })
    }

    if (product.quantity < updatedCart[product.name] + parseInt(productQuantity)) {
        return res.status(200).json({
            message: 'Not enough product available : quantity = ' + product.quantity
                + ' / requested quantity = ' + productQuantity
        })
    }

    if(updatedCart[product.name] === undefined) {
        updatedCart[product.name] = 0;
    }

    updatedCart[product.name] += parseInt(productQuantity);

    fs.writeFile('./cart.json', JSON.stringify({cart: cart}), (err) => {
        if (err) throw err;
        console.log('Cart updated');
    });

    return res.status(200).json(cart);
});

//Get all items in cart
app.get('/cart', (req, res) => {
    return res.status(200).json(cart);
});

//Create shipping information
app.post('/order', (req, res) => {
    if(Object.keys(cart).length === 0) {
        return res.status(400).json({
            message: 'Cart is empty'
        })
    }

    const shippingRequest = req.body;
    const newShippingInformation = [...shippingInformation, {id: uuidv4(), ...shippingRequest}];

    const newOrder = {orderId: uuidv4(), products: cart, shippingInformation: shippingRequest}
    const newOrders = [...orders, newOrder];

    fs.writeFile('./shippingInformation.json', JSON.stringify({shippingInformation: newShippingInformation}), (err) => {
        if (err) {
            res.status(500).json({
                message: 'Error while saving shipping information'
            });
            return
        }
        console.log('Shipping information updated');
    });

    fs.writeFile('./orders.json', JSON.stringify({orders: newOrders}), (err) => {
        if (err) throw err;
        console.log('Cart updated');
    });

    emptyCart();

    res.status(200).json(newOrder);
});