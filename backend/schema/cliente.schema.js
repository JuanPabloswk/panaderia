import { z } from 'zod';

export const crearClienteSchema = z.object({
    email: z.string()
        .email('El email debe ser válido')
        .toLowerCase()
        .trim(),

    password: z.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
            'La contraseña debe contener mayúsculas, minúsculas y números'),

    primerNombre: z.string()
        .min(2, 'El primer nombre debe tener al menos 2 caracteres')
        .max(50, 'El primer nombre no puede exceder 50 caracteres')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El primer nombre solo puede contener letras')
        .trim(),

    apellido: z.string()
        .min(2, 'El apellido debe tener al menos 2 caracteres')
        .max(50, 'El apellido no puede exceder 50 caracteres')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El apellido solo puede contener letras')
        .trim(),

    telefono: z.string()
        .regex(/^[\d\s\-\+\(\)]{7,20}$/, 'El teléfono no es válido')
        .trim()
        .optional(),

    direccion: z.object({
        calle: z.string().trim().optional(),
        ciudad: z.string().trim().optional(),
        departamento: z.string().trim().optional(),
        zipCode: z.string().trim().optional(),
        pais: z.string().trim().optional()
    }).optional(),

    newsletter: z.boolean().optional().default(false)
});

export const actualizarClienteSchema = z.object({
    email: z.string()
        .email('El email debe ser válido')
        .toLowerCase()
        .trim()
        .optional(),

    primerNombre: z.string()
        .min(2, 'El primer nombre debe tener al menos 2 caracteres')
        .max(50, 'El primer nombre no puede exceder 50 caracteres')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El primer nombre solo puede contener letras')
        .trim()
        .optional(),

    apellido: z.string()
        .min(2, 'El apellido debe tener al menos 2 caracteres')
        .max(50, 'El apellido no puede exceder 50 caracteres')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El apellido solo puede contener letras')
        .trim()
        .optional(),

    telefono: z.string()
        .regex(/^[\d\s\-\+\(\)]{7,20}$/, 'El teléfono no es válido')
        .trim()
        .optional(),

    direccion: z.object({
        calle: z.string().trim().optional(),
        ciudad: z.string().trim().optional(),
        departamento: z.string().trim().optional(),
        zipCode: z.string().trim().optional(),
        pais: z.string().trim().optional()
    }).optional()
}).refine(obj => Object.keys(obj).length > 0, 'Al menos un campo es requerido');

export const loginClienteSchema = z.object({
    email: z.string()
        .email('El email debe ser válido')
        .toLowerCase()
        .trim(),

    password: z.string()
        .min(1, 'La contraseña es requerida')
});
