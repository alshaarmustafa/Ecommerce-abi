const express = require('express');
const router = express.Router();
const {
    getBrands,
    getBrandById,
    createBrand,
    updateBrand,
    deleteBrand,
    uploadBrandImage,
    resizeImage
} = require('../services/brandService');

const { getBrandValidator, createBrandValidator, updateBrandValidator, deleteBrandValidator } = require('../utils/validators/brandValidator');



router.route('/')
    .get(getBrands)
    .post(uploadBrandImage, resizeImage, createBrandValidator, createBrand);
router.route('/:id')
    .get(getBrandValidator, getBrandById)
    .put(uploadBrandImage, resizeImage, updateBrandValidator, updateBrand)
    .delete(deleteBrandValidator, deleteBrand);



module.exports = router;