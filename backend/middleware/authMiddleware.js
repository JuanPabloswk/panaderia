const { verifyToken } = require('../libs/tokens');
const { HttpError } = require('./httpError');

function verificarToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(
      new HttpError(401, 'Debes iniciar sesión para continuar', 'TOKEN_MISSING')
    );
  }

  try {
    const decoded = verifyToken(token);
    const rol = decoded.role || decoded.rol;
    req.user = {
      ...decoded,
      id: decoded.id || decoded.sub,
      rol,
      role: decoded.role || rol,
    };
    next();
  } catch {
    next(new HttpError(401, 'Sesión inválida o expirada', 'TOKEN_INVALID'));
  }
}

/** Solo cuentas tipo cliente (compras). */
function soloCliente(req, res, next) {
  if (req.user?.tipo !== 'cliente') {
    return next(
      new HttpError(
        403,
        'Solo los clientes pueden realizar pedidos en la tienda',
        'FORBIDDEN_NOT_CLIENT'
      )
    );
  }
  next();
}

/** Solo empleados con rol admin (JWT emitido al iniciar sesión como empleado). */
function soloAdmin(req, res, next) {
  if (req.user?.tipo !== 'empleado') {
    return next(
      new HttpError(
        403,
        'Acceso denegado: solo personal autorizado',
        'FORBIDDEN_ADMIN'
      )
    );
  }
  const r = String(req.user?.rol || '').toLowerCase();
  if (r !== 'admin') {
    return next(
      new HttpError(
        403,
        'Acceso denegado: solo administradores',
        'FORBIDDEN_ADMIN'
      )
    );
  }
  next();
}

function authorizeRoles(...roles) {
  const lower = roles.map((r) => String(r).toLowerCase());
  return (req, res, next) => {
    const r = String(req.user?.rol || '').toLowerCase();
    if (!lower.includes(r)) {
      return next(
        new HttpError(
          403,
          'Acceso denegado: rol insuficiente',
          'FORBIDDEN_ROLE'
        )
      );
    }
    next();
  };
}

/** Requiere que el JWT incluya al menos uno de los permisos (empleados). */
function authorizePermisos(...permisosRequeridos) {
  return (req, res, next) => {
    const lista = Array.isArray(req.user?.permisos) ? req.user.permisos : [];
    const ok = permisosRequeridos.some((p) => lista.includes(p));
    if (!ok) {
      return next(
        new HttpError(403, 'No tienes permiso para esta acción', 'FORBIDDEN_PERM')
      );
    }
    next();
  };
}

module.exports = {
  verificarToken,
  soloCliente,
  soloAdmin,
  authorizeRoles,
  authorizePermisos,
};
