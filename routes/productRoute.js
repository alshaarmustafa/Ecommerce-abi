const express = require('express');
const router = express.Router();
const { getProducts, getProdcutById, createProduct, updateProduct, deleteProduct, uploadProductImages, resizeProductImages } = require('../services/productService');
const { getProductValidator, createProductValidator, updateProductValidator, deleteProductValidator } = require('../utils/validators/productValidator');




router.route('/')
    .get(getProducts)
    .post(uploadProductImages, resizeProductImages, createProductValidator, createProduct);

router.route('/:id')
    .get(getProductValidator, getProdcutById)
    .put(uploadProductImages, resizeProductImages,updateProductValidator, updateProduct)
    .delete(deleteProductValidator, deleteProduct);





module.exports = router;