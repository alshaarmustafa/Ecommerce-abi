const express = require('express');
const { createSubCategory, getsubCategories, getsubCategoryById, updatesubCategory, deletesubCategory } = require('../services/subCategoryService');
const { createsubCategoryValidator, getsubCategoryValidator, updatesubCategoryValidator, deletesubCategoryValidator } = require('../utils/validators/subCategoryValidator');
const setCategoryIdToBody = require('../middleware/setCategoryIdToBody');
const router = express.Router({ mergeParams: true });
router.route('/')
    .get(getsubCategories)
    .post(setCategoryIdToBody,createsubCategoryValidator, createSubCategory);

router.route('/:id')
    .get(getsubCategoryValidator,getsubCategoryById)
    .delete(deletesubCategoryValidator, deletesubCategory)
    .put(updatesubCategoryValidator, updatesubCategory);


module.exports = router;