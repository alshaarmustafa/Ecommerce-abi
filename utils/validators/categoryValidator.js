const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleware');
const slugify = require('slugify');
const Category = require('../../models/categoryModel');
const AppError = require('../AppError');
exports.getCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id format'),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('Category name required')
    .custom(async (value, { req }) => {
      const category = await Category.findOne({ name: value });
      if (category) {
        throw new AppError('Category already exists', 400);
      }
    })
    .isLength({ min: 3 })
    .withMessage('Too short category name')
    .isLength({ max: 32 })
    .withMessage('Too long category name')
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }), ,
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id format'),
  check('name')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Too short category name')
    .isLength({ max: 32 })
    .withMessage('Too long category name'),
  body("name")
    .optional()
    .notEmpty()
    .withMessage('Category name required')
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    })
  ,
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id format'),
  validatorMiddleware,
];
