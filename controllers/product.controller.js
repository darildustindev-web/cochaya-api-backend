const pool = require('../config/db');

// Obtener todos los productos (GET)
const getProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos ORDER BY creado_en DESC');
    // Enviamos las filas (rows) obtenidas como respuesta JSON
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    // 500: Internal Server Error (Error interno)
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Crear un nuevo producto (POST)
const createProduct = async (req, res) => {
  try {
    // Destructuramos las variables en inglés que recibiremos
    const { name, description, price, stock, imageUrl } = req.body;

    // Validación básica
    if (!name || !price) {
      // 400: Bad Request (Petición mal formulada por el cliente)
      return res.status(400).json({ error: 'Name and price are required' });
    }

    // Insertamos usando los nombres de las columnas en español de nuestra BD
    const query = `
      INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *; 
    `;
    const values = [name, description, price, stock || 0, imageUrl || ''];

    const result = await pool.query(query, values);
    
    // 201: Created (Recurso creado exitosamente)
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getProducts,
  createProduct
};