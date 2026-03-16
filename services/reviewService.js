const Review = require('../models/reviewModel');
const factury = require('./handlerFactury');



// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
exports.getReviews = factury.getAll(Review);

// @desc    Get review by id
// @route   GET /api/reviews/:id
// @access  Public
exports.getReviewById = factury.getOne(Review);



exports.setUserID = (req, res, next) => {
    if (!req.body.user) req.body.user = req.user.id;
    next();
    
}

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private/protect/user
exports.createReview = factury.createOne(Review);

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private/protect/user
exports.updateReview = factury.updateOne(Review);

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/protect/user-admin-manager
exports.deleteReview = factury.deleteOne(Review);