const express = require('express');
const router = express.Router();
const { getProducts, createProduct } = require('../controllers/product.controller.js');

// Importamos a nuestros guardias
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware.js');

// RUTA PÚBLICA: Cualquiera puede ver los productos (el E-commerce los necesita)
router.get('/', getProducts);

// RUTA PROTEGIDA: Solo usuarios con token Y rol de administrador pueden crear
router.post('/', verifyToken, isAdmin, createProduct);

module.exports = router;