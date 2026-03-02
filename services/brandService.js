const Brand = require('../models/brandModel');
const factury = require('./handlerFactury');

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
exports.getBrands = factury.getAll(Brand);



// @desc    Get brand by id
// @route   GET /api/brands/:id
// @access  Public
exports.getBrandById = factury.getOne(Brand);



// @desc    Create new brand
// @route   POST /api/brands
// @access  Private/Admin
exports.createBrand = factury.createOne(Brand);

// @desc    Update brand
// @route   PUT /api/brands/:id
// @access  Private/Admin
exports.updateBrand = factury.updateOne(Brand);

// @desc    Delete brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
exports.deleteBrand = factury.deleteOne(Brand);