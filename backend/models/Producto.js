const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true, min: 0 },
    imagen: { type: String, default: null },
    stock: { type: Number, default: 0, min: 0 },
    peso: { type: String, default: '' },
    ingredientes: { type: [String], default: [] },
    calificacion: { type: Number, default: 0, min: 0 },
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categoria',
      required: true,
    },
    disponible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Producto', productoSchema);
