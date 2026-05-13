import mongoose from 'mongoose'

const clienteSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    primerNombre: {
        type: String,
        required: true,
        trim: true
    },
    apellido: {
        type: String,
        required: true,
        trim: true
    },
    telefono: {
        type: String,
        trim: true
    },
    direccion: {
        calle: String,
        ciudad: String,
        departamento: String,
        zipCode: String,
        pais: String
    },
    pedidos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pedido'
    }],
    preferencias: {
        favoriteProducts: [{type: mongoose.Schema.Types.ObjectId, 
            ref: 'Producto'}],
        newsletter: {
            type: Boolean,
            default: false
        }
    }
}, { 
    timestamps: true 
})

export default mongoose.model('Cliente', clienteSchema)
