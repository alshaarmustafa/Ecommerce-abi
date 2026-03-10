const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProdcutById,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImages,
    resizeProductImages
} = require('../services/productService');
const {
    getProductValidator,
    createProductValidator,
    updateProductValidator,
    deleteProductValidator
} = require('../utils/validators/productValidator');

//Autentication & Authorization
const { protect } = require('../middleware/verifyToken');
const allowedTo = require('../utils/authorization/allowedTo');
const userRoles = require('../utils/authorization/userRoles');


router.route('/')

    .get(getProducts)

    .post(
        protect,
        allowedTo(userRoles.ADMIN, userRoles.MANAGER),
        uploadProductImages,
        resizeProductImages,
        createProductValidator,
        createProduct
    );

router.route('/:id')

    .get(getProductValidator, getProdcutById)

    .put(
        protect,
        allowedTo(userRoles.ADMIN, userRoles.MANAGER),
        uploadProductImages,
        resizeProductImages,
        updateProductValidator,
        updateProduct
    )

    .delete(
        protect,
        allowedTo(userRoles.ADMIN),
        deleteProductValidator,
        deleteProduct
    );





module.exports = router;