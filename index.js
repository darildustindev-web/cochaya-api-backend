const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes (Importamos las rutas)
const productRoutes = require('./routes/product.routes.js');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Mount routes (Montaje de rutas en la URL en inglés)
app.use('/api/products', productRoutes);

// Health check endpoint (Ruta para comprobar que el servidor vive)
app.get('/', (req, res) => {
  res.send('CochaYa! API is running 🚀');
});

// Start the server (Inicializamos el servidor)
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});