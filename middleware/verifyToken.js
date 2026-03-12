const User = require("../models/userModel");
const asyncHandler = require('express-async-handler');
const AppError = require('../utils/AppError');
const jwt = require('jsonwebtoken');

// @desc   make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
    // 1) Check if token exist, if exist get
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not login, Please login to get access this route', 401));
    }

    // 2) Verify token (no change happens, expired token)
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            console.log("Token expired");
            return next(new AppError('Token expired', 401));
        } else if (err.name === "JsonWebTokenError") {
            console.log("Invalid token");
            return next(new AppError('Invalid token', 401));
        } else {
            console.log(err);
        }
    }
    // 3) Check if user exists
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
        return next(new AppError('The user that belong to this token does no longer exist', 401));
    }

    // 4) Check if user change his password after token created
    if (currentUser.passwordChangedAt) {
        const passChangedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
        // Password changed after token created (Error)
        if (passChangedTimestamp > decoded.iat) {
            return next(new AppError('User recently changed his password. please login again..', 401));
        }
    }
    req.user = currentUser;
    next();
});

