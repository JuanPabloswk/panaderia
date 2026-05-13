import mongoose from 'mongoose';

const empleadoSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    primerNombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    telefono: { type: String, trim: true },
    rol: {
        type: String,
        enum: ['admin', 'gerente', 'panadero', 'vendedor', 'administrativo'],
        required: true
    },
    salario: { type: Number, required: true },
    fechaContratacion: { type: Date, default: Date.now },
    estado: { type: String, enum: ['activo', 'inactivo', 'licencia'], default: 'activo' },
    horario: {
        diaInicio: String,
        diaFin: String,
        horaInicio: String,
        horaFin: String
    },
    permisos: [{
        type: String,
        enum: ['crear', 'editar', 'eliminar', 'ver', 'gestionar_empleados']
    }]
}, { timestamps: true });

export default mongoose.model('Empleado', empleadoSchema);
