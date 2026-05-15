import Cliente from '../models/cliente.model.js';

export const obtenerClientes = async (req, res, next) => {
  try {
    const clientes = await Cliente.find()
      .populate('pedidos')
      .populate('preferencias.favoriteProducts')
      .sort({ createdAt: -1 });
    res.json({ ok: true, data: clientes });
  } catch (error) {
    next(error);
  }
};

export const obtenerCliente = async (req, res, next) => {
  try {
    const cliente = await Cliente.findById(req.params.id)
      .populate('pedidos')
      .populate('preferencias.favoriteProducts');
    if (!cliente) {
      return res.status(404).json({ ok: false, error: 'Cliente no encontrado' });
    }
    res.json({ ok: true, data: cliente });
  } catch (error) {
    next(error);
  }
};

export const actualizarCliente = async (req, res, next) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    }).populate('pedidos');
    if (!cliente) {
      return res.status(404).json({ ok: false, error: 'Cliente no encontrado' });
    }
    res.json({ ok: true, data: cliente });
  } catch (error) {
    next(error);
  }
};

export const eliminarCliente = async (req, res, next) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id);
    if (!cliente) {
      return res.status(404).json({ ok: false, error: 'Cliente no encontrado' });
    }
    res.json({ ok: true, message: 'Cliente eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

export const obtenerPerfil = async (req, res, next) => {
  try {
    const cliente = await Cliente.findById(req.usuario.id)
      .populate('pedidos')
      .populate('preferencias.favoriteProducts');
    if (!cliente) {
      return res.status(404).json({ ok: false, error: 'Cliente no encontrado' });
    }
    const { password, ...clienteData } = cliente.toObject();
    res.json({ ok: true, data: clienteData });
  } catch (error) {
    next(error);
  }
};

export const actualizarPerfil = async (req, res, next) => {
  try {
    const camposPermitidos = {
      primerNombre: req.body.primerNombre,
      apellido: req.body.apellido,
      telefono: req.body.telefono,
      direccion: req.body.direccion,
      preferencias: req.body.preferencias,
    };
    Object.keys(camposPermitidos).forEach(key => {
      if (camposPermitidos[key] === undefined) delete camposPermitidos[key];
    });

    const cliente = await Cliente.findByIdAndUpdate(req.usuario.id, camposPermitidos, {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!cliente) {
      return res.status(404).json({ ok: false, error: 'Cliente no encontrado' });
    }
    const { password, ...clienteData } = cliente.toObject();
    res.json({ ok: true, data: clienteData });
  } catch (error) {
    next(error);
  }
};
