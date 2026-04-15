import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    descripcion: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        default: null
    },
    estado: {
        type: String,
        enum: ['activa', 'inactiva'],
        default: 'activa'
    }
}, {
    timestamps: true
});

export default mongoose.model('Categoria', categoriaSchema)