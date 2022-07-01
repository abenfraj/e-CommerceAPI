const {cart} = require("../data/cart.json");
const {shippingInformation} = require("../data/shippingInformation.json");
const {v4: uuidv4} = require("uuid");
const {orders} = require("../data/orders.json");
const fs = require("fs");
const {emptyCart} = require("./cart");

/**
 * Request to create an order
 * @param req - request object
 * @param res - response object
 * @returns status code 200 if order was created successfully
 */
const createOrder = (req, res) => {
    if (Object.keys(cart).length === 0) {
        return res.status(400).json({
            message: 'Cart is empty'
        })
    }
    let orderDate = new Date();

    let date = ("0" + orderDate.getDate()).slice(-2);
    let month = ("0" + (orderDate.getMonth() + 1)).slice(-2);
    let year = orderDate.getFullYear();
    let hours = orderDate.getHours();
    let minutes = orderDate.getMinutes();
    let seconds = orderDate.getSeconds();

    orderDate = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

    const shippingRequest = req.body;
    const newShippingInformation = [...shippingInformation, {id: uuidv4(), ...shippingRequest}];

    const newOrder = {orderId: uuidv4(), products: cart, shippingInformation: shippingRequest, orderDate: orderDate};
    const newOrders = [...orders, newOrder];

    fs.writeFile('./data/shippingInformation.json', JSON.stringify({shippingInformation: newShippingInformation}), (err) => {
        if (err) {
            res.status(500).json({
                message: 'Error while saving shipping information'
            });
            return
        }
        console.log('Shipping information updated');
    });

    fs.writeFile('./data/orders.json', JSON.stringify({orders: newOrders}), (err) => {
        if (err) throw err;
        console.log('Cart updated');
    });

    emptyCart();

    res.status(200).json(newOrder);
}

/**
 * Request to get all orders
 * @param req - request object
 * @param res - response object
 * @returns status code 200 if orders were found successfully
 */
const getAllOrders = (req, res) => {
    if (orders.length === 0) {
        return res.status(400).json({
            message: 'No orders found'
        })
    }
    res.status(200).json(orders)
}

// exportation of functions
module.exports = {
    createOrder,
    getAllOrders
}