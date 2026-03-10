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

const {
    getBrandValidator,
    createBrandValidator,
    updateBrandValidator,
    deleteBrandValidator
} = require('../utils/validators/brandValidator');

//Autentication & Authorization
const { protect } = require('../middleware/verifyToken');
const allowedTo = require('../utils/authorization/allowedTo');
const userRoles = require('../utils/authorization/userRoles');


router.route('/')
    .get(getBrands)

    .post(
        protect,
        allowedTo(userRoles.ADMIN, userRoles.MANAGER),
        uploadBrandImage,
        resizeImage,
        createBrandValidator,
        createBrand
    );

router.route('/:id')
    .get(getBrandValidator, getBrandById)

    .put(
        protect,
        allowedTo(userRoles.ADMIN, userRoles.MANAGER),
        uploadBrandImage,
        resizeImage,
        updateBrandValidator,
        updateBrand
    )

    .delete(protect,
        allowedTo(userRoles.ADMIN),
        deleteBrandValidator,
        deleteBrand
    );



module.exports = router;