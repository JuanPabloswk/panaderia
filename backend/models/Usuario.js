const mongoose = require('mongoose');

const preferenciasSchema = new mongoose.Schema(
  {
    favoriteProducts: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    newsletter: { type: Boolean, default: false },
  },
  { _id: false }
);

const usuarioSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    /** Opcional; obligatorio para personal (no cliente). Índice sparse único. */
    username: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
    },
    rol: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      enum: ['cliente', 'empleado', 'admin'],
      default: 'cliente',
    },
    primerNombre: { type: String, default: '' },
    apellido: { type: String, default: '' },
    telefono: { type: String, default: '' },
    salario: { type: Number, default: 0 },
    estado: {
      type: String,
      enum: ['activo', 'inactivo'],
      default: 'activo',
    },
    permisos: { type: [String], default: [] },
    fechaContratacion: { type: Date, default: null },
    pedidos: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    preferencias: {
      type: preferenciasSchema,
      default: () => ({ favoriteProducts: [], newsletter: false }),
    },
  },
  { timestamps: true }
);

usuarioSchema.index({ username: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Usuario', usuarioSchema, 'usuarios');
