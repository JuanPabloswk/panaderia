import { z } from 'zod';

export const crearProductoSchema = z.object({
    nombre: z.string()
        .max(100, 'El nombre no puede exceder 100 caracteres')
        .trim(),

    descripcion: z.string()
        .max(500, 'La descripción no puede exceder 500 caracteres')
        .trim(),

    precio: z.coerce.number()
        .positive('El precio debe ser mayor a 0'),

    imagen: z.string().nullable().optional(),

    stock: z.coerce.number()
        .int('El stock debe ser un número entero')
        .min(0, 'El stock no puede ser negativo'),

    descuento: z.coerce.number()
        .min(0, 'El descuento no puede ser menor a 0')
        .max(100, 'El descuento no puede exceder 100')
        .optional()
        .default(0),

    peso: z.string()
        .trim()
        .optional(),

    ingredientes: z.array(z.string().trim())
        .optional()
        .default([]),

    categoria: z.string()
        .regex(/^[0-9a-fA-F]{24}$/, 'El ID de categoría debe ser válido')
});

export const actualizarProductoSchema = z.object({
    nombre: z.string()
        .max(100, 'El nombre no puede exceder 100 caracteres')
        .trim()
        .optional(),

    descripcion: z.string()
        .max(500, 'La descripción no puede exceder 500 caracteres')
        .trim()
        .optional(),

    precio: z.coerce.number()
        .positive('El precio debe ser mayor a 0')
        .optional(),

    imagen: z.string().nullable().optional(),

    stock: z.coerce.number()
        .int('El stock debe ser un número entero')
        .min(0, 'El stock no puede ser negativo')
        .optional(),

    descuento: z.coerce.number()
        .min(0, 'El descuento no puede ser menor a 0')
        .max(100, 'El descuento no puede exceder 100')
        .optional(),

    peso: z.string()
        .trim()
        .optional(),

    ingredientes: z.array(z.string().trim())
        .optional(),

    disponible: z.boolean().optional(),

    categoria: z.string()
        .regex(/^[0-9a-fA-F]{24}$/, 'El ID de categoría debe ser válido')
        .optional()
}).refine(obj => Object.keys(obj).length > 0, 'Al menos un campo es requerido');
