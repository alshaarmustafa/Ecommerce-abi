const {uploadSingleImage}=require('../middleware/uploadImageMiddleware')
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const sharp = require('sharp')
const Brand = require('../models/brandModel');
const factury = require('./handlerFactury');


exports.uploadBrandImage = uploadSingleImage("image")

exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`uploads/brands/${filename}`);

        // Save the filename into 
        req.body.image = filename;

    next();

})




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
// @access  Private/Admin-Manager
exports.createBrand = factury.createOne(Brand);

// @desc    Update brand
// @route   PUT /api/brands/:id
// @access  Private/Admin-Manager
exports.updateBrand = factury.updateOne(Brand);

// @desc    Delete brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
exports.deleteBrand = factury.deleteOne(Brand);