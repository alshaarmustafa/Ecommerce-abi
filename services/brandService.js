const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const Brand = require('../models/brandModel');
const ApiFeatures = require('../utils/apiFeatures');


// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
exports.getBrands = asyncHandler(async (req, res) => {
    const countDocuments = await Brand.countDocuments();
    //build query
    const apiFeatures = new ApiFeatures(Brand.find(), req.query).search().filter()
        .sort().limitFields().paginate(countDocuments)


    //execute quer
    const { mongooseQuery, paginationResult } = apiFeatures;
    const brands = await mongooseQuery;

    res.status(200).json({ results: brands.length, paginationResult, data: brands });
});



// @desc    Get brand by id
// @route   GET /api/brands/:id
// @access  Public
exports.getBrandById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const brand = await Brand.findById(id);
    if (!brand) {
        res.status(404).json({ message: `No brand for this id ${id}` });
    }
    res.status(200).json({ data: brand });
});



// @desc    Create new brand
// @route   POST /api/brands
// @access  Private/Admin
exports.createBrand = asyncHandler(async (req, res) => {
    const name = req.body.name;
    const brand = await Brand.create({ name, slug: slugify(name) });
    res.status(201).json({ data: brand });
});





// @desc    Update brand
// @route   PUT /api/brands/:id
// @access  Private/Admin
exports.updateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const name = req.body.name;
    const brand = await Brand.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true });
    if (!brand) {
        res.status(404).json({ message: `No brand for this id ${id}` });
    }

    res.status(200).json({ data: brand });
});


// @desc    Delete brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
exports.deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) {
        res.status(404).json({ message: `No brand for this id ${id}` });
    }
    res.status(204).json({ data: null });
});