const { check } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleware');

exports.addAddressValidator = [

  check('alias')
    .notEmpty()
    .withMessage('Alias is required')
    .isString()
    .withMessage('Alias must be a string'),

  check('details')
    .notEmpty()
    .withMessage('Address details required')
    .isString()
    .withMessage('Details must be a string'),

  check('phone')
    .notEmpty()
    .withMessage('Phone required')
    .isMobilePhone('any')
    .withMessage('Invalid phone number'),

  check('city')
    .notEmpty()
    .withMessage('City required')
    .isString(),

  check('postalCode')
    .optional()
    .isPostalCode('any')
    .withMessage('Invalid postal code'),

  validatorMiddleware
];

exports.removeAddressValidator = [

  check('addressId')
    .isMongoId()
    .withMessage('Invalid address id format'),

  validatorMiddleware
];

exports.updateAddressValidator = [

  check('addressId')
    .isMongoId()
    .withMessage('Invalid address id format'),

  check('alias')
    .optional()
    .isString()
    .withMessage('Alias must be a string'),

  check('details')
    .optional()
    .isString()
    .withMessage('Details must be a string'),

  check('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Invalid phone'),

  check('city')
    .optional()
    .isString(),

  check('postalCode')
    .optional()
    .isPostalCode('any'),

  validatorMiddleware
];