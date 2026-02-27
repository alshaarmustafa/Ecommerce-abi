const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const { contextsKey } = require('express-validator/lib/base');


// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
    // Filtering
    const queryObj = { ...req.query };
    const excludesFields = ['page', 'limit', 'sort', 'fields','keyword'];
    excludesFields.forEach(field => delete queryObj[field]);

    // Apply filtration using [gte, gt, lte, lt]
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    //pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    //build query
    let mongooseQuery = Product.find(JSON.parse(queryStr))
        .skip(skip).limit(limit)
        .populate({ path: 'category', select: 'name -_id' })

    //sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        mongooseQuery = mongooseQuery.sort(sortBy);
    } else {
        mongooseQuery.sort('-createdAt');
    }
    //fields limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');

        console.log(req.query.fields);
        console.log(fields);
        mongooseQuery = mongooseQuery.select(fields);
    } else {
        mongooseQuery = mongooseQuery.select('-__v');
    }
    //searching
    console.log(req.query.keyword);
    if (req.query.keyword) {
        const query = {};
        query.$or = [
            { title: { $regex: req.query.keyword, $options: 'i' } },
            { description: { $regex: req.query.keyword, $options: 'i' } },
        ],

            mongooseQuery = mongooseQuery.find(query);
    }


    //execute query

    const products = await mongooseQuery;

    res.status(200).json({ results: products.length, page, data: products });
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