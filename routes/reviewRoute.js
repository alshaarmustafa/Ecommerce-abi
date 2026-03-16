const express = require('express');
const router = express.Router();
const {
    getReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview,
    setUserID
} = require('../services/reviewService');

const {
    getReviewValidator,
    createReviewValidator,
    updateReviewValidator,
    deleteReviewValidator
} = require('../utils/validators/reviewValidator');

const { protect } = require('../middleware/verifyToken');
//Autentication & Authorization
const allowedTo = require('../utils/authorization/allowedTo');
const userRoles = require('../utils/authorization/userRoles');

router.route('/')
    .get(getReviews)

    .post(
        protect,
        allowedTo(userRoles.USER),
        setUserID,
        createReviewValidator,
        createReview
    );

router.route('/:id')
    .get(getReviewValidator,getReviewById)

    .put(
        protect,
        allowedTo(userRoles.USER),
        updateReviewValidator,
        updateReview

    )

    .delete(
        protect,
        allowedTo(userRoles.ADMIN, userRoles.MANAGER, userRoles.USER),
        deleteReviewValidator,
        deleteReview
    );



module.exports = router;