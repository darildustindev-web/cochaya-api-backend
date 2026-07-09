const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/order.controller.js');
const { verifyToken } = require('../middlewares/auth.middleware.js');

// Ruta para crear pedido (Requiere estar logueado)
router.post('/', verifyToken, createOrder);

module.exports = router;