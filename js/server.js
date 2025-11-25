// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
app.use(express.json());
app.use(cors()); // permite peticiones desde el frontend durante desarrollo

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret_de_prueba_pone_una_mas_fuerte';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';

/*
  Usuarios hardcodeados (dev):
  - En lugar de guardar un hash ya hecho, generamos el hash al arrancar
    a partir de una contraseña en claro para que uses: password: 'pass1234'
  - En un entorno real guardás solo el hash en la BD.
*/
const users = [
  { id: 1, username: 'usuario1', plainPassword: 'pass1234' },
  { id: 2, username: 'alex', plainPassword: 'miClaveSegura' }
];

// Generar passwordHash al iniciar
for (const u of users) {
  if (!u.passwordHash) {
    u.passwordHash = bcrypt.hashSync(u.plainPassword, 10);
    delete u.plainPassword; // opcional: borramos el plain para no dejarlo en memoria
  }
}

// ================= PUNTO 3: LOGIN (ya hecho) =================

// POST /login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Faltan username o password' });
    }

    const user = users.find(u => u.username === username);
    if (!user) return res.status(401).json({ error: 'Usuario o contraseña inválidos' });

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) return res.status(401).json({ error: 'Usuario o contraseña inválidos' });

    const payload = { sub: user.id, username: user.username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Devuelvo token y datos públicos del usuario
    return res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error interno' });
  }
});

// ================= PUNTO 4: MIDDLEWARE DE AUTORIZACIÓN =================
// El middleware está importado desde middleware/authMiddleware.js

// ================= RUTAS =================

// Ruta de prueba pública
app.get('/', (req, res) => res.send('Backend de auth corriendo'));

// EJEMPLO de ruta protegida (para que veas cómo se usa el middleware)
// TODO: reemplazar por las rutas reales que devuelven los JSON del eCommerce
app.get('/api/protegida', authMiddleware, (req, res) => {
  res.json({
    message: 'Accediste a una ruta protegida',
    user: req.user
  });
});

/*
  Acá es donde, en tu proyecto real, deberías proteger las rutas
  que devuelven los JSON del eCommerce. Por ejemplo, si tenés:

  app.get('/categories', (req, res) => { ... });
  app.get('/products', (req, res) => { ... });

  Deberían quedar así:

  app.get('/categories', authMiddleware, (req, res) => { ... });
  app.get('/products', authMiddleware, (req, res) => { ... });

  O bien, si usás un router:

  const ecommerceRouter = require('./routes/ecommerce');
  app.use('/api', authMiddleware, ecommerceRouter);
*/

app.listen(PORT, () => {
  console.log(`Server escuchando en http://localhost:${PORT}`);
});
