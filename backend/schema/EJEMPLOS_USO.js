/**
 * EJEMPLOS DE CÓMO USAR LAS VALIDACIONES EN TUS RUTAS
 * 
 * Este archivo muestra cómo implementar los esquemas de validación
 * en tus controladores Express
 */

// ==================== EJEMPLO PRODUCTO ====================

// En tu archivo de rutas (routes/productos.js)
import express from 'express';
import { 
    crearProductoSchema, 
    actualizarProductoSchema 
} from '../schema/producto.schema.js';

const router = express.Router();

// POST - Crear producto
// router.post('/', validar(crearProductoSchema), crearProducto);

// PUT - Actualizar producto
// router.put('/:id', validar(actualizarProductoSchema), actualizarProducto);


// ==================== EJEMPLO CLIENTE ====================

import { 
    crearClienteSchema, 
    actualizarClienteSchema,
    loginClienteSchema 
} from '../schema/cliente.schema.js';

// POST - Registrar cliente
// router.post('/registro', validar(crearClienteSchema), registroCliente);

// POST - Login cliente
// router.post('/login', validar(loginClienteSchema), loginCliente);

// PUT - Actualizar perfil
// router.put('/:id', validar(actualizarClienteSchema), actualizarCliente);


// ==================== EJEMPLO CATEGORÍA ====================

import { 
    crearCategoriaSchema, 
    actualizarCategoriaSchema 
} from '../schema/categoria.schema.js';

// POST - Crear categoría
// router.post('/', validar(crearCategoriaSchema), crearCategoria);

// PUT - Actualizar categoría
// router.put('/:id', validar(actualizarCategoriaSchema), actualizarCategoria);


// ==================== EJEMPLO EMPLEADO ====================

import { 
    crearEmpleadoSchema, 
    actualizarEmpleadoSchema,
    loginEmpleadoSchema 
} from './empleado.schema.js';

// POST - Crear empleado
// router.post('/', validar(crearEmpleadoSchema), crearEmpleado);

// POST - Login empleado
// router.post('/login', validar(loginEmpleadoSchema), loginEmpleado);

// PUT - Actualizar empleado
// router.put('/:id', validar(actualizarEmpleadoSchema), actualizarEmpleado);


// ==================== EJEMPLO PEDIDO ====================

import { 
    crearPedidoSchema, 
    actualizarPedidoSchema,
    actualizarEstadoPedidoSchema 
} from '../schema/pedido.schema.js';

// POST - Crear pedido
// router.post('/', validar(crearPedidoSchema), crearPedido);

// PUT - Actualizar pedido
// router.put('/:id', validar(actualizarPedidoSchema), actualizarPedido);

// PATCH - Actualizar solo estado
// router.patch('/:id/estado', validar(actualizarEstadoPedidoSchema), actualizarEstadoPedido);


// ==================== CARACTERÍSTICAS DE LAS VALIDACIONES ====================

/**
 * 
 * ✅ PRODUCTO
 * - nombre: string (3-100 caracteres), requerido
 * - descripcion: string (10-500 caracteres), requerido
 * - precio: número positivo, requerido
 * - imagen: URL válida (opcional)
 * - stock: número entero >= 0, requerido
 * - descuento: número 0-100 (opcional)
 * - categoria: ID MongoDB válido, requerido
 * 
 * ✅ CLIENTE
 * - username: alfanumérico (3-30 caracteres), requerido
 * - email: email válido, requerido, único
 * - password: mín 8 caracteres, con mayúsculas, minúsculas y números, requerido
 * - primerNombre: solo letras, requerido
 * - apellido: solo letras, requerido
 * - telefono: formato de teléfono (opcional)
 * - dirección: objeto anidado (opcional)
 * 
 * ✅ CATEGORÍA
 * - nombre: string (3-100 caracteres), requerido, único
 * - descripcion: string (10-500 caracteres), requerido
 * - imagen: URL válida (opcional)
 * - estado: 'activa' o 'inactiva' (default: activa)
 * 
 * ✅ EMPLEADO
 * - username: alfanumérico (3-30 caracteres), requerido
 * - email: email válido, requerido, único
 * - password: mín 8 caracteres, con mayúsculas, minúsculas y números, requerido
 * - primerNombre: solo letras, requerido
 * - apellido: solo letras, requerido
 * - rol: gerente, panadero, vendedor, administrativo, requerido
 * - salario: número positivo, requerido
 * - estado: activo, inactivo, licencia (default: activo)
 * 
 * ✅ PEDIDO
 * - cliente: ID MongoDB válido, requerido
 * - items: array con mín 1 item, requerido
 *   - producto: ID MongoDB válido, requerido
 *   - cantidad: número > 0, requerido
 *   - precioUnitario: número positivo, requerido
 * - subtotal: número >= 0, requerido
 * - descuentoTotal: número >= 0 (default: 0)
 * - total: número >= 0, requerido
 * 
 */

// ==================== RESPUESTA DE ERROR VALIDACIÓN ====================

/**
 * 
 * {
 *   "exito": false,
 *   "mensaje": "Error de validación",
 *   "errores": [
 *     {
 *       "campo": "nombre",
 *       "mensaje": "\"nombre\" must be at least 3 characters long"
 *     },
 *     {
 *       "campo": "email",
 *       "mensaje": "\"email\" must be a valid email"
 *     }
 *   ]
 * }
 * 
 */
