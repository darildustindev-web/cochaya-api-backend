const pool = require('../config/db');

// Crear un nuevo pedido (POST)
const createOrder = async (req, res) => {
  // Extraemos los productos comprados y el total desde el frontend
  const { items, total } = req.body;
  
  // El ID del usuario lo sacamos del Token (gracias a nuestro middleware)
  const userId = req.user.id; 

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain items' });
  }

  // Solicitamos un cliente dedicado para manejar la transacción de forma segura
  const client = await pool.connect();

  try {
    // 🚦 INICIAMOS LA TRANSACCIÓN
    await client.query('BEGIN');

    // 1. Insertamos en la tabla principal de pedidos
    const orderQuery = `
      INSERT INTO pedidos (usuario_id, total)
      VALUES ($1, $2)
      RETURNING id;
    `;
    const orderResult = await client.query(orderQuery, [userId, total]);
    const orderId = orderResult.rows[0].id;

    // 2. Preparamos la consulta para los detalles y la actualización de stock
    const detailQuery = `
      INSERT INTO detalles_pedido (pedido_id, producto_id, cantidad, precio_unitario)
      VALUES ($1, $2, $3, $4);
    `;
    const updateStockQuery = `
      UPDATE productos SET stock = stock - $1 WHERE id = $2;
    `;

    // 3. Recorremos cada producto del carrito para guardarlo y restar el stock
    for (const item of items) {
      // Guardamos el detalle
      await client.query(detailQuery, [orderId, item.productId, item.quantity, item.price]);
      
      // Restamos el inventario (Buenas prácticas de un Sistema de Gestión)
      await client.query(updateStockQuery, [item.quantity, item.productId]);
    }

    // ✅ SI TODO SALIÓ BIEN, GUARDAMOS LOS CAMBIOS DEFINITIVAMENTE
    await client.query('COMMIT');
    
    res.status(201).json({ 
      message: 'Order created successfully',
      orderId: orderId 
    });

  } catch (error) {
    // ❌ SI ALGO FALLÓ, REVERTIMOS TODO (No hay pedidos fantasma)
    await client.query('ROLLBACK');
    console.error('Transaction error:', error);
    res.status(500).json({ error: 'Transaction failed. Order cancelled.' });
  } finally {
    // Siempre debemos devolver la conexión prestada al servidor
    client.release();
  }
};

module.exports = {
  createOrder
};