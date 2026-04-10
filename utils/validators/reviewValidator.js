const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleware');
const Review = require('../../models/reviewModel');

exports.getReviewValidator = [
  check('id').isMongoId().withMessage('Invalid Review id format'),
  validatorMiddleware,
];

exports.createReviewValidator = [
  check('title').isString().withMessage('Review title must be a string'),
  check('ratings')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be between 1.0 and 5.0'),
  check('user')
    .isMongoId()
    .withMessage('Invalid user id format')
    .custom(async (value, { req }) => {
      const review = await Review.findOne({
        user: value,
        product: req.body.product
      });

      if (review) {
        throw new Error('You already reviewed this product');
      }

      return true;
    }),

  check('product').isMongoId().withMessage('Invalid product id format'),
  
  validatorMiddleware,
];

exports.updateReviewValidator = [

  check('id')
    .isMongoId()
    .withMessage('Invalid review id format')
    .custom(async (value, { req }) => {

      const review = await Review.findById(value);

      if (!review) {
        throw new Error('Review not found');
      }

      if (review.user._id.toString() !== req.user._id.toString()) {
        throw new Error('You are not allowed to update this review');
      }

      return true;
    }),

  check('title')
    .optional()
    .isString()
    .withMessage('Review title must be a string'),

  check('ratings')
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),

  validatorMiddleware
];

exports.deleteReviewValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid review id format')
    .custom(async (value, { req }) => {

      const review = await Review.findById(value);

      if (!review) {
        throw new Error('Review not found');
      }

      if (review.user._id.toString() !== req.user._id.toString()) {
        throw new Error('You are not allowed to delete this review');
      }

      return true;
    }),
  
  validatorMiddleware,
];
