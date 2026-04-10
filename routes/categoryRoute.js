const express = require('express');
const router = express.Router();

const {
    getCategories,
    getCategoryById,
    createCategory,
    deleteCategory,
    updateCategory,
    uploadCategoryImage,
    resizeImage
} = require('../services/categoryService');

const {
    getCategoryValidator,
    createCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator
} = require('../utils/validators/categoryValidator');

//Autentication & Authorization
const { protect } = require('../middleware/verifyToken');
const allowedTo = require('../utils/authorization/allowedTo');
const userRoles = require('../utils/authorization/userRoles');



const subcategoryRoute = require('./subCategoryRoute');

router.use('/:categoryId/subcategories', subcategoryRoute);


router.route('/')
    .get(getCategories)

    .post(
        protect,
        allowedTo(userRoles.ADMIN, userRoles.MANAGER),
        uploadCategoryImage,
        resizeImage,
        createCategoryValidator,
        createCategory
    );

router.route('/:id')
    .get(getCategoryValidator, getCategoryById)

    .put(
        protect,
        allowedTo(userRoles.ADMIN, userRoles.MANAGER),
        uploadCategoryImage,
        resizeImage,
        updateCategoryValidator,
        updateCategory
    )

    .delete(
        protect,
        allowedTo(userRoles.ADMIN),
        deleteCategoryValidator,
        deleteCategory
    );



module.exports = router;