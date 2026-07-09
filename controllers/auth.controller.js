const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrar un nuevo usuario (POST)
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Validación básica
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // 2. Verificar si el correo ya está registrado en la BD
    const userExists = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists with that email' });
    }

    // 3. Encriptar la contraseña (Hashing)
    const salt = await bcrypt.genSalt(10); // Nivel de seguridad del encriptado
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Guardar en la base de datos (con las columnas en español)
    const query = `
      INSERT INTO usuarios (nombre, email, password, rol)
      VALUES ($1, $2, $3, $4)
      -- RETURNING nos permite devolver los datos sin incluir la contraseña
      RETURNING id, nombre, email, rol, creado_en; 
    `;
    
    // Si no envían un rol desde el frontend, le asignamos 'cliente' por defecto
    const values = [name, email, hashedPassword, role || 'cliente'];

    const result = await pool.query(query, values);
    
    // 201: Created
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Iniciar sesión (POST)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validar que nos envíen datos
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // 2. Buscar si el usuario existe en la base de datos
    const userResult = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      // Usamos el mismo mensaje genérico por seguridad (para no revelar si el correo existe o no)
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // 3. Comparar la contraseña enviada con la contraseña hasheada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 4. Crear el JSON Web Token (El pase VIP)
    // Guardamos el ID y el rol dentro del token para saber quién es cuando haga peticiones futuras
    const payload = {
      user: {
        id: user.id,
        role: user.rol
      }
    };

    // Firmamos el token. Expirará en 10 horas.
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '10h' },
      (err, token) => {
        if (err) throw err;
        
        // Respondemos con el token y los datos del usuario (¡sin la contraseña!)
        res.json({
          token,
          user: {
            id: user.id,
            name: user.nombre,
            email: user.email,
            role: user.rol
          }
        });
      }
    );

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// No olvides exportar la nueva función al final del archivo
module.exports = {
  registerUser,
  loginUser
};