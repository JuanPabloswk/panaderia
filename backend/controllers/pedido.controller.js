import Pedido from '../models/pedido.model.js';
import Producto from '../models/producto.model.js';

export const obtenerPedidos = async (req, res, next) => {
  try {
    const { estado, cliente, fechaDesde, fechaHasta } = req.query;
    const filtro = {};

    if (estado) filtro.estado = estado;
    if (cliente) filtro.cliente = cliente;
    if (fechaDesde || fechaHasta) {
      filtro.fechaPedido = {};
      if (fechaDesde) filtro.fechaPedido.$gte = new Date(fechaDesde);
      if (fechaHasta) filtro.fechaPedido.$lte = new Date(fechaHasta);
    }

    if (req.usuario.rol === 'cliente') {
      filtro.cliente = req.usuario.id;
    }

    const pedidos = await Pedido.find(filtro)
      .populate('cliente', 'primerNombre apellido email telefono')
      .populate('empleado', 'primerNombre apellido rol')
      .populate('items.producto', 'nombre precio imagen')
      .sort({ fechaPedido: -1 });

    res.json({ ok: true, data: pedidos });
  } catch (error) {
    next(error);
  }
};

export const obtenerPedido = async (req, res, next) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate('cliente', 'primerNombre apellido email telefono direccion')
      .populate('empleado', 'primerNombre apellido rol')
      .populate('items.producto', 'nombre precio imagen descripcion');

    if (!pedido) {
      return res.status(404).json({ ok: false, error: 'Pedido no encontrado' });
    }

    if (req.usuario.rol === 'cliente' && pedido.cliente._id.toString() !== req.usuario.id) {
      return res.status(403).json({ ok: false, error: 'No tienes permiso para ver este pedido' });
    }

    res.json({ ok: true, data: pedido });
  } catch (error) {
    next(error);
  }
};

export const crearPedido = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      cliente: req.usuario.rol === 'cliente' ? req.usuario.id : req.body.cliente,
    };

    for (const item of data.items) {
      const producto = await Producto.findById(item.producto).select('nombre precio stock');
      if (!producto) {
        return res.status(404).json({ ok: false, error: `Producto no encontrado` });
      }
      if (producto.stock < item.cantidad) {
        return res.status(400).json({
          ok: false,
          error: `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}, solicitado: ${item.cantidad}`
        });
      }
    }

    const pedido = await Pedido.create({ ...data, estado: 'confirmado' });

    for (const item of data.items) {
      await Producto.findByIdAndUpdate(item.producto, {
        $inc: { stock: -item.cantidad }
      });
    }

    const populated = await pedido.populate([
      { path: 'cliente', select: 'primerNombre apellido email' },
      { path: 'items.producto', select: 'nombre precio' },
    ]);

    res.status(201).json({ ok: true, data: populated });
  } catch (error) {
    next(error);
  }
};

export const actualizarPedido = async (req, res, next) => {
  try {
    const pedido = await Pedido.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    })
      .populate('cliente', 'primerNombre apellido email')
      .populate('empleado', 'primerNombre apellido rol')
      .populate('items.producto', 'nombre precio');

    if (!pedido) {
      return res.status(404).json({ ok: false, error: 'Pedido no encontrado' });
    }

    res.json({ ok: true, data: pedido });
  } catch (error) {
    next(error);
  }
};

export const actualizarEstadoPedido = async (req, res, next) => {
  try {
    const updateData = { estado: req.body.estado };
    if (req.usuario.rol !== 'cliente' && !req.body.empleado) {
      updateData.empleado = req.usuario.id;
    }

    const pedido = await Pedido.findByIdAndUpdate(req.params.id, updateData, {
      returnDocument: 'after',
      runValidators: true,
    })
      .populate('cliente', 'primerNombre apellido')
      .populate('empleado', 'primerNombre apellido rol');

    if (!pedido) {
      return res.status(404).json({ ok: false, error: 'Pedido no encontrado' });
    }

    res.json({ ok: true, data: pedido });
  } catch (error) {
    next(error);
  }
};

export const eliminarPedido = async (req, res, next) => {
  try {
    const pedido = await Pedido.findByIdAndDelete(req.params.id);
    if (!pedido) {
      return res.status(404).json({ ok: false, error: 'Pedido no encontrado' });
    }
    res.json({ ok: true, message: 'Pedido eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

export const obtenerPedidosPorCliente = async (req, res, next) => {
  try {
    const pedidos = await Pedido.find({ cliente: req.params.clienteId })
      .populate('items.producto', 'nombre precio imagen')
      .sort({ fechaPedido: -1 });

    res.json({ ok: true, data: pedidos });
  } catch (error) {
    next(error);
  }
};
