'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema, type CategoryFormData } from '@/src/lib/validations';
import type { Category } from '@/src/types';
import PriceDisplay from './PriceDisplay';
import { useDollarRate } from '@/src/hooks/useDollarRate';

interface CategoryFormProps {
    category?: Category;
    onSubmit: (data: CategoryFormData) => Promise<void>;
    onCancel: () => void;
}

export default function CategoryForm({ category, onSubmit, onCancel }: CategoryFormProps) {
    const { rate } = useDollarRate();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: category
            ? {
                name: category.name,
                pricePerTeam: category.pricePerTeam,
            }
            : {
                name: '',
                pricePerTeam: 0,
            },
    });

    const priceValue = watch('pricePerTeam');

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nombre de la Categoría */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre de la Categoría *
                </label>
                <input
                    {...register('name')}
                    type="text"
                    id="name"
                    placeholder="Ej: U9, U11, U13..."
                    className="input-field"
                    disabled={isSubmitting}
                />
                {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                )}
            </div>

            {/* Precio por Equipo */}
            <div>
                <label htmlFor="pricePerTeam" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Precio por Equipo (USD) *
                </label>
                <input
                    {...register('pricePerTeam', { valueAsNumber: true })}
                    type="number"
                    id="pricePerTeam"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="input-field"
                    disabled={isSubmitting}
                />
                {errors.pricePerTeam && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.pricePerTeam.message}</p>
                )}

                {/* Preview del precio */}
                {priceValue > 0 && (
                    <div className="mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Vista previa de precios:</p>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Por equipo:</span>
                                <PriceDisplay usdAmount={priceValue} showBoth={true} />
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-blue-200 dark:border-blue-800">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total por juego (2 equipos):</span>
                                <PriceDisplay usdAmount={priceValue * 2} showBoth={true} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Guardando...
                        </span>
                    ) : (
                        <>{category ? 'Actualizar Categoría' : 'Crear Categoría'}</>
                    )}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="btn-outline flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
}
