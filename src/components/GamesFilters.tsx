'use client';

import type { Category } from '@/src/types';

export type ViewMode = 'calendar' | 'teams';
export type GameStatus = 'all' | 'pending' | 'completed' | 'cancelled';

interface GamesFiltersProps {
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedCategory: string;
    onCategoryChange: (categoryId: string) => void;
    selectedStatus: GameStatus;
    onStatusChange: (status: GameStatus) => void;
    categories: Category[];
}

export default function GamesFilters({
    viewMode,
    onViewModeChange,
    searchQuery,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    selectedStatus,
    onStatusChange,
    categories,
}: GamesFiltersProps) {
    return (
        <div className="glass-card p-6 mb-6">
            <div className="space-y-4">
                {/* Vista Modo */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Modo de Vista
                    </label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onViewModeChange('calendar')}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${viewMode === 'calendar'
                                    ? 'bg-primary-500 text-white shadow-lg'
                                    : 'bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/70'
                                }`}
                        >
                            <svg className="w-5 h-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Vista Calendario
                        </button>
                        <button
                            onClick={() => onViewModeChange('teams')}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${viewMode === 'teams'
                                    ? 'bg-secondary-500 text-white shadow-lg'
                                    : 'bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/70'
                                }`}
                        >
                            <svg className="w-5 h-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Vista por Equipos
                        </button>
                    </div>
                </div>

                {/* Filtros */}
                <div className="grid md:grid-cols-3 gap-4">
                    {/* Buscador */}
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Buscar Equipo
                        </label>
                        <div className="relative">
                            <input
                                id="search"
                                type="text"
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                placeholder="Nombre del equipo..."
                                className="input-field pl-10"
                            />
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Filtro por Categoría */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Categoría
                        </label>
                        <select
                            id="category"
                            value={selectedCategory}
                            onChange={(e) => onCategoryChange(e.target.value)}
                            className="input-field"
                        >
                            <option value="">Todas las categorías</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro por Estado */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Estado
                        </label>
                        <select
                            id="status"
                            value={selectedStatus}
                            onChange={(e) => onStatusChange(e.target.value as GameStatus)}
                            className="input-field"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="pending">Pendiente</option>
                            <option value="completed">Completado</option>
                            <option value="cancelled">Cancelado</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
