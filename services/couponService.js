const factury = require('./handlerFactury');
const Coupon = require('../models/couponModel');



// @desc    Get all Coupons
// @route   GET /api/coupons
// @access  Private/Admin-Manager
exports.getCoupons = factury.getAll(Coupon);

// @desc    Get coupon by id
// @route   GET /api/coupons/:id
// @access  Private/Admin-Manager
exports.getCouponById = factury.getOne(Coupon);

// @desc    Create new coupon
// @route   POST /api/coupons
// @access  Private/Admin-Manager
exports.createCoupon = factury.createOne(Coupon);

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin-Manager
exports.updateCoupon = factury.updateOne(Coupon);

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin-Manager
exports.deleteCoupon = factury.deleteOne(Coupon);