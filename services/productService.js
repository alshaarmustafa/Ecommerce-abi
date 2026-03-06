const multer = require('multer');
const AppError = require('../utils/AppError');
const Product = require('../models/productModel');
const factury = require('./handlerFactury')
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const { uploadMixOfImages } = require('../middleware/uploadImageMiddleware')


exports.uploadProductImages = uploadMixOfImages([
    {
        name: "imageCover", maxCount: 1
    },
    {
        name: "images", maxCount: 5
    }
])

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
    //Image processing for imageCover

    if (req.files.imageCover) {
        const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`
        await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/products/${imageCoverFileName}`);
        req.body.imageCover = imageCoverFileName;
    }

    if (req.files.images) {
        req.body.images = [];
        await Promise.all(
            req.files.images.map(async (image, index) => {
                const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`
                await sharp(image.buffer)
                    .resize(2000, 1333)
                    .toFormat('jpeg')
                    .jpeg({ quality: 95 })
                    .toFile(`uploads/products/${imageName}`);
                req.body.images.push(imageName);
            })
        )
    }
    next()
});


// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = factury.getAll(Product, 'Product');

// @desc    Get product by id 
// @route   GET /api/products/:id
// @access  Public
exports.getProdcutById = factury.getOne(Product);

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = factury.createOne(Product);

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = factury.updateOne(Product);

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = factury.deleteOne(Product);