const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const generateToken = (payload) => {
    return jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE_TIME })

}

// @desc    signup
// @route   POST /api/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });
    const token = generateToken(user._id);

    res.status(201).json({ data: user, token })
});

// @desc    login
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new AppError("Incorrect email or password", 401))
    }

    const token = generateToken(user._id);

    res.status(200).json({ data: user, token })
});

