const express = require('express');
const { createSubCategory, getsubCategories, getsubCategoryById, updatesubCategory, deletesubCategory } = require('../services/subCategoryService');
const { createsubCategoryValidator, getsubCategoryValidator, updatesubCategoryValidator, deletesubCategoryValidator } = require('../utils/validators/subCategoryValidator');
const router = express.Router({ mergeParams: true });
const setCategoryIdToBody = require('../middleware/setCategoryIdToBody');
const createFilterObj = require('../middleware/createFilterObj');


router.route('/')
.post(setCategoryIdToBody,createsubCategoryValidator, createSubCategory)
.get(createFilterObj,getsubCategories)

router.route('/:id')
    .get(getsubCategoryValidator,getsubCategoryById)
    .delete(deletesubCategoryValidator, deletesubCategory)
    .put(updatesubCategoryValidator, updatesubCategory);


module.exports = router;