const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    /** Opcional; si falta, el front usa `slugify(nombre)` (ver serializeProducto). */
    slug: { type: String, lowercase: true, trim: true },
    descripcion: { type: String, default: '' },
    imagen: { type: String, default: null },
    estado: {
      type: String,
      enum: ['activa', 'inactiva'],
      default: 'activa',
    },
  },
  { timestamps: true }
);

categoriaSchema.index({ nombre: 1 });
categoriaSchema.index({ slug: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Categoria', categoriaSchema);
