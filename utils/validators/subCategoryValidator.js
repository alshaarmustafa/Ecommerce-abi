const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleware');
const Category = require("../../models/categoryModel")
const slugify = require('slugify');

exports.getsubCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid subCategory id format'),
  validatorMiddleware,
];

exports.createsubCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('subCategory required')
    .isLength({ min: 2 })
    .withMessage('Too short subCategory name')
    .isLength({ max: 32 })
    .withMessage('Too long subCategory name')
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  check("category")
    .notEmpty()
    .withMessage("subCategory must be belong to a Category")
    .isMongoId()
    .withMessage('Invalid Category id format')
    .custom(async (categoryId) => {
      const result = await Category.findById(categoryId);
      if (!result) {
        throw new Error(`No category for this id: ${categoryId}`);
      }
      return true;
    }),
  validatorMiddleware,
];

exports.updatesubCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid subCategory id format'),
  check('name')
    .notEmpty()
    .withMessage('Brand required')
    .isLength({ min: 3 })
    .withMessage('Too short brand name')
    .isLength({ max: 32 })
    .withMessage('Too long brand name'),
  check("category")
    .notEmpty()
    .withMessage("subCategory must be belong to a Category")
    .isMongoId()
    .withMessage('Invalid Category id format'),
  body("name").custom((value, { req }) => {
    req.body.slug = slugify(value);
    return true;
  }),
  validatorMiddleware
];

exports.deletesubCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid subCategory id format'),
  validatorMiddleware,
];
