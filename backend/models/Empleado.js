const mongoose = require('mongoose');

const empleadoSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, lowercase: true },
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
    telefono: { type: String, default: '' },
    rol: { type: String, required: true, lowercase: true, trim: true },
    salario: { type: Number, default: 0 },
    estado: {
      type: String,
      enum: ['activo', 'inactivo'],
      default: 'activo',
    },
    permisos: { type: [String], default: [] },
    fechaContratacion: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

empleadoSchema.index({ username: 1 }, { unique: true });

module.exports = mongoose.model('Empleado', empleadoSchema, 'empleados');
