const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/auth.controller.js');

// La ruta será /api/auth/register
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;