const mongoose = require('mongoose');

const itemPedidoSchema = new mongoose.Schema(
  {
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto',
      required: true,
    },
    cantidad: { type: Number, required: true, min: 1 },
    precioUnitario: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const pedidoSchema = new mongoose.Schema(
  {
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    /** Nombre del comprador al crear el pedido (solo rol `cliente` puede comprar). */
    clienteNombre: { type: String, default: '' },
    empleado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      default: null,
    },
    items: { type: [itemPedidoSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    descuentoTotal: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    estado: {
      type: String,
      enum: [
        'pendiente',
        'confirmado',
        'en_preparacion',
        'listo',
        'entregado',
        'cancelado',
      ],
      default: 'pendiente',
    },
    metodoPago: {
      type: String,
      enum: ['efectivo', 'tarjeta', 'transferencia', 'pse', 'otro'],
      default: 'efectivo',
    },
    tipoEntrega: {
      type: String,
      enum: ['tienda', 'domicilio'],
      default: 'tienda',
    },
    fechaPedido: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pedido', pedidoSchema, 'pedidos');
