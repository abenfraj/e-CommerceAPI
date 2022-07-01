const {products} = require('../data/products.json')


/**
 * Request to get all products from products.json
 * @param req - request object
 * @param res - response object
 * @returns status code 200 and all products from products.json if successful
 */
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

/**
 * Request to get a product by its ID from products.json
 * @param req - request object
 * @param res - response object
 * @returns status code 200 and product with the given ID if successful
 */
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

/**
 * Request to get a product by its name, color and size from products.json
 * @param req - request object
 * @param res - response object
 * @returns status code 200 and product with the given name, color and size if successful
 */
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

/**
 * Request to get all colors of a product by its given name from products.json
 * @param req - request object
 * @param res - response object
 * @returns status code 200 and all colors of a product with the given name if successful
 */
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

/**
 * Request to get all sizes of a product by its given name and color from products.json
 * @param req - request object
 * @param res - response object
 * @returns status code 200 and all sizes of a product with the given name and color if successful
 */
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

// exportation of functions
module.exports = {
    getAllProducts,
    getProductById,
    getProductColors,
    getProductSizesOfColor,
    getProductByNameColorSize
}