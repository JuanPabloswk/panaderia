import { z } from 'zod';

export const crearCategoriaSchema = z.object({
    nombre: z.string()
        .min(3, 'El nombre de la categoría debe tener al menos 3 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres')
        .trim(),

    descripcion: z.string()
        .min(10, 'La descripción debe tener al menos 10 caracteres')
        .max(500, 'La descripción no puede exceder 500 caracteres')
        .trim(),

    imagen: z.string()
        .url('La imagen debe ser una URL válida')
        .nullable()
        .optional(),

    estado: z.enum(['activa', 'inactiva'])
        .optional()
        .default('activa')
});

export const actualizarCategoriaSchema = z.object({
    nombre: z.string()
        .min(3, 'El nombre de la categoría debe tener al menos 3 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres')
        .trim()
        .optional(),

    descripcion: z.string()
        .min(10, 'La descripción debe tener al menos 10 caracteres')
        .max(500, 'La descripción no puede exceder 500 caracteres')
        .trim()
        .optional(),

    imagen: z.string()
        .url('La imagen debe ser una URL válida')
        .nullable()
        .optional(),

    estado: z.enum(['activa', 'inactiva']).optional()
}).refine(obj => Object.keys(obj).length > 0, 'Al menos un campo es requerido');
