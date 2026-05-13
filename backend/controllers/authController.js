const Cliente = require('../models/Cliente');
const Empleado = require('../models/Empleado');
const { hashPassword, comparePassword } = require('../libs/encryption');
const { signToken } = require('../libs/tokens');
const { HttpError } = require('../middleware/httpError');

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function tokenPayloadEmpleado(doc) {
  return {
    id: doc._id.toString(),
    tipo: 'empleado',
    rol: doc.rol,
    email: doc.email,
    username: doc.username,
    primerNombre: doc.primerNombre,
    apellido: doc.apellido,
    permisos: doc.permisos || [],
  };
}

function tokenPayloadCliente(doc) {
  return {
    id: doc._id.toString(),
    tipo: 'cliente',
    rol: 'cliente',
    email: doc.email,
    primerNombre: doc.primerNombre,
    apellido: doc.apellido,
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
    const [yaCliente, yaEmpleado] = await Promise.all([
      Cliente.findOne({ email: emailNorm }),
      Empleado.findOne({ email: emailNorm }),
    ]);
    if (yaCliente || yaEmpleado) {
      throw new HttpError(400, 'El correo ya está registrado', 'EMAIL_EXISTS');
    }

    const hash = await hashPassword(String(password));
    const user = await Cliente.create({
      email: emailNorm,
      password: hash,
      primerNombre: primerNombre ? String(primerNombre).trim() : '',
      apellido: apellido ? String(apellido).trim() : '',
      pedidos: [],
      preferencias: { favoriteProducts: [], newsletter: false },
    });

    const payload = tokenPayloadCliente(user);
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

    const empleado = await Empleado.findOne({
      $or: [
        { email: loginLower },
        { username: new RegExp(`^${escapeRegex(raw)}$`, 'i') },
      ],
    }).select('+password');

    if (empleado) {
      if (empleado.estado !== 'activo') {
        throw new HttpError(403, 'Cuenta de empleado desactivada', 'EMPLOYEE_INACTIVE');
      }
      const okEmp = await comparePassword(String(password), empleado.password);
      if (!okEmp) {
        throw new HttpError(401, 'Credenciales incorrectas', 'LOGIN_FAILED');
      }
      const payload = tokenPayloadEmpleado(empleado);
      const token = signToken(payload);
      return res.json({
        ok: true,
        token,
        user: publicUserFromPayload(payload),
      });
    }

    if (!raw.includes('@')) {
      throw new HttpError(401, 'Credenciales incorrectas', 'LOGIN_FAILED');
    }

    const cliente = await Cliente.findOne({ email: loginLower }).select(
      '+password'
    );
    if (!cliente) {
      throw new HttpError(401, 'Credenciales incorrectas', 'LOGIN_FAILED');
    }

    const okCli = await comparePassword(String(password), cliente.password);
    if (!okCli) {
      throw new HttpError(401, 'Credenciales incorrectas', 'LOGIN_FAILED');
    }

    const payload = tokenPayloadCliente(cliente);
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

const ROLES_EMPLEADO = [
  'admin',
  'vendedor',
  'cajero',
  'cocinero',
  'repartidor',
  'empleado',
];

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
      permisos,
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
    if (!ROLES_EMPLEADO.includes(rolNorm)) {
      throw new HttpError(
        400,
        `Rol no válido. Use uno de: ${ROLES_EMPLEADO.join(', ')}`,
        'VALIDATION'
      );
    }

    const emailNorm = String(email).toLowerCase().trim();
    const usernameNorm = String(username).trim().toLowerCase();

    const [mailCliente, mailEmpleado, userEmpleado] = await Promise.all([
      Cliente.findOne({ email: emailNorm }),
      Empleado.findOne({ email: emailNorm }),
      Empleado.findOne({ username: usernameNorm }),
    ]);
    if (mailCliente) {
      throw new HttpError(
        400,
        'Ese correo ya pertenece a un cliente de la tienda',
        'EMAIL_CLIENTE'
      );
    }
    if (mailEmpleado || userEmpleado) {
      throw new HttpError(
        400,
        'Correo o usuario de empleado ya registrado',
        'EMPLEADO_EXISTS'
      );
    }

    const hash = await hashPassword(String(password));
    const doc = await Empleado.create({
      username: usernameNorm,
      email: emailNorm,
      password: hash,
      primerNombre: primerNombre ? String(primerNombre).trim() : '',
      apellido: apellido ? String(apellido).trim() : '',
      telefono: telefono ? String(telefono).trim() : '',
      rol: rolNorm,
      salario: Number.isFinite(Number(salario)) ? Number(salario) : 0,
      estado: estado === 'inactivo' ? 'inactivo' : 'activo',
      permisos: Array.isArray(permisos)
        ? permisos.map((p) => String(p).trim()).filter(Boolean)
        : [],
      fechaContratacion: fechaContratacion
        ? new Date(fechaContratacion)
        : new Date(),
    });

    const safe = doc.toObject();
    delete safe.password;

    res.status(201).json({
      ok: true,
      empleado: safe,
    });
  } catch (err) {
    if (err && err.code === 11000) {
      return next(
        new HttpError(
          400,
          'Correo o usuario de empleado duplicado',
          'DUPLICATE_KEY'
        )
      );
    }
    next(err);
  }
}

module.exports = { register, login, createEmpleado };
