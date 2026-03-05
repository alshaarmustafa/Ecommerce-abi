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

const { getCategoryValidator, createCategoryValidator, updateCategoryValidator, deleteCategoryValidator } = require('../utils/validators/categoryValidator');



const subcategoryRoute = require('./subCategoryRoute');

router.use('/:categoryId/subcategories', subcategoryRoute);

router.route('/')
    .get(getCategories)

    .post(
        uploadCategoryImage,
        resizeImage,
        createCategoryValidator,
        createCategory
    );

router.route('/:id')
    .get(getCategoryValidator, getCategoryById)

    .put(
        uploadCategoryImage,
        resizeImage,
        updateCategoryValidator,
        updateCategory
    )

    .delete(deleteCategoryValidator, deleteCategory);



module.exports = router;