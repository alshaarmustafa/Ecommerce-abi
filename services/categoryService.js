const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const Category = require('../models/categoryModel');
const ApiFeatures = require('../utils/apiFeatures');


// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
    const countDocuments = await Category.countDocuments();
    //build query
    const apiFeatures = new ApiFeatures(Category.find(), req.query).search().filter()
        .sort().limitFields().paginate(countDocuments)


    //execute quer
    const { mongooseQuery, paginationResult } = apiFeatures;
    const categories = await mongooseQuery;
    res.status(200).json({ results: categories.length, paginationResult, data: categories });
});



// @desc    Get category by id
// @route   GET /api/categories/:id
// @access  Public
exports.getCategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
        res.status(404).json({ message: `No category for this id ${id}` });
    }
    res.status(200).json({ data: category });
});



// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = asyncHandler(async (req, res) => {
    const name = req.body.name;
    const category = await Category.create({ name, slug: slugify(name) });
    res.status(201).json({ data: category });
});





// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const name = req.body.name;
    const category = await Category.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true });
    if (!category) {
        res.status(404).json({ message: `No category for this id ${id}` });
    }

    res.status(200).json({ data: category });
});


// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
        res.status(404).json({ message: `No category for this id ${id}` });
    }
    res.status(204).json({ data: null });
});