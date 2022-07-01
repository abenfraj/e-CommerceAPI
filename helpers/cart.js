const {cart} = require('../data/cart.json')
const fs = require("fs");
const {products} = require("../data/products.json");

const emptyCart = () => {
    const productsInCart = [];

    cart.forEach(product => {
        productsInCart.push([product.id, product.quantity]);
    });

    console.log(productsInCart);

    productsInCart.forEach(productInCart => {
            products.forEach(product => {
                if (product.id === productInCart[0]) {
                    if (product.quantity > 0) {
                        product.quantity -= productInCart[1];
                    }
                    if (product.quantity === 0) {
                        products.splice(products.indexOf(product), 1);
                    }
                }
            });
        }
    );

    fs.writeFileSync("./data/products.json", JSON.stringify({products: products}));
    fs.writeFile('./data/cart.json', JSON.stringify({cart: []}), (err) => {
        if (err) throw err;
        console.log('Cart emptied');
    });
}


const addProductToCart = (req, res) => {
    const productId = req.query.id;
    const chosenProductQuantity = req.query.quantity;
    const product = products.find(product => product.id === productId);
    console.log(cart);
    const productInCart = cart.find(product => product.id === productId);

    const updatedCart = cart;
    let quantityInCart = 0;

    if (product === undefined) {
        return res.status(404).json({
            message: 'Product not found'
        })
    }

    if (chosenProductQuantity === undefined) {
        return res.status(400).json({
            message: 'Missing parameter : quantity'
        })
    }

    if (productInCart === undefined) {
        quantityInCart = 0;
    } else {
        quantityInCart = parseInt(productInCart.quantity);
    }

    if (product.quantity < (quantityInCart + parseInt(chosenProductQuantity))) {
        return res.status(404).json({
            message: 'Not enough product available : quantity = ' + product.quantity
                + ' / requested quantity = ' + chosenProductQuantity
        })
    }

    console.log(product.images[0]);

    if (productInCart === undefined) {
        updatedCart[updatedCart.length] = {
            id: productId,
            name: product.name,
            price: product.price,
            color: product.color,
            size: product.size,
            image: product.images[0],
            quantity: String(parseInt(quantityInCart + chosenProductQuantity))
        }
    } else {
        let elementPos = updatedCart.map(function (x) {
            return x.id;
        }).indexOf(productId);
        updatedCart[elementPos] = {
            id: productId,
            name: product.name,
            price: product.price,
            color: product.color,
            size: product.size,
            image: product.image,
            quantity: String(quantityInCart + parseInt(chosenProductQuantity))
        }
    }

    fs.writeFile('./data/cart.json', JSON.stringify({cart: cart}), (err) => {
        if (err) throw err;
        console.log('Cart updated');
    });

    return res.status(200).json(cart);
}

const getCart = (req, res) => {
    return res.status(200).json(cart);
}

const removeProductFromCart = (req, res) => {
    const productId = req.params.id;
    const product = cart.find(product => product.id === productId);

    if (product === undefined) {
        return res.status(404).json({
            message: 'Product not found'
        })
    }

    const updatedCart = cart;
    console.log(updatedCart);
    let elementPos = updatedCart.map(function (x) {
        return x.id;
    }).indexOf(productId);
    updatedCart.splice(elementPos, 1);

    console.log(updatedCart);

    fs.writeFile('./data/cart.json', JSON.stringify({cart: cart}), (err) => {
        if (err) throw err;
        console.log('Cart updated');
    });

    return res.status(200).json(cart);
}

module.exports = {
    emptyCart,
    addProductToCart,
    getCart,
    removeProductFromCart
}