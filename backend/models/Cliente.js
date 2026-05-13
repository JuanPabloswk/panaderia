const mongoose = require('mongoose');

const preferenciasSchema = new mongoose.Schema(
  {
    favoriteProducts: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    newsletter: { type: Boolean, default: false },
  },
  { _id: false }
);

const clienteSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    primerNombre: { type: String, default: '' },
    apellido: { type: String, default: '' },
    pedidos: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    preferencias: { type: preferenciasSchema, default: () => ({}) },
  },
  { timestamps: true }
);

/** Tercer argumento: nombre exacto de la colección en MongoDB (evita confusiones con modelos viejos). */
module.exports = mongoose.model('Cliente', clienteSchema, 'clientes');
