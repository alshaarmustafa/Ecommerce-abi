const { check } = require('express-validator');
const validatorMiddleware = require('../../middleware/validatorMiddleware');
const Coupon = require('../../models/couponModel');


exports.createCouponValidator = [
    check('name')
        .notEmpty()
        .withMessage('Coupon name required')
        .isLength({ min: 3, max: 20 })
        .withMessage('Coupon name must be between 3 and 20 characters')
        .custom(async (value) => {
            const coupon = await Coupon.findOne({ name: value.toUpperCase() });
            if (coupon) {
                throw new Error('Coupon name already exists');
            }
            return true;
        }),

    check('expire')
        .notEmpty()
        .withMessage('Coupon expire time required')
        .isISO8601()
        .withMessage('Invalid date format')
        .custom((value) => {
            if (new Date(value) <= new Date()) {
                throw new Error('Expire date must be in the future');
            }
            return true;
        }),

    check('discount')
        .notEmpty()
        .withMessage('Coupon discount value required')
        .isNumeric()
        .withMessage('Discount must be a number')
        .isFloat({ min: 0, max: 100 })
        .withMessage('Discount must be between 0 and 100'),

    validatorMiddleware,
];
exports.updateCouponValidator = [
    check('name')
        .optional()
        .notEmpty()
        .withMessage('Coupon name required')
        .custom(async (value, { req }) => {
            const coupon = await Coupon.findOne({ name: value.toUpperCase() });

            if (coupon && coupon._id.toString() !== req.params.id) {
                throw new Error('Coupon name already exists');
            }
            return true;
        }),

    check('expire')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format')
        .custom((value) => {
            if (new Date(value) <= new Date()) {
                throw new Error('Expire date must be in the future');
            }
            return true;
        }),

    check('discount')
        .optional()
        .isNumeric()
        .withMessage('Discount must be a number')
        .isFloat({ min: 0, max: 100 })
        .withMessage('Discount must be between 0 and 100'),

    validatorMiddleware,
];

exports.getCouponValidator = [
    check('id').isMongoId().withMessage('Invalid Coupon id format'),
    validatorMiddleware,
];
exports.deleteCouponValidator = [
    check('id').isMongoId().withMessage('Invalid Coupon id format'),
    validatorMiddleware,
];
