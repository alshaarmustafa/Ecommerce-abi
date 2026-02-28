const express = require('express');
const router = express.Router();
const { getProducts, getProdcutById, createProduct, updateProduct, deleteProduct } = require('../services/productService');
const { getProductValidator, createProductValidator, updateProductValidator, deleteProductValidator } = require('../utils/validators/productValidator');





router.route('/')
    .get(getProducts)
    .post(createProductValidator, createProduct);

router.route('/:id')
    .get(getProductValidator, getProdcutById)
    .put(updateProductValidator, updateProduct)
    .delete(deleteProductValidator, deleteProduct);





    module.exports = router;