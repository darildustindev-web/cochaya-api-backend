const jwt = require('jsonwebtoken');
require('dotenv').config();

// 1er Guardia: Verifica si hay un token válido
const verifyToken = (req, res, next) => {
  // Obtenemos el token de la cabecera (Header) de la petición
  const token = req.header('x-auth-token');

  // Si no hay token, rechazamos la entrada
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    // Verificamos que el token sea auténtico usando nuestro secreto
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Le pegamos los datos del usuario a la petición para que el controlador los pueda usar
    req.user = decoded.user;
    
    // Todo está bien, le decimos a Express que continúe al siguiente paso
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

// 2do Guardia: Verifica si el usuario es administrador
const isAdmin = (req, res, next) => {
  // Primero debió pasar por verifyToken, así que req.user ya existe
  if (req.user.role !== 'administrador') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  next();
};

module.exports = {
  verifyToken,
  isAdmin
};