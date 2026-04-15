import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true,
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    imagen: {
        type: String,
        default: null
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    descuento: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    calificacion: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true,
    },
    disponible: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

export default mongoose.model('Producto', productoSchema)