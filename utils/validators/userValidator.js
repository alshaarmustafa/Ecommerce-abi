const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleware');
const slugify = require('slugify');
const User = require("../../models/userModel")
const AppError = require('../AppError');
const bcrypt =require("bcryptjs")
exports.createUserValidator = [
  check('name')
    .notEmpty()
    .withMessage('User name required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters')
    .isLength({ max: 32 })
    .withMessage('Name must be at most 32 characters')
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new AppError('Email already exists', 400);
      }
    }),

  check('phone')
    .optional()
    .isMobilePhone('ar-SY')
    .withMessage('Invalid phone number'),

  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  check('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new AppError('Password confirmation does not match password', 400);
      }
      return true;
    }),

  check('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Invalid role'),

  check('active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean'),

  validatorMiddleware,
];

exports.updateUserValidator = [
  check('name')
    .optional()
    .notEmpty()
    .withMessage('User name required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters')
    .isLength({ max: 32 })
    .withMessage('Name must be at most 32 characters')
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  check('email')
    .optional()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new AppError('Email already exists', 400);
      }
    }),

  check('phone')
    .optional()
    .notEmpty()
    .withMessage('Phone is required')
    .isMobilePhone('ar-SY')
    .withMessage('Invalid phone number'),

  check('password')
    .optional()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  check('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new AppError('Password confirmation does not match password', 400);
      }
      return true;
    }),

  check('role')
    .optional()
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['user', 'admin'])
    .withMessage('Invalid role'),

  check('active')
    .optional()
    .notEmpty()
    .withMessage('Active is required')
    .isBoolean()
    .withMessage('Active must be a boolean'),

  validatorMiddleware,
];

exports.getUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  validatorMiddleware,
];
exports.changeUserPasswordValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  check('currentPassword').notEmpty().withMessage("you must provide current password"),
  check('confirmPassword').notEmpty().withMessage("you must provide confirm password"),
  check('password').notEmpty().withMessage("you must provide new password")
    .custom(async (value, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new AppError('User not found', 404);
      }
      const isCurrentPasswordValid = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new AppError('Current password is incorrect', 400);
      }

      if (value !== req.body.confirmPassword) {
        throw new AppError('Password confirmation does not match password', 400);
      }
      return true;
    })
  ,

  validatorMiddleware
];

// exports.UpdateLoggedUserPasswordValidator = [
//   check('currentPassword').notEmpty().withMessage("you must provide current password"),
//   check('confirmPassword').notEmpty().withMessage("you must provide confirm password"),
//   check('password').notEmpty().withMessage("you must provide new password")
//     .custom(async (value, { req }) => {
//       const user = await User.findById(req.user._id);
//       if (!user) {
//         throw new AppError('User not found', 404);
//       }
//       const isCurrentPasswordValid = await bcrypt.compare(req.body.currentPassword, user.password);
//       if (!isCurrentPasswordValid) {
//         throw new AppError('Current password is incorrect', 400);
//       }

//       if (value !== req.body.confirmPassword) {
//         throw new AppError('Password confirmation does not match password', 400);
//       }
//       return true;
//     })
//   ,

//   validatorMiddleware]
exports.updateLoggedUserDataValidator = [
  check('name')
    .optional()
    .notEmpty()
    .withMessage('User name required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters')
    .isLength({ max: 32 })
    .withMessage('Name must be at most 32 characters')
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  check('email')
    .optional()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new AppError('Email already exists', 400);
      }
    }),

  check('phone')
    .optional()
    .notEmpty()
    .withMessage('Phone is required')
    .isMobilePhone('ar-SY')
    .withMessage('Invalid phone number'),

  validatorMiddleware,
]