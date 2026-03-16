const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// @desc    Add prouct to wishlist
// @route   POST /api/wishlist
// @access  protected/User
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id,
        {
            $addToSet: { wishlist: req.body.productId }
        },
        { returnDocument: 'after' });
    res.status(200).json({ status: "success", message: "Product added to wishlist", data: user.wishlist });
});

// @desc    Remove prouct from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  protected/User
exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id,
        {
            $pull: { wishlist: req.params.productId }
        },
        { returnDocument: 'after' });
    res.status(200).json({ status: "success", message: "Product Removed from wishlist", data: user.wishlist });
});

// @desc    get proucts from wishlist
// @route   GET /api/wishlist
// @access  protected/User
exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {

    const user =await User.findById(req.user._id).populate("wishlist");

    res.status(200).json({ status: "success", result:user.wishlist.length , data: user.wishlist });
});