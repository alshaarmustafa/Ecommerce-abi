const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const ApiFeatures = require('../utils/apiFeatures');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
    const countDocuments = await Product.countDocuments();
    //build query
    const apiFeatures = new ApiFeatures(Product.find(), req.query).search("Product").filter()
        .sort().limitFields().paginate(countDocuments)

    //execute quer
    const { mongooseQuery, paginationResult } = apiFeatures;
    const products = await mongooseQuery;

    res.status(200).json({ results: products.length, paginationResult, data: products });

});



// @desc    Get product by id 
// @route   GET /api/products/:id
// @access  Public
exports.getProdcutById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        res.status(404).json({ message: `No product for this id ${id}` });
    }
    res.status(200).json({ data: product });
});



// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = asyncHandler(async (req, res) => {
    req.body.slug = slugify(req.body.title);
    const product = await Product.create(req.body);
    res.status(201).json({ data: product });
});





// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    if (req.body.title) req.body.slug = slugify(req.body.title);

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!product) {
        res.status(404).json({ message: `No product for this id ${id}` });
    }

    res.status(200).json({ data: product });
});


// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
        res.status(404).json({ message: `No product for this id ${id}` });
    }
    res.status(204).json({ data: null });
});