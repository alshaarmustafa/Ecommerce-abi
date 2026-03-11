const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const sendEmail = require('../utils/sendEamil');
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

// @desc    Forget password
// @route   POST /api/auth/forgetPassword
// @access  Public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
    //1-Get user based on  email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError(`There is no user with email address ${req.body.email}`, 404))
    }
    //2-if user exist generate hash reset random 6 digit and save it in DB
    const resetCode = Math.floor(1000000 + Math.random() * 9000000).toString();
    const hashResetCode = await bcrypt.hash(resetCode, 12);

    //3-save user password reset code into db with expire time(10min)
    user.passwordResetCode = hashResetCode;
    user.passwordResetCodeExpire = Date.now() + 10 * 60 * 1000;
    user.passwordResetVerified = false;
    await user.save();
    //4- send it to user via  email
    const message = `Hi ${user.name}\n Your password reset code is\n ${resetCode} This code will expire in 10 minutes.`
    try {
        await sendEmail({
            email: user.email,
            subject: "Your password reset code",
            message
        });

    } catch (error) {
        user.passwordResetCode = undefined;
        user.passwordResetCodeExpire = undefined;
        user.passwordResetVerified = undefined;
        await user.save();
        return next(new AppError("There is problem in sending email", 500))
    }
    res.status(200).json({ status: "Success", message: "Reset code sent to your email" });
});