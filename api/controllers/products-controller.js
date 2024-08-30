// The controller is responsible for handling the incoming requests and returning the response to the client.

/* Libraries */
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

/* Application files */
const HttpError = require('../models/http-error');
const Product = require('../models/product');
const User = require('../models/user');


async function getProductsByUserId(req, res, next) {
    const creatorId = req.params.uid;

    let products;

    try {
        products = await Product.find({ creator: creatorId });
    } catch (err) {
        return next(new HttpError('Fetching products failed, please try again later.', 500));
    }

    if (!products || products.length === 0) {
        return next(new HttpError('Could not find a products for the provided user id.', 404));
    }

    res.json({ products: products.map(product => product.toObject({ getters: true })) });
}

async function createProduct(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { name, protein, price, creator } = req.body;

    const newProduct = new Product( {
        name,
        protein,
        price,
        value: price/protein,
        creator
    });

    let user;
    
    try {
        user = await User.findById(creator);
    } catch (err) {
        return next(new HttpError('Could not find user for provided id.', 404));
    }

    if (!user) {
        return next(new HttpError('Could not find user for provided id.', 404));
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await newProduct.save({ session });

        user.products.push(newProduct);
        await user.save({ session });

        await session.commitTransaction();

    } catch (err) {
        const error = new HttpError('Creating a new product failed.', 500);
        return next(error);
    }

    res.status(201).json({ product: newProduct });
}

async function updateProduct(req, res, next) {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { name, protein, price } = req.body;
    const productId = req.params.pid;

    let product
    try {
        product = await Product.findById(productId);
    } catch (err) {
        return next(new HttpError('Could not find the product.', 500));
    }

    product.name = name;
    product.protein = protein;
    product.price = price;
    product.value = price/protein;

    try {
        await product.save();
    } catch (err) {
        return next(new HttpError('Could not update product.', 500));
    }

    res.status(200).json({ product: product.toObject({ getters: true }) });
}

async function deleteProduct(req, res, next) {
    const productId = req.params.pid;

    let product;
    try {
        product = await Product.findById(productId).populate('creator');
    } catch (err) {
        return next(new HttpError('Could not find the product.', 500));
    }

    if (!product) {
        return next(new HttpError('Could not find the product for this id.', 404));
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await product.deleteOne();

        product.creator.products.pull(product);
        await product.creator.save({ session });

        await session.commitTransaction();
    } catch (err) {
        return next(new HttpError('Could not delete the product.', 500));
    }

    res.status(200).json({ message: 'Product deleted.' });
}

exports.getProductsByUserId = getProductsByUserId;
exports.createProduct = createProduct; 
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
