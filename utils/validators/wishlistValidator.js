const { check } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleware');
const Product=require('../../models/productModel');

exports.addToWishlistValidator = [
  check('productId')
    .notEmpty()
    .withMessage('Product id is required')
    .isMongoId()
    .withMessage('Invalid product id format')
    .custom(async (value) => {
      const product = await Product.findById(value);
      if (!product) {
        throw new Error('Product not found');
      }
      return true;
    }),
  validatorMiddleware
];
exports.removeFromWishlistValidator = [
  check('productId')
    .isMongoId()
    .withMessage('Invalid product id format'),

  validatorMiddleware
];