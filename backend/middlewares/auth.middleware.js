import { verifyToken } from '../libs/auth.lib.js';

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ ok: false, error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ ok: false, error: 'Token inválido o expirado' });
  }
};
