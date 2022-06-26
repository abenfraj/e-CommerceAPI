const {cart} = require('../data/cart.json')
const fs = require("fs");
const {products} = require("../data/products.json");

const emptyCart = () => {
    fs.writeFile('./cart.json', JSON.stringify({cart: {}}), (err) => {
        if (err) throw err;
        console.log('Cart emptied');
    });
}

const addProductToCart = (req, res) => {
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

    if (updatedCart[product.name] === undefined) {
        updatedCart[product.name] = 0;
    }

    updatedCart[product.name] += parseInt(productQuantity);

    fs.writeFile('./cart.json', JSON.stringify({cart: cart}), (err) => {
        if (err) throw err;
        console.log('Cart updated');
    });

    return res.status(200).json(cart);
}

const getCart = (req, res) => {
    return res.status(200).json(cart);
}

module.exports = {
    emptyCart,
    addProductToCart,
    getCart
}