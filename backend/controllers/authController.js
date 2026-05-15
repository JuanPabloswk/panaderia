const Usuario = require('../models/Usuario');
const { hashPassword, comparePassword } = require('../libs/encryption');
const { signToken } = require('../libs/tokens');
const {
  ROLES_STAFF_CREABLES,
  permisosEfectivosPorRol,
  esRolCliente,
} = require('../libs/rolesPermisos');
const { HttpError } = require('../middleware/httpError');

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * JWT: `tipo` para el front — cliente compra; empleado y admin se tratan como staff en checkout.
 */
function tokenPayloadFromUsuario(doc) {
  const rol = String(doc.rol || '').toLowerCase();
  const cliente = esRolCliente(rol);
  return {
    id: doc._id.toString(),
    tipo: cliente ? 'cliente' : 'empleado',
    rol,
    email: doc.email,
    username: doc.username,
    primerNombre: doc.primerNombre,
    apellido: doc.apellido,
    permisos: permisosEfectivosPorRol(rol),
  };
}

function publicUserFromPayload(p) {
  return {
    id: p.id,
    tipo: p.tipo,
    rol: p.rol,
    email: p.email,
    username: p.username,
    primerNombre: p.primerNombre,
    apellido: p.apellido,
    permisos: p.permisos,
  };
}

async function register(req, res, next) {
  try {
    const { email, password, primerNombre, apellido } = req.body || {};
    if (!email || !password) {
      throw new HttpError(
        400,
        'Correo y contraseña son obligatorios',
        'VALIDATION'
      );
    }
    if (String(password).length < 6) {
      throw new HttpError(
        400,
        'La contraseña debe tener al menos 6 caracteres',
        'VALIDATION'
      );
    }

    const emailNorm = String(email).toLowerCase().trim();
    const existe = await Usuario.findOne({ email: emailNorm });
    if (existe) {
      throw new HttpError(400, 'El correo ya está registrado', 'EMAIL_EXISTS');
    }

    const hash = await hashPassword(String(password));
    const user = await Usuario.create({
      email: emailNorm,
      password: hash,
      rol: 'cliente',
      permisos: permisosEfectivosPorRol('cliente'),
      primerNombre: primerNombre ? String(primerNombre).trim() : '',
      apellido: apellido ? String(apellido).trim() : '',
      pedidos: [],
      preferencias: { favoriteProducts: [], newsletter: false },
    });

    const payload = tokenPayloadFromUsuario(user);
    const token = signToken(payload);

    res.status(201).json({
      ok: true,
      token,
      user: publicUserFromPayload(payload),
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const raw = String(
      req.body.email || req.body.username || req.body.login || ''
    ).trim();
    const password = req.body.password;

    if (!raw || !password) {
      throw new HttpError(
        400,
        'Correo o usuario y contraseña son obligatorios',
        'VALIDATION'
      );
    }

    const loginLower = raw.toLowerCase();
    const query = raw.includes('@')
      ? { email: loginLower }
      : {
          $or: [
            { username: new RegExp(`^${escapeRegex(raw)}$`, 'i') },
            { email: loginLower },
          ],
        };

    const user = await Usuario.findOne(query).select('+password');
    if (!user) {
      throw new HttpError(401, 'Credenciales incorrectas', 'LOGIN_FAILED');
    }

    if (user.estado !== 'activo') {
      throw new HttpError(403, 'Cuenta desactivada', 'USER_INACTIVE');
    }

    const ok = await comparePassword(String(password), user.password);
    if (!ok) {
      throw new HttpError(401, 'Credenciales incorrectas', 'LOGIN_FAILED');
    }

    const payload = tokenPayloadFromUsuario(user);
    const token = signToken(payload);
    res.json({
      ok: true,
      token,
      user: publicUserFromPayload(payload),
    });
  } catch (err) {
    next(err);
  }
}

async function createEmpleado(req, res, next) {
  try {
    const b = req.body || {};
    const {
      username,
      email,
      password,
      primerNombre,
      apellido,
      telefono,
      rol,
      salario,
      estado,
      fechaContratacion,
    } = b;

    if (!username || !email || !password) {
      throw new HttpError(
        400,
        'username, email y password son obligatorios',
        'VALIDATION'
      );
    }
    if (String(password).length < 6) {
      throw new HttpError(
        400,
        'La contraseña debe tener al menos 6 caracteres',
        'VALIDATION'
      );
    }

    const rolNorm = String(rol || 'empleado')
      .trim()
      .toLowerCase();
    if (rolNorm === 'cliente') {
      throw new HttpError(
        400,
        'No se puede crear un usuario cliente por esta ruta; use el registro público',
        'VALIDATION'
      );
    }
    if (!ROLES_STAFF_CREABLES.includes(rolNorm)) {
      throw new HttpError(
        400,
        `Rol no válido. Use uno de: ${ROLES_STAFF_CREABLES.join(', ')}`,
        'VALIDATION'
      );
    }

    const emailNorm = String(email).toLowerCase().trim();
    const usernameNorm = String(username).trim().toLowerCase();

    const duplicado = await Usuario.findOne({
      $or: [{ email: emailNorm }, { username: usernameNorm }],
    });
    if (duplicado) {
      throw new HttpError(
        400,
        'Correo o usuario ya registrado',
        'USER_EXISTS'
      );
    }

    const hash = await hashPassword(String(password));
    const permisosGuardados = permisosEfectivosPorRol(rolNorm);

    const doc = await Usuario.create({
      username: usernameNorm,
      email: emailNorm,
      password: hash,
      rol: rolNorm,
      permisos: permisosGuardados,
      primerNombre: primerNombre ? String(primerNombre).trim() : '',
      apellido: apellido ? String(apellido).trim() : '',
      telefono: telefono ? String(telefono).trim() : '',
      salario: Number.isFinite(Number(salario)) ? Number(salario) : 0,
      estado: estado === 'inactivo' ? 'inactivo' : 'activo',
      fechaContratacion: fechaContratacion
        ? new Date(fechaContratacion)
        : new Date(),
      pedidos: [],
      preferencias: { favoriteProducts: [], newsletter: false },
    });

    const safe = doc.toObject();
    delete safe.password;

    res.status(201).json({
      ok: true,
      usuario: safe,
    });
  } catch (err) {
    if (err && err.code === 11000) {
      return next(
        new HttpError(400, 'Correo o usuario duplicado', 'DUPLICATE_KEY')
      );
    }
    next(err);
  }
}

module.exports = { register, login, createEmpleado };
