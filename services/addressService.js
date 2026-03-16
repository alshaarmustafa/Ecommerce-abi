const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// @desc    Add address to user addresses list
// @route   POST /api/addresses
// @access  protected/User
exports.addAddress = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id,
        {
            $addToSet: { addresses: req.body }
        },
        { returnDocument: 'after' });
    res.status(200).json({ status: "success", message: "address added successfully ", data: user.addresses });
});

// @desc    Remove address from user addresses list
// @route   DELETE /api/addresses/:addressId
// @access  protected/User
exports.removeAddress = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id,
        {
            $pull: { addresses: { _id: req.params.addressId } }
        },
        { returnDocument: 'after' });
    res.status(200).json({ status: "success", message: "address Removed successfully", data: user.addresses });
});

// @desc    get addresses from wishlist
// @route   GET /api/addresses
// @access  protected/User
exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user._id)

    res.status(200).json({ status: "success", result: user.addresses.length, data: user.addresses });
});

// @desc    Update address from user addresses list
// @route   PUT /api/addresses/:addressId
// @access  protected/User
exports.updateUserAddress = asyncHandler(async (req, res, next) => {

    const user = await User.findOneAndUpdate(
        { _id: req.user._id, "addresses._id": req.params.addressId },

        {
            $set: {
                "addresses.$.alias": req.body.alias,
                "addresses.$.details": req.body.details,
                "addresses.$.phone": req.body.phone,
                "addresses.$.city": req.body.city,
                "addresses.$.postalCode": req.body.postalCode
            }
        },

        { returnDocument: "after" }
    );

    res.status(200).json({ status: "success", message: "Address updated successfully", data: user.addresses });

});