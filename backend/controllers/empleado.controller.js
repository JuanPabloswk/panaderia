import Empleado from '../models/empleado.model.js';
import { hashPassword } from '../libs/auth.lib.js';

export const obtenerEmpleados = async (req, res, next) => {
  try {
    const { estado, rol } = req.query;
    const filtro = {};
    if (estado) filtro.estado = estado;
    if (rol) filtro.rol = rol;

    const empleados = await Empleado.find(filtro).sort({ createdAt: -1 });
    res.json({ ok: true, data: empleados });
  } catch (error) {
    next(error);
  }
};

export const obtenerEmpleado = async (req, res, next) => {
  try {
    const empleado = await Empleado.findById(req.params.id);
    if (!empleado) {
      return res.status(404).json({ ok: false, error: 'Empleado no encontrado' });
    }
    res.json({ ok: true, data: empleado });
  } catch (error) {
    next(error);
  }
};

export const crearEmpleado = async (req, res, next) => {
  try {
    const existe = await Empleado.findOne({ email: req.body.email });
    if (existe) {
      return res.status(409).json({ ok: false, error: 'El email ya está registrado' });
    }

    const passwordHash = await hashPassword(req.body.password);
    const empleado = await Empleado.create({
      ...req.body,
      password: passwordHash,
    });

    const { password, ...empleadoSinPassword } = empleado.toObject();
    res.status(201).json({ ok: true, data: empleadoSinPassword });
  } catch (error) {
    next(error);
  }
};

export const actualizarEmpleado = async (req, res, next) => {
  try {
    if (req.body.password) {
      req.body.password = await hashPassword(req.body.password);
    }

    const empleado = await Empleado.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!empleado) {
      return res.status(404).json({ ok: false, error: 'Empleado no encontrado' });
    }
    const { password, ...empleadoSinPassword } = empleado.toObject();
    res.json({ ok: true, data: empleadoSinPassword });
  } catch (error) {
    next(error);
  }
};

export const eliminarEmpleado = async (req, res, next) => {
  try {
    const empleado = await Empleado.findByIdAndDelete(req.params.id);
    if (!empleado) {
      return res.status(404).json({ ok: false, error: 'Empleado no encontrado' });
    }
    res.json({ ok: true, message: 'Empleado eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

export const obtenerMiPerfil = async (req, res, next) => {
  try {
    const empleado = await Empleado.findById(req.usuario.id);
    if (!empleado) {
      return res.status(404).json({ ok: false, error: 'Empleado no encontrado' });
    }
    const { password, ...empleadoData } = empleado.toObject();
    res.json({ ok: true, data: empleadoData });
  } catch (error) {
    next(error);
  }
};
