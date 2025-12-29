'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { gameSchema, type GameFormData } from '@/src/lib/validations';
import type { Game, Category } from '@/src/types';
import PriceDisplay from './PriceDisplay';
import { useMemo } from 'react';

interface GameFormProps {
    game?: Game;
    categories: Category[];
    onSubmit: (data: GameFormData) => Promise<void>;
    onCancel: () => void;
}

export default function GameForm({ game, categories, onSubmit, onCancel }: GameFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors, isSubmitting },
    } = useForm<GameFormData>({
        resolver: zodResolver(gameSchema),
        defaultValues: game
            ? {
                date: game.date.toDate(),
                time: game.time || '',
                categoryId: game.categoryId,
                teamA: game.teamA,
                teamB: game.teamB,
            }
            : {
                date: new Date(),
                time: '',
                categoryId: '',
                teamA: '',
                teamB: '',
            },
    });

    const selectedCategoryId = watch('categoryId');

    const selectedCategory = useMemo(() => {
        return categories.find((cat) => cat.id === selectedCategoryId);
    }, [selectedCategoryId, categories]);

    const totalCost = selectedCategory ? selectedCategory.pricePerTeam * 2 : 0;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                {/* Fecha */}
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Fecha del Juego *
                    </label>
                    <Controller
                        name="date"
                        control={control}
                        render={({ field }) => (
                            <input
                                {...field}
                                type="date"
                                id="date"
                                value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                                onChange={(e) => field.onChange(new Date(e.target.value))}
                                className="input-field"
                                disabled={isSubmitting}
                            />
                        )}
                    />
                    {errors.date && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date.message}</p>
                    )}
                </div>

                {/* Hora (opcional) */}
                <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Hora (opcional)
                    </label>
                    <input
                        {...register('time')}
                        type="time"
                        id="time"
                        className="input-field"
                        disabled={isSubmitting}
                    />
                </div>
            </div>

            {/* Categoría */}
            <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Categoría *
                </label>
                <select
                    {...register('categoryId')}
                    id="categoryId"
                    className="input-field"
                    disabled={isSubmitting}
                >
                    <option value="">Selecciona una categoría...</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name} - ${category.pricePerTeam} por equipo
                        </option>
                    ))}
                </select>
                {errors.categoryId && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.categoryId.message}</p>
                )}
            </div>

            {/* Equipos */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Equipo A */}
                <div>
                    <label htmlFor="teamA" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Equipo A *
                    </label>
                    <input
                        {...register('teamA')}
                        type="text"
                        id="teamA"
                        placeholder="Nombre del Equipo A"
                        className="input-field"
                        disabled={isSubmitting}
                    />
                    {errors.teamA && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.teamA.message}</p>
                    )}
                </div>

                {/* Equipo B */}
                <div>
                    <label htmlFor="teamB" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Equipo B *
                    </label>
                    <input
                        {...register('teamB')}
                        type="text"
                        id="teamB"
                        placeholder="Nombre del Equipo B"
                        className="input-field"
                        disabled={isSubmitting}
                    />
                    {errors.teamB && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.teamB.message}</p>
                    )}
                </div>
            </div>

            {/* Preview del tabulador */}
            {selectedCategory && (
                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
                        Cálculo del Tabulador
                    </h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Categoría:</span>
                            <span className="font-medium text-gray-800 dark:text-gray-100">{selectedCategory.name}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Precio por equipo:</span>
                            <PriceDisplay usdAmount={selectedCategory.pricePerTeam} showBoth={true} />
                        </div>
                        <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-800 dark:text-gray-100">Total Tabulador (2 equipos):</span>
                                <PriceDisplay usdAmount={totalCost} showBoth={true} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                        <>{game ? 'Actualizar Juego' : 'Registrar Juego'}</>
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
