// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_de_prueba_pone_una_mas_fuerte';

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Falta header Authorization' });
  }

  const partes = authHeader.split(' ');

  if (partes.length !== 2 || partes[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Formato de Authorization inválido' });
  }

  const token = partes[1];

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido o vencido' });
    }

    req.user = {
      id: payload.sub,
      username: payload.username
    };

    next();
  });
}

module.exports = authMiddleware;
