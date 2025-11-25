// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

// Ruta de prueba pública
app.get('/', (req, res) => res.send('Backend de auth corriendo'));

app.listen(PORT, () => {
  console.log(`Server escuchando en http://localhost:${PORT}`);
});
