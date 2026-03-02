const SubCategory = require('../models/subCategoryModel');
const factury = require('./handlerFactury')






// @desc    Create new subCategory
// @route   POST /api/subCategories
// @access  Private/Admin
exports.createSubCategory = factury.createOne(SubCategory);
// @desc    Get all subCategories
// @route   GET /api/subCategories
// @access  Public
exports.getsubCategories = factury.getAll(SubCategory);
// @desc    Get subCategory by id
// @route   GET /api/subCategories/:id
// @access  Public
exports.getsubCategoryById = factury.getOne(SubCategory);
// @desc    Update subCategory
// @route   PUT /api/subCategories/:id
// @access  Private/Admin
exports.updatesubCategory = factury.updateOne(SubCategory)

// @desc    Delete subCategory
// @route   DELETE /api/subCategories/:id
// @access  Private/Admin
exports.deletesubCategory = factury.deleteOne(SubCategory);