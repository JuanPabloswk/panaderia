const express = require('express');
const mongoose = require('mongoose');
const Producto = require('../models/Producto');
const Pedido = require('../models/Pedido');
const Usuario = require('../models/Usuario');
const dbReady = require('../middleware/dbReady');
const { verificarToken, soloCliente } = require('../middleware/authMiddleware');
const { HttpError } = require('../middleware/httpError');
const { categoriaActiva } = require('../utils/serializeProducto');

const router = express.Router();

router.use(dbReady);

const METODOS_PAGO = ['efectivo', 'tarjeta', 'transferencia', 'pse', 'otro'];
const TIPOS_ENTREGA = ['tienda', 'domicilio'];

function normalizeObjectId(raw) {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (!mongoose.Types.ObjectId.isValid(s)) return null;
  return new mongoose.Types.ObjectId(s);
}

function pickEnum(value, allowed, fallback) {
  const v = String(value || '')
    .trim()
    .toLowerCase();
  return allowed.includes(v) ? v : fallback;
}

/**
 * Valida el carrito y devuelve líneas listas para guardar (precio del catálogo).
 * @returns {{ error: string|null, lines: Array<{ producto: mongoose.Types.ObjectId, cantidad: number, precioUnitario: number }> }}
 */
async function validarYLineas(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return { error: 'El carrito está vacío', lines: [] };
  }

  const objectIds = [];
  for (const raw of items) {
    if (raw == null || typeof raw.nombre !== 'string') {
      return { error: 'Formato de ítems inválido', lines: [] };
    }
    const oid = normalizeObjectId(raw.id);
    if (!oid) {
      return { error: 'Formato de ítems inválido', lines: [] };
    }
    objectIds.push(oid);
  }

  const catalog = await Producto.find({ _id: { $in: objectIds } })
    .populate('categoria', 'nombre slug estado')
    .lean();
  const map = new Map(catalog.map((p) => [p._id.toString(), p]));

  const lines = [];
  for (const raw of items) {
    const idStr = String(normalizeObjectId(raw.id));
    const precioCliente = Number(raw.precio);
    const cantidad = Number(raw.cantidad);

    if (!Number.isFinite(precioCliente) || !Number.isFinite(cantidad)) {
      return { error: 'Formato de ítems inválido', lines: [] };
    }

    if (!Number.isInteger(cantidad) || cantidad < 1) {
      return { error: 'La cantidad debe ser un entero mayor a 0', lines: [] };
    }

    const doc = map.get(idStr);
    if (!doc) {
      return { error: `Producto no encontrado: ${idStr}`, lines: [] };
    }
    if (!doc.disponible) {
      return { error: `Producto no disponible: ${doc.nombre}`, lines: [] };
    }
    if (!categoriaActiva(doc.categoria)) {
      return {
        error: `La categoría del producto "${doc.nombre}" no está disponible`,
        lines: [],
      };
    }
    if (doc.stock < cantidad) {
      return { error: `Stock insuficiente para "${doc.nombre}"`, lines: [] };
    }
    if (doc.precio !== precioCliente) {
      return {
        error: `El precio no coincide con el catálogo para el producto seleccionado`,
        lines: [],
      };
    }
    if (doc.nombre !== raw.nombre) {
      return {
        error: `El nombre no coincide con el catálogo para el producto seleccionado`,
        lines: [],
      };
    }

    lines.push({
      producto: new mongoose.Types.ObjectId(idStr),
      cantidad,
      precioUnitario: doc.precio,
    });
  }

  return { error: null, lines };
}

async function revertirStock(lineas) {
  await Promise.all(
    lineas.map((line) =>
      Producto.updateOne(
        { _id: line.producto },
        { $inc: { stock: line.cantidad } }
      )
    )
  );
}

router.post('/', verificarToken, soloCliente, async (req, res, next) => {
  const { items } = req.body || {};
  const clienteIdRaw = req.user?.id || req.user?.sub;
  const clienteOid = normalizeObjectId(clienteIdRaw);
  if (!clienteOid) {
    return next(new HttpError(400, 'Usuario inválido', 'USUARIO_INVALID'));
  }

  const comprador = await Usuario.findById(clienteOid)
    .select('primerNombre apellido email rol')
    .lean();
  if (!comprador || String(comprador.rol || '').toLowerCase() !== 'cliente') {
    return next(
      new HttpError(
        403,
        'Solo usuarios con rol cliente pueden registrar pedidos',
        'FORBIDDEN_NOT_CLIENT'
      )
    );
  }

  const clienteNombre =
    [comprador.primerNombre, comprador.apellido].filter(Boolean).join(' ').trim() ||
    comprador.email ||
    'Cliente';

  const { error, lines } = await validarYLineas(items);
  if (error) {
    return next(new HttpError(400, error, 'PEDIDO_INVALIDO'));
  }

  const subtotal = lines.reduce(
    (sum, l) => sum + l.precioUnitario * l.cantidad,
    0
  );
  const descuentoTotal = 0;
  const total = subtotal - descuentoTotal;

  const metodoPago = pickEnum(
    req.body?.metodoPago,
    METODOS_PAGO,
    'efectivo'
  );
  const tipoEntrega = pickEnum(
    req.body?.tipoEntrega,
    TIPOS_ENTREGA,
    'tienda'
  );

  const decrementados = [];
  let pedidoDoc = null;

  try {
    for (const line of lines) {
      const r = await Producto.updateOne(
        { _id: line.producto, stock: { $gte: line.cantidad } },
        { $inc: { stock: -line.cantidad } }
      );
      if (r.modifiedCount !== 1) {
        throw new HttpError(
          409,
          'No hay stock suficiente para completar el pedido. Intenta de nuevo.',
          'STOCK_RACE'
        );
      }
      decrementados.push(line);
    }

    pedidoDoc = await Pedido.create({
      cliente: clienteOid,
      clienteNombre,
      empleado: null,
      items: lines,
      subtotal,
      descuentoTotal,
      total,
      estado: 'pendiente',
      metodoPago,
      tipoEntrega,
      fechaPedido: new Date(),
    });

    await Usuario.updateOne(
      { _id: clienteOid },
      { $push: { pedidos: pedidoDoc._id } }
    );

    res.status(201).json({
      message:
        '¡Pedido recibido! Te contactaremos pronto para confirmar el pago y la entrega.',
      pedido: {
        _id: pedidoDoc._id,
        cliente: pedidoDoc.cliente,
        clienteNombre: pedidoDoc.clienteNombre,
        empleado: pedidoDoc.empleado,
        items: pedidoDoc.items,
        subtotal: pedidoDoc.subtotal,
        descuentoTotal: pedidoDoc.descuentoTotal,
        total: pedidoDoc.total,
        estado: pedidoDoc.estado,
        metodoPago: pedidoDoc.metodoPago,
        tipoEntrega: pedidoDoc.tipoEntrega,
        fechaPedido: pedidoDoc.fechaPedido,
        createdAt: pedidoDoc.createdAt,
        updatedAt: pedidoDoc.updatedAt,
      },
    });
  } catch (err) {
    await revertirStock(decrementados);
    if (pedidoDoc?._id) {
      await Pedido.deleteOne({ _id: pedidoDoc._id }).catch(() => {});
      await Usuario.updateOne(
        { _id: clienteOid },
        { $pull: { pedidos: pedidoDoc._id } }
      ).catch(() => {});
    }
    next(err);
  }
});

module.exports = router;
