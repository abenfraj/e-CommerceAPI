const {cart} = require('../data/cart.json')
const fs = require("fs");

const emptyCart = () => {
    fs.writeFile('./cart.json', JSON.stringify({cart: {}}), (err) => {
        if (err) throw err;
        console.log('Cart emptied');
    });
}

module.exports = {
    emptyCart
}