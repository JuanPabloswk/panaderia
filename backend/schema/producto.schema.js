import { z } from 'zod';

export const crearProductoSchema = z.object({
    nombre: z.string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres')
        .trim(),

    descripcion: z.string()
        .min(10, 'La descripción debe tener al menos 10 caracteres')
        .max(500, 'La descripción no puede exceder 500 caracteres')
        .trim(),

    precio: z.number()
        .positive('El precio debe ser mayor a 0'),

    imagen: z.string()
        .url('La imagen debe ser una URL válida')
        .nullable()
        .optional(),

    stock: z.number()
        .int('El stock debe ser un número entero')
        .min(0, 'El stock no puede ser negativo'),

    descuento: z.number()
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
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres')
        .trim()
        .optional(),

    descripcion: z.string()
        .min(10, 'La descripción debe tener al menos 10 caracteres')
        .max(500, 'La descripción no puede exceder 500 caracteres')
        .trim()
        .optional(),

    precio: z.number()
        .positive('El precio debe ser mayor a 0')
        .optional(),

    imagen: z.string()
        .url('La imagen debe ser una URL válida')
        .nullable()
        .optional(),

    stock: z.number()
        .int('El stock debe ser un número entero')
        .min(0, 'El stock no puede ser negativo')
        .optional(),

    descuento: z.number()
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
