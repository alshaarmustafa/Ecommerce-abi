const express = require('express');
const router = express.Router();
const {
    addProductToCart,
    getLoggedUserCart,
    removeSpecificCartItem,
    clearLoggedUserCart,
    updateCartItemQuantity
} = require('../services/cartService');

// const {

// } = require('../utils/validators/');

//Autentication & Authorization
const { protect } = require('../middleware/verifyToken');
const allowedTo = require('../utils/authorization/allowedTo');
const userRoles = require('../utils/authorization/userRoles');

router.use(protect, allowedTo(userRoles.USER))

router.route('/')
    .post(addProductToCart)
    .get(getLoggedUserCart)
    .delete(clearLoggedUserCart);

router.route('/:itemId')
    .delete(removeSpecificCartItem)
    .put(updateCartItemQuantity)
//     .put(updateCouponValidator, updateCoupon)
//     .delete(deleteCouponValidator, deleteCoupon);



module.exports = router;