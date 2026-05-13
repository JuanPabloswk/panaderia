import Cliente from '../models/cliente.model.js';
import Empleado from '../models/empleado.model.js';
import { hashPassword, comparePassword, generateToken } from '../libs/auth.lib.js';

export const registrarCliente = async (req, res, next) => {
  try {
    const existe = await Cliente.findOne({ email: req.body.email });
    if (existe) {
      return res.status(409).json({ ok: false, error: 'El email ya está registrado' });
    }

    const passwordHash = await hashPassword(req.body.password);
    const cliente = await Cliente.create({
      ...req.body,
      password: passwordHash,
    });

    const token = generateToken({
      id: cliente._id,
      email: cliente.email,
      rol: 'cliente',
      nombre: `${cliente.primerNombre} ${cliente.apellido}`,
    });

    const { password, ...clienteSinPassword } = cliente.toObject();
    res.status(201).json({ ok: true, data: { cliente: clienteSinPassword, token } });
  } catch (error) {
    next(error);
  }
};

export const loginCliente = async (req, res, next) => {
  try {
    const cliente = await Cliente.findOne({ email: req.body.email });
    if (!cliente) {
      return res.status(401).json({ ok: false, error: 'Credenciales inválidas' });
    }

    const coincide = await comparePassword(req.body.password, cliente.password);
    if (!coincide) {
      return res.status(401).json({ ok: false, error: 'Credenciales inválidas' });
    }

    const token = generateToken({
      id: cliente._id,
      email: cliente.email,
      rol: 'cliente',
      nombre: `${cliente.primerNombre} ${cliente.apellido}`,
    });

    const { password, ...clienteSinPassword } = cliente.toObject();
    res.json({ ok: true, data: { cliente: clienteSinPassword, token } });
  } catch (error) {
    next(error);
  }
};

export const loginEmpleado = async (req, res, next) => {
  try {
    const empleado = await Empleado.findOne({ email: req.body.email });
    if (!empleado) {
      return res.status(401).json({ ok: false, error: 'Credenciales inválidas' });
    }

    if (empleado.estado !== 'activo') {
      return res.status(403).json({ ok: false, error: 'Cuenta de empleado inactiva' });
    }

    const coincide = await comparePassword(req.body.password, empleado.password);
    if (!coincide) {
      return res.status(401).json({ ok: false, error: 'Credenciales inválidas' });
    }

    const token = generateToken({
      id: empleado._id,
      email: empleado.email,
      rol: empleado.rol,
      nombre: `${empleado.primerNombre} ${empleado.apellido}`,
    });

    const { password, ...empleadoSinPassword } = empleado.toObject();
    res.json({ ok: true, data: { empleado: empleadoSinPassword, token } });
  } catch (error) {
    next(error);
  }
};
