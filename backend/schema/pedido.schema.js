import { z } from 'zod';

export const crearPedidoSchema = z.object({
    cliente: z.string()
        .regex(/^[0-9a-fA-F]{24}$/, 'El ID de cliente debe ser válido'),

    items: z.array(
        z.object({
            producto: z.string()
                .regex(/^[0-9a-fA-F]{24}$/, 'El ID de producto debe ser válido'),
            cantidad: z.number()
                .int('La cantidad debe ser un número entero')
                .min(1, 'La cantidad debe ser mayor a 0'),
            precioUnitario: z.number()
                .positive('El precio debe ser mayor a 0')
        })
    ).min(1, 'El pedido debe contener al menos un item'),

    subtotal: z.number()
        .min(0, 'El subtotal no puede ser negativo'),

    descuentoTotal: z.number()
        .min(0, 'El descuento no puede ser negativo')
        .optional()
        .default(0),

    total: z.number()
        .min(0, 'El total no puede ser negativo'),

    metodoPago: z.enum(['efectivo', 'tarjeta', 'transferencia', 'nequi'])
        .optional()
        .default('efectivo'),

    tipoEntrega: z.enum(['domicilio', 'tienda'])
        .optional()
        .default('tienda'),

    direccionEntrega: z.object({
        calle: z.string().trim().optional(),
        ciudad: z.string().trim().optional(),
        departamento: z.string().trim().optional(),
        zipCode: z.string().trim().optional(),
        pais: z.string().trim().optional(),
        referencia: z.string().trim().optional()
    }).optional(),

    notasEspeciales: z.string().trim().optional()
});

export const actualizarPedidoSchema = z.object({
    estado: z.enum(['pendiente', 'confirmado', 'preparacion', 'listo', 'entregado', 'cancelado']),

    empleado: z.string()
        .regex(/^[0-9a-fA-F]{24}$/, 'El ID de empleado debe ser válido')
        .nullable()
        .optional(),

    metodoPago: z.enum(['efectivo', 'tarjeta', 'transferencia', 'nequi']).optional(),

    tipoEntrega: z.enum(['domicilio', 'tienda']).optional(),

    notasEspeciales: z.string().trim().optional(),

    fechaEntrega: z.string().datetime().optional()
}).refine(obj => Object.keys(obj).length > 0, 'Al menos un campo es requerido');

export const actualizarEstadoPedidoSchema = z.object({
    estado: z.enum(['pendiente', 'confirmado', 'preparacion', 'listo', 'entregado', 'cancelado'])
});
