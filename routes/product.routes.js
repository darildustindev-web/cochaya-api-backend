const express = require('express');
const router = express.Router();
const { getProducts, createProduct } = require('../controllers/product.controller.js');

// Las rutas base asumen el prefijo '/api/products'
router.get('/', getProducts);
router.post('/', createProduct);

module.exports = router;