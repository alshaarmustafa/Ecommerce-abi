const User=require("../models/userModel")
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs')
const generateToken = require("../utils/generateToken")

// @desc    get logged User Data 
// @route   GET /api/users/getMe
// @access  Private/protect
exports.getloggedUserData = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
});

// @desc    Update logged User password
// @route   PUT /api/users/changeMyPassword
// @access  Private/protect
exports.UpdateLoggedUserPassword = asyncHandler(async (req, res, next) => {
    // 1) Update user password based user payload (req.user._id)
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now(),
        },
        {
            new: true,
        }
    );

    // 2) Generate token
    const token = generateToken(user._id);

    res.status(200).json({ data: user, token });
});

// @desc    Update logged User Data
// @route   PUT /api/users/changeMydata
// @access  Private/protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
        },
        { new: true }
    );

    res.status(200).json({ data: updatedUser });
});

// @desc    Deactivate logged user
// @route   DELETE api/users/deleteMe
// @access  Private/Protect
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { active: false });

    res.status(200).json({ status: 'Success', message: "Account Deactivated" });
});

// @desc    Activate logged user
// @route   PUT api/users/activateMe
// @access  Private/Protect
exports.activateLoggedUserData = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { active: true });

    res.status(200).json({ status: 'Success', message: "Account Activated" });
});