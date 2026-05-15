const mongoose = require('mongoose');
const Usuario = require('../models/Usuario');
const { hashPassword } = require('../libs/encryption');
const { permisosEfectivosPorRol } = require('../libs/rolesPermisos');
const { HttpError } = require('../middleware/httpError');

const ROLES_PANEL = ['empleado', 'admin'];

function safeUser(doc) {
  if (!doc) return null;
  const o = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  delete o.password;
  return o;
}

function normalizeObjectId(raw) {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (!mongoose.Types.ObjectId.isValid(s)) return null;
  return new mongoose.Types.ObjectId(s);
}

async function listar(req, res, next) {
  try {
    const lista = await Usuario.find({ rol: { $in: ROLES_PANEL } })
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ usuarios: lista.map(safeUser) });
  } catch (err) {
    next(err);
  }
}

async function obtener(req, res, next) {
  try {
    const id = normalizeObjectId(req.params.id);
    if (!id) {
      return next(new HttpError(400, 'Id inválido', 'INVALID_ID'));
    }
    const u = await Usuario.findById(id).select('-password').lean();
    if (!u || !ROLES_PANEL.includes(String(u.rol || '').toLowerCase())) {
      return next(new HttpError(404, 'Usuario no encontrado', 'NOT_FOUND'));
    }
    res.json({ usuario: safeUser(u) });
  } catch (err) {
    next(err);
  }
}

async function crear(req, res, next) {
  try {
    const b = req.body || {};
    const username = String(b.username || '').trim().toLowerCase();
    const email = String(b.email || '').toLowerCase().trim();
    const password = b.password;
    const rolNorm = String(b.rol || 'empleado').toLowerCase().trim();

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
    if (!ROLES_PANEL.includes(rolNorm)) {
      throw new HttpError(400, 'Rol debe ser empleado o admin', 'VALIDATION');
    }

    const existe = await Usuario.findOne({
      $or: [{ email }, { username }],
    });
    if (existe) {
      throw new HttpError(400, 'Correo o usuario ya registrado', 'DUPLICATE');
    }

    const hash = await hashPassword(String(password));
    const doc = await Usuario.create({
      username,
      email,
      password: hash,
      rol: rolNorm,
      permisos: permisosEfectivosPorRol(rolNorm),
      primerNombre: b.primerNombre ? String(b.primerNombre).trim() : '',
      apellido: b.apellido ? String(b.apellido).trim() : '',
      telefono: b.telefono ? String(b.telefono).trim() : '',
      salario: Number.isFinite(Number(b.salario)) ? Number(b.salario) : 0,
      estado: b.estado === 'inactivo' ? 'inactivo' : 'activo',
      fechaContratacion: b.fechaContratacion
        ? new Date(b.fechaContratacion)
        : new Date(),
      pedidos: [],
      preferencias: { favoriteProducts: [], newsletter: false },
    });

    res.status(201).json({ usuario: safeUser(doc) });
  } catch (err) {
    if (err && err.code === 11000) {
      return next(
        new HttpError(400, 'Correo o usuario duplicado', 'DUPLICATE_KEY')
      );
    }
    next(err);
  }
}

async function actualizar(req, res, next) {
  try {
    const id = normalizeObjectId(req.params.id);
    if (!id) {
      return next(new HttpError(400, 'Id inválido', 'INVALID_ID'));
    }
    const doc = await Usuario.findById(id).select('+password');
    if (!doc || !ROLES_PANEL.includes(String(doc.rol || '').toLowerCase())) {
      return next(new HttpError(404, 'Usuario no encontrado', 'NOT_FOUND'));
    }

    const b = req.body || {};
    if (b.email != null) {
      const em = String(b.email).toLowerCase().trim();
      const clash = await Usuario.findOne({
        email: em,
        _id: { $ne: doc._id },
      });
      if (clash) {
        throw new HttpError(400, 'Ese correo ya está en uso', 'EMAIL_DUP');
      }
      doc.email = em;
    }
    if (b.username != null) {
      const un = String(b.username).trim().toLowerCase();
      const clash = await Usuario.findOne({
        username: un,
        _id: { $ne: doc._id },
      });
      if (clash) {
        throw new HttpError(400, 'Ese usuario ya está en uso', 'USER_DUP');
      }
      doc.username = un;
    }
    if (b.password) {
      if (String(b.password).length < 6) {
        throw new HttpError(400, 'Contraseña mínimo 6 caracteres', 'VALIDATION');
      }
      doc.password = await hashPassword(String(b.password));
    }
    if (b.primerNombre != null) doc.primerNombre = String(b.primerNombre).trim();
    if (b.apellido != null) doc.apellido = String(b.apellido).trim();
    if (b.telefono != null) doc.telefono = String(b.telefono).trim();
    if (b.salario != null && Number.isFinite(Number(b.salario))) {
      doc.salario = Number(b.salario);
    }
    if (b.estado === 'activo' || b.estado === 'inactivo') {
      doc.estado = b.estado;
    }
    if (b.rol != null) {
      const r = String(b.rol).toLowerCase().trim();
      if (!ROLES_PANEL.includes(r)) {
        throw new HttpError(400, 'Rol debe ser empleado o admin', 'VALIDATION');
      }
      doc.rol = r;
      doc.permisos = permisosEfectivosPorRol(r);
    }

    await doc.save();
    const fresh = await Usuario.findById(doc._id).select('-password').lean();
    res.json({ usuario: safeUser(fresh) });
  } catch (err) {
    if (err && err.code === 11000) {
      return next(
        new HttpError(400, 'Correo o usuario duplicado', 'DUPLICATE_KEY')
      );
    }
    next(err);
  }
}

async function eliminar(req, res, next) {
  try {
    const id = normalizeObjectId(req.params.id);
    if (!id) {
      return next(new HttpError(400, 'Id inválido', 'INVALID_ID'));
    }
    if (String(id) === String(req.user.id)) {
      throw new HttpError(400, 'No puedes desactivar tu propia cuenta', 'SELF');
    }
    const doc = await Usuario.findById(id);
    if (!doc || !ROLES_PANEL.includes(String(doc.rol || '').toLowerCase())) {
      return next(new HttpError(404, 'Usuario no encontrado', 'NOT_FOUND'));
    }
    doc.estado = 'inactivo';
    await doc.save();
    res.json({ ok: true, message: 'Usuario desactivado' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar,
};
