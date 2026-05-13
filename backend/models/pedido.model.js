import mongoose from 'mongoose';

const itemPedidoSchema = new mongoose.Schema({
    producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
    cantidad: { type: Number, required: true, min: 1 },
    precioUnitario: { type: Number, required: true, min: 0 }
}, { _id: false });

const pedidoSchema = new mongoose.Schema({
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
    empleado: { type: mongoose.Schema.Types.ObjectId, ref: 'Empleado', default: null },
    items: [itemPedidoSchema],
    subtotal: { type: Number, required: true, min: 0 },
    descuentoTotal: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    estado: {
        type: String,
        enum: ['pendiente', 'confirmado', 'preparacion', 'listo', 'entregado', 'cancelado'],
        default: 'pendiente'
    },
    metodoPago: {
        type: String,
        enum: ['efectivo', 'tarjeta', 'transferencia', 'nequi'],
        default: 'efectivo'
    },
    tipoEntrega: {
        type: String,
        enum: ['domicilio', 'tienda'],
        default: 'tienda'
    },
    direccionEntrega: {
        calle: { type: String },
        ciudad: { type: String },
        departamento: String,
        zipCode: String,
        pais: { type: String },
        referencia: String
    },
    notasEspeciales: String,
    fechaPedido: { type: Date, default: Date.now, required: true },
    fechaEntrega: Date
}, { timestamps: true });

export default mongoose.model('Pedido', pedidoSchema);
