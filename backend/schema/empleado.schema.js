import { z } from 'zod';

export const crearEmpleadoSchema = z.object({
    username: z.string()
        .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
        .max(30, 'El nombre de usuario no puede exceder 30 caracteres')
        .regex(/^[a-zA-Z0-9]+$/, 'El nombre de usuario solo puede contener letras y números')
        .trim(),

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

    rol: z.enum(['admin', 'gerente', 'panadero', 'vendedor', 'administrativo']),

    salario: z.number()
        .positive('El salario debe ser mayor a 0'),

    estado: z.enum(['activo', 'inactivo', 'licencia'])
        .optional()
        .default('activo')
});

export const actualizarEmpleadoSchema = z.object({
    username: z.string()
        .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
        .max(30, 'El nombre de usuario no puede exceder 30 caracteres')
        .regex(/^[a-zA-Z0-9]+$/, 'El nombre de usuario solo puede contener letras y números')
        .trim()
        .optional(),

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

    rol: z.enum(['admin', 'gerente', 'panadero', 'vendedor', 'administrativo']).optional(),

    salario: z.number()
        .positive('El salario debe ser mayor a 0')
        .optional(),

    estado: z.enum(['activo', 'inactivo', 'licencia']).optional(),

    horario: z.object({
        diaInicio: z.string().optional(),
        diaFin: z.string().optional(),
        horaInicio: z.string().optional(),
        horaFin: z.string().optional()
    }).optional(),

    permisos: z.array(z.enum(['crear', 'editar', 'eliminar', 'ver', 'gestionar_empleados'])).optional()
}).refine(obj => Object.keys(obj).length > 0, 'Al menos un campo es requerido');

export const loginEmpleadoSchema = z.object({
    email: z.string()
        .email('El email debe ser válido')
        .toLowerCase()
        .trim(),

    password: z.string()
        .min(1, 'La contraseña es requerida')
});
