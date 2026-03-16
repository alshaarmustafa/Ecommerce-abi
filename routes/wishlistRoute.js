const express = require('express');
const router = express.Router();
const {
    addProductToWishlist,
    removeProductFromWishlist,
    getLoggedUserWishlist

} = require('../services/wishlistService');

const {
    addToWishlistValidator,
    removeFromWishlistValidator
} = require('../utils/validators/wishlistValidator');

//Autentication & Authorization
const { protect } = require('../middleware/verifyToken');
const allowedTo = require('../utils/authorization/allowedTo');
const userRoles = require('../utils/authorization/userRoles');




router.use(protect, allowedTo(userRoles.USER))


router.route('/')
    .post(addToWishlistValidator, addProductToWishlist)
    .get(getLoggedUserWishlist)

router.delete('/:productId',removeFromWishlistValidator,removeProductFromWishlist);



module.exports = router;