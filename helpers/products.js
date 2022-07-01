const {products} = require('../data/products.json')

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

const getProductById = (req, res) => {
    const productId = req.params.id;
    const product = products.find(product => {
        return product.id === productId;
    });

    if (product == null) {
        return res.status(404).send('Product not found')
    }

    return res.status(200).json(product);
}

const getProductByNameColorSize = (req, res) => {
    const productName = req.params.name;
    const productColor = req.params.color;
    const productSize = req.params.size;
    const product = products.find(product => {
        return product.name === productName && product.color === productColor && product.size === productSize;
    });

    if (product == null) {
        return res.status(404).send('Product not found')
    }

    return res.status(200).json(product);
}

const getProductColors = (req, res) => {
    const productName = req.params.name;
    const product = products.filter(product => {
        return product.name === productName;
    });

    if (product == null) {
        return res.status(404).send('Product not found')
    }

    const colors = product.map(product => {
        return product.color;
    }).filter((value, index, self) => {
        return self.indexOf(value) === index;
    }).sort();

    return res.status(200).json(colors);
}

const getProductSizesOfColor = (req, res) => {
    const productName = req.params.name;
    const productColor = req.params.color;
    const product = products.filter(product => {
        return product.name === productName && product.color === productColor;
    });

    if (product == null) {
        return res.status(404).send('Product not found')
    }

    const sizes = product.map(product => {
        return product.size;
    }).filter((value, index, self) => {
        return self.indexOf(value) === index;
    }).sort();

    return res.status(200).json(sizes);
}

module.exports = {
    getAllProducts,
    getProductById,
    getProductColors,
    getProductSizesOfColor,
    getProductByNameColorSize
}