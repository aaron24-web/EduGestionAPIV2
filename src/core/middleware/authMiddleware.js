// src/core/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import config from '../../config/index.js';

// Este es NUESTRO propio middleware, ya no depende de Supabase.
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso denegado. No se proporcionó token.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verificamos el token usando NUESTRO secreto
    const decodedPayload = jwt.verify(token, config.jwtSecret);

    // Adjuntamos el payload (que contiene id, role, email) a la request
    req.user = decodedPayload; // Ej: { id: '...', email: '...', role: 'client' }
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token caducado.' });
    }
    return res.status(401).json({ error: 'Token inválido.' });
  }
};