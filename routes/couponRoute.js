const express = require('express');
const router = express.Router();
const {
    getCoupons,
    getCouponById,
    createCoupon,
    updateCoupon,
    deleteCoupon
} = require('../services/couponService');

const {
    createCouponValidator,
    updateCouponValidator,
    deleteCouponValidator,
    getCouponValidator
} = require('../utils/validators/couponValidator');

//Autentication & Authorization
const { protect } = require('../middleware/verifyToken');
const allowedTo = require('../utils/authorization/allowedTo');
const userRoles = require('../utils/authorization/userRoles');

router.use(protect, allowedTo(userRoles.ADMIN, userRoles.MANAGER))

router.route('/').get(getCoupons).post(createCouponValidator, createCoupon);

router.route('/:id')
    .get(getCouponValidator, getCouponById)
    .put(updateCouponValidator, updateCoupon)
    .delete(deleteCouponValidator, deleteCoupon);



module.exports = router;