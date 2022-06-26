const {cart} = require("../data/cart.json");
const {shippingInformation} = require("../data/shippingInformation.json");
const {v4: uuidv4} = require("uuid");
const {orders} = require("../data/orders.json");
const fs = require("fs");
const {emptyCart} = require("./cart");

const createOrder = (req, res) => {
    if (Object.keys(cart).length === 0) {
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
}

module.exports = {
    createOrder
}