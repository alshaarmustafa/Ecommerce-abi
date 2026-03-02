const Product = require('../models/productModel');
const factury = require('./handlerFactury')

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = factury.getAll(Product,'Product');

// @desc    Get product by id 
// @route   GET /api/products/:id
// @access  Public
exports.getProdcutById = factury.getOne(Product);

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = factury.createOne(Product);

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = factury.updateOne(Product);

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = factury.deleteOne(Product);