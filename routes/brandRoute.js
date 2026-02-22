const express = require('express');
const router = express.Router();
const { getBrands, getBrandById, createBrand, updateBrand, deleteBrand } = require('../services/brandService');
const { getBrandValidator, createBrandValidator, updateBrandValidator, deleteBrandValidator } = require('../utils/validators/brandValidator');



router.route('/')
    .get(getBrands)
    .post(createBrandValidator, createBrand);
router.route('/:id')
    .get(getBrandValidator, getBrandById)
    .put(updateBrandValidator, updateBrand)
    .delete(deleteBrandValidator, deleteBrand);



module.exports = router;