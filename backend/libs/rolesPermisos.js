/**
 * Roles en colección `usuarios`: cliente | empleado | admin
 * Permisos: crear, editar, eliminar, gestionar_usuarios (CRUD de personal en usuarios)
 */

const ROLES = Object.freeze({
  CLIENTE: 'cliente',
  EMPLEADO: 'empleado',
  ADMIN: 'admin',
});

const PERMISOS = Object.freeze({
  CREAR: 'crear',
  EDITAR: 'editar',
  ELIMINAR: 'eliminar',
  GESTIONAR_USUARIOS: 'gestionar_usuarios',
});

const ROLES_VALIDOS = Object.freeze([
  ROLES.CLIENTE,
  ROLES.EMPLEADO,
  ROLES.ADMIN,
]);

/** Personal que puede crearse por API (no cliente). */
const ROLES_STAFF_CREABLES = Object.freeze([ROLES.EMPLEADO, ROLES.ADMIN]);

function permisosEfectivosPorRol(rol) {
  const r = String(rol || '').toLowerCase();
  if (r === ROLES.CLIENTE) return [];
  if (r === ROLES.EMPLEADO) {
    return [PERMISOS.CREAR, PERMISOS.EDITAR, PERMISOS.ELIMINAR];
  }
  if (r === ROLES.ADMIN) {
    return [
      PERMISOS.CREAR,
      PERMISOS.EDITAR,
      PERMISOS.ELIMINAR,
      PERMISOS.GESTIONAR_USUARIOS,
    ];
  }
  return [];
}

function esRolCliente(rol) {
  return String(rol || '').toLowerCase() === ROLES.CLIENTE;
}

module.exports = {
  ROLES,
  PERMISOS,
  ROLES_VALIDOS,
  ROLES_STAFF_CREABLES,
  permisosEfectivosPorRol,
  esRolCliente,
};
