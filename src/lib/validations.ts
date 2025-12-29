import { z } from 'zod';

// Schema para crear/editar categoría
export const categorySchema = z.object({
    name: z
        .string()
        .min(1, 'El nombre es requerido')
        .max(50, 'El nombre no puede exceder 50 caracteres')
        .regex(/^[A-Za-z0-9\s]+$/, 'El nombre solo puede contener letras, números y espacios'),
    pricePerTeam: z
        .number({
            required_error: 'El precio es requerido',
            invalid_type_error: 'El precio debe ser un número',
        })
        .positive('El precio debe ser mayor a 0')
        .max(1000, 'El precio no puede exceder $1000'),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

// Schema para crear/editar juego
export const gameSchema = z.object({
    date: z.date({
        required_error: 'La fecha es requerida',
        invalid_type_error: 'La fecha debe ser válida',
    }),
    time: z.string().optional(),
    categoryId: z.string().min(1, 'Debes seleccionar una categoría'),
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
