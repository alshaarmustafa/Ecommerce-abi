const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const SubCategory = require('../models/subCategoryModel');
const AppError = require('../utils/AppError');
const ApiFeatures = require('../utils/apiFeatures');



// @desc    Create new subCategory
// @route   POST /api/subCategories
// @access  Private/Admin
exports.createSubCategory = asyncHandler(async (req, res, next) => {
    const { name, category } = req.body;

    const subCategory = await SubCategory.create({ name, slug: slugify(name), category });

    res.status(201).json({ data: subCategory });
});

// @desc    Get all subCategories
// @route   GET /api/subCategories
// @access  Public
exports.getsubCategories = asyncHandler(async (req, res) => {
    //filtering by category id if exist in params (we will use this in get subCategories by category)
    let filterObject = {};
    if (req.params.categoryID) filterObject = { category: req.params.categoryID }
    const countDocuments = await SubCategory.countDocuments();
    //build query
    const apiFeatures = new ApiFeatures(
        SubCategory.find(filterObject).populate({ path: "category", select: 'name -_id' }),
        req.query
    ).search().filter().sort().limitFields().paginate(countDocuments)
    //execute quer
    const { mongooseQuery, paginationResult } = apiFeatures;
    const subCategories = await mongooseQuery;
    res.status(200).json({ results: subCategories.length, paginationResult, data: subCategories });
});



// @desc    Get subCategory by id
// @route   GET /api/subCategories/:id
// @access  Public
exports.getsubCategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const subCategory = await SubCategory.findById(id).populate({ path: "category", select: 'name -_id' });
    if (!subCategory) {
        res.status(404).json({ message: `No subCategory for this id ${id}` });
    }
    res.status(200).json({ data: subCategory });
});

// @desc    Update subCategory
// @route   PUT /api/subCategories/:id
// @access  Private/Admin
exports.updatesubCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, category } = req.body.name;
    const subCategory = await SubCategory.findByIdAndUpdate(id, { name, slug: slugify(name), category }, { new: true });
    if (!subCategory) {
        res.status(404).json({ message: `No subCategory for this id ${id}` });
    }

    res.status(200).json({ data: subCategory });
});


// @desc    Delete subCategory
// @route   DELETE /api/subCategories/:id
// @access  Private/Admin
exports.deletesubCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const subCategory = await SubCategory.findByIdAndDelete(id);
    if (!subCategory) {
        res.status(404).json({ message: `No subCategory for this id ${id}` });
    }
    res.status(204).json({ data: null });
});