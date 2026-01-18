import { z } from 'zod';

// Schema para crear/editar categoría
export const categorySchema = z.object({
    name: z
        .string()
        .min(1, 'El nombre es requerido')
        .max(50, 'El nombre no puede exceder 50 caracteres')
        .regex(/^[A-Za-z0-9\s]+$/, 'El nombre solo puede contener letras, números y espacios'),
    pricePerTeam: z
        .number()
        .positive('El precio debe ser mayor a 0')
        .max(1000, 'El precio no puede exceder $1000'),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

// Schema para crear/editar juego
export const gameSchema = z.object({
    date: z.date(),
    time: z.string().optional(),
    categoryId: z.string().min(1, 'Debes seleccionar una categoría'),
    courtId: z.string().min(1, 'Debes seleccionar una cancha'),
    teamA: z
        .string()
        .min(1, 'El nombre del Equipo A es requerido')
        .max(100, 'El nombre no puede exceder 100 caracteres'),
    teamB: z
        .string()
        .min(1, 'El nombre del Equipo B es requerido')
        .max(100, 'El nombre no puede exceder 100 caracteres'),
});

export type GameFormData = z.infer<typeof gameSchema>;

// Schema para login
export const loginSchema = z.object({
    email: z.string().email('Debe ser un correo electrónico válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Schema para registro
export const registerSchema = z.object({
    displayName: z
        .string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(50, 'El nombre no puede exceder 50 caracteres'),
    email: z.string().email('Debe ser un correo electrónico válido'),
    password: z
        .string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .regex(/[A-Z]/, 'La contraseña debe contener al menos una mayúscula')
        .regex(/[0-9]/, 'La contraseña debe contener al menos un número'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

