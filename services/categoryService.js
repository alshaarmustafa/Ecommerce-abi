const {uploadSingleImage}=require('../middleware/uploadImageMiddleware')
const factury = require('./handlerFactury');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const Category = require('../models/categoryModel');


exports.uploadCategoryImage = uploadSingleImage("image")

exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`uploads/categories/${filename}`);

        // Save the filename into 
        req.body.image = filename;

    next();

})


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