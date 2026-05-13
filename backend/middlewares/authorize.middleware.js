export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ ok: false, error: 'No autenticado' });
    }

    if (!allowedRoles.includes(req.usuario.rol)) {
      return res.status(403).json({
        ok: false,
        error: `Acceso denegado. Se requiere rol: ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
};
