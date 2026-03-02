const Category = require('../models/categoryModel');
const factury = require('./handlerFactury')


// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = factury.getAll(Category);



// @desc    Get category by id
// @route   GET /api/categories/:id
// @access  Public
exports.getCategoryById = factury.getOne(Category);



// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = factury.createOne(Category);





// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = factury.updateOne(Category);


// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = factury.deleteOne(Category);