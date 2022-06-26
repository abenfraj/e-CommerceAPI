const {products} = require('../data/products.json')
const {cart} = require("../data/cart.json");
const fs = require("fs");

const getAllProducts = (req, res) => {
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
}

const checkProductAvailability = (req, res) => {
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
}

module.exports = {
    getAllProducts,
    checkProductAvailability,
}