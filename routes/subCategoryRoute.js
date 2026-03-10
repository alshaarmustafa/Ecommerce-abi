const express = require('express');
const {
    createSubCategory,
    getsubCategories,
    getsubCategoryById,
    updatesubCategory,
    deletesubCategory
} = require('../services/subCategoryService');
const {
    createsubCategoryValidator,
    getsubCategoryValidator,
    updatesubCategoryValidator,
    deletesubCategoryValidator
} = require('../utils/validators/subCategoryValidator');

const router = express.Router({ mergeParams: true });
const setCategoryIdToBody = require('../middleware/setCategoryIdToBody');
const createFilterObj = require('../middleware/createFilterObj');

//Autentication & Authorization
const { protect } = require('../middleware/verifyToken');
const allowedTo = require('../utils/authorization/allowedTo');
const userRoles = require('../utils/authorization/userRoles');

router.route('/')

    .post(
        protect,
        allowedTo(userRoles.ADMIN, userRoles.MANAGER),
        setCategoryIdToBody,
        createsubCategoryValidator,
        createSubCategory
    )
    .get(createFilterObj, getsubCategories)

router.route('/:id')

    .get(getsubCategoryValidator, getsubCategoryById)

    .put(
        protect,
        allowedTo(userRoles.ADMIN, userRoles.MANAGER),
        updatesubCategoryValidator,
        updatesubCategory
    )

    .delete(
        protect,
        allowedTo(userRoles.ADMIN),
        deletesubCategoryValidator,
        deletesubCategory
    );


module.exports = router;