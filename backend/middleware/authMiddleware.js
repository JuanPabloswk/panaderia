const { verifyToken } = require('../libs/tokens');
const { permisosEfectivosPorRol } = require('../libs/rolesPermisos');
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
      permisos: permisosEfectivosPorRol(rol),
    };
    next();
  } catch {
    next(new HttpError(401, 'Sesión inválida o expirada', 'TOKEN_INVALID'));
  }
}

function esRolCliente(user) {
  return (
    user?.tipo === 'cliente' ||
    String(user?.rol || '').toLowerCase() === 'cliente'
  );
}

/** Solo rol `cliente` (compras en la tienda). */
function soloCliente(req, res, next) {
  if (!esRolCliente(req.user)) {
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

/** Rol admin (colección `usuarios`). */
function soloAdmin(req, res, next) {
  if (String(req.user?.rol || '').toLowerCase() !== 'admin') {
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
