const { uploadSingleImage } = require('../middleware/uploadImageMiddleware')
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const sharp = require('sharp')
const User = require('../models/userModel');
const factury = require('./handlerFactury');
const bcrypt = require('bcryptjs')

exports.uploadUserImage = uploadSingleImage("profileImage")

exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
    if (req.file) {
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`uploads/users/${filename}`);

        // Save the filename into 
        req.body.profileImage = filename;
    }

    next();

})



// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin-Manager
exports.getUsers = factury.getAll(User);

// @desc    Get user by id
// @route   GET /api/users/:id
// @access  Private/Admin-Manager
exports.getUserById = factury.getOne(User);

// @desc    Create new user
// @route   POST /api/users
// @access  Private/Admin-Manager
exports.createUser = factury.createOne(User);

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = factury.deleteOne(User);

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin-Manager
exports.updateUser = asyncHandler(async (req, res) => {

    const document = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        role: req.body.role,
        phone: req.body.phone,
        profileImage: req.body.profileImage,
        active: req.body.active
    },
        { returnDocument: 'after', runValidators: true }
    );
    if (!document) {
        res.status(404).json({ message: `No document for this id ${req.params.id}` });
    }

    res.status(200).json({ data: document });
});

exports.updateUserPassword = asyncHandler(async (req, res, next) => {
    if (!req.body || !req.body.password) {
        return res.status(400).json({ message: "Password is required" });
    }
    const document = await User.findByIdAndUpdate(
        req.params.id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now(),
        },
        {
            new: true,
        }
    );

    if (!document) {
        return next(new ApiError(`No document for this id ${req.params.id}`, 404));
    }
    res.status(200).json({ data: document });
});