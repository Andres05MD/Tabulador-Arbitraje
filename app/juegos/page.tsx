'use client';

import { useEffect, useState, useMemo } from 'react';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Game, Category } from '@/src/types';
import {
    subscribeToGames,
    createGame,
    updateGame,
    deleteGame,
    updateGameStatus,
} from '@/src/lib/gameService';
import { subscribeToCategories } from '@/src/lib/categoryService';
import GameForm from '@/src/components/GameForm';
import PriceDisplay from '@/src/components/PriceDisplay';
import FirebasePermissionsError from '@/src/components/FirebasePermissionsError';
import GamesFilters, { type ViewMode, type GameStatus } from '@/src/components/GamesFilters';
import TeamsView from '@/src/components/TeamsView';
import type { GameFormData } from '@/src/lib/validations';

import { useAuth } from '@/src/components/AuthProvider';

export default function JuegosPage() {
    const { user } = useAuth();
    const [games, setGames] = useState<Game[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingGame, setEditingGame] = useState<Game | null>(null);

    // Filtros
    const [viewMode, setViewMode] = useState<ViewMode>('calendar');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<GameStatus>('all');

    useEffect(() => {
        if (!user) return;

        let gamesUnsubscribe: (() => void) | null = null;
        let categoriesUnsubscribe: (() => void) | null = null;
        let loadingCount = 2;

        const checkLoading = () => {
            loadingCount--;
            if (loadingCount === 0) {
                setLoading(false);
            }
        };

        categoriesUnsubscribe = subscribeToCategories(
            user.uid,
            (updatedCategories) => {
                setCategories(updatedCategories);
                checkLoading();
            },
            (err) => {
                console.error('Error loading categories:', err);
                if (err.code === 'permission-denied') {
                    setError('firebase-permissions');
                } else {
                    setError('Error al cargar las categorías');
                }
                checkLoading();
            }
        );

        gamesUnsubscribe = subscribeToGames(
            user.uid,
            (updatedGames) => {
                setGames(updatedGames);
                checkLoading();
            },
            (err) => {
                console.error('Error loading games:', err);
                if (err.code === 'permission-denied') {
                    setError('firebase-permissions');
                } else {
                    setError('Error al cargar los juegos');
                }
                checkLoading();
            }
        );

        return () => {
            if (gamesUnsubscribe) gamesUnsubscribe();
            if (categoriesUnsubscribe) categoriesUnsubscribe();
        };
    }, [user]);

    // Aplicar filtros
    const filteredGames = useMemo(() => {
        return games.filter((game) => {
            // Filtro por búsqueda
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                if (
                    !game.teamA.toLowerCase().includes(query) &&
                    !game.teamB.toLowerCase().includes(query)
                ) {
                    return false;
                }
            }

            // Filtro por categoría
            if (selectedCategory && game.categoryId !== selectedCategory) {
                return false;
            }

            // Filtro por estado
            if (selectedStatus !== 'all') {
                const gameStatus = game.status || 'pending';
                if (gameStatus !== selectedStatus) {
                    return false;
                }
            }

            return true;
        });
    }, [games, searchQuery, selectedCategory, selectedStatus]);

    const handleCreate = () => {
        if (categories.length === 0) {
            Swal.fire({
                title: 'Sin Categorías',
                text: 'Primero debes crear categorías antes de registrar juegos.',
                icon: 'warning',
                confirmButtonText: 'OK',
                confirmButtonColor: '#0ea5e9',
            });
            return;
        }
        setEditingGame(null);
        setShowForm(true);
    };

    const handleEdit = (game: Game) => {
        setEditingGame(game);
        setShowForm(true);
    };

    const handleSubmit = async (data: GameFormData) => {
        if (!user) return;

        try {
            const category = categories.find((cat) => cat.id === data.categoryId);
            if (!category) {
                throw new Error('Categoría no encontrada');
            }

            if (editingGame) {
                await updateGame(editingGame.id, data, category);
                await Swal.fire({
                    title: '¡Actualizado!',
                    text: 'El juego se ha actualizado correctamente',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#0ea5e9',
                });
            } else {
                await createGame({
                    ...data,
                    ownerId: user.uid,
                }, category);
                await Swal.fire({
                    title: '¡Registrado!',
                    text: 'El juego se ha registrado correctamente',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#0ea5e9',
                });
            }
            setShowForm(false);
            setEditingGame(null);
        } catch (error) {
            console.error('Error saving game:', error);
            await Swal.fire({
                title: 'Error',
                text: 'Hubo un error al guardar el juego',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#ef4444',
            });
        }
    };

    const handleChangeStatus = async (game: Game, newStatus: 'pending' | 'completed' | 'cancelled') => {
        try {
            await updateGameStatus(game.id, newStatus);
            const statusText = newStatus === 'completed' ? 'Completado' : newStatus === 'cancelled' ? 'Cancelado' : 'Pendiente';
            await Swal.fire({
                title: 'Estado Actualizado',
                text: `El juego ahora está marcado como: ${statusText}`,
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#0ea5e9',
                timer: 2000,
            });
        } catch (error) {
            console.error('Error updating status:', error);
            await Swal.fire({
                title: 'Error',
                text: 'Hubo un error al actualizar el estado',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#ef4444',
            });
        }
    };

    const handleDelete = async (game: Game) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            html: `¿Deseas eliminar el juego <strong>${game.teamA} vs ${game.teamB}</strong>?<br/>Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
        });

        if (result.isConfirmed) {
            try {
                await deleteGame(game.id);
                await Swal.fire({
                    title: '¡Eliminado!',
                    text: 'El juego se ha eliminado correctamente',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#0ea5e9',
                });
            } catch (error) {
                console.error('Error deleting game:', error);
                await Swal.fire({
                    title: 'Error',
                    text: 'Hubo un error al eliminar el juego',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#ef4444',
                });
            }
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingGame(null);
    };

    // Calcular total del tabulador
    const totalTabulador = filteredGames.reduce((sum, game) => sum + game.totalCost, 0);

    if (error === 'firebase-permissions') {
        return (
            <div className="page-container">
                <FirebasePermissionsError />
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <div className="glass-card p-8 text-center">
                    <svg
                        className="w-16 h-16 mx-auto mb-4 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Error</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
                    <button onClick={() => window.location.reload()} className="btn-primary">
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="page-container">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-300">Cargando juegos...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="flex justify-between items-center mb-8">
                <h1 className="page-title mb-0">Gestión de Juegos</h1>
                {!showForm && (
                    <button onClick={handleCreate} className="btn-primary">
                        <svg className="w-5 h-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nuevo Juego
                    </button>
                )}
            </div>

            {showForm ? (
                <div className="glass-card p-6 mb-6 animate-slide-down">
                    <h2 className="section-title">{editingGame ? 'Editar Juego' : 'Nuevo Juego'}</h2>
                    <GameForm
                        game={editingGame || undefined}
                        categories={categories}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />
                </div>
            ) : (
                <>
                    {/* Filtros */}
                    <GamesFilters
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                        selectedStatus={selectedStatus}
                        onStatusChange={setSelectedStatus}
                        categories={categories}
                    />

                    {/* Resumen del Tabulador */}
                    {filteredGames.length > 0 && (
                        <div className="glass-card p-6 mb-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                                        Total del Tabulador
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {filteredGames.length} {filteredGames.length === 1 ? 'juego' : 'juegos'}
                                        {searchQuery || selectedCategory || selectedStatus !== 'all' ? ' (filtrado)' : ''}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <PriceDisplay usdAmount={totalTabulador} showBoth={true} className="text-right" />
                                </div>
                            </div>
                        </div>
                    )}

                    {filteredGames.length === 0 ? (
                        <div className="glass-card p-12 text-center">
                            <svg
                                className="w-16 h-16 mx-auto mb-4 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                                {games.length === 0 ? 'No hay juegos registrados' : 'No se encontraron juegos'}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                {games.length === 0
                                    ? 'Comienza registrando el primer juego del día'
                                    : 'Intenta ajustar los filtros para ver más resultados'}
                            </p>
                            {games.length === 0 && (
                                <button onClick={handleCreate} className="btn-primary">
                                    Registrar Primer Juego
                                </button>
                            )}
                        </div>
                    ) : viewMode === 'teams' ? (
                        <TeamsView games={filteredGames} onEditGame={handleEdit} onDeleteGame={handleDelete} />
                    ) : (
                        <div className="space-y-4">
                            {filteredGames.map((game) => {
                                const gameStatus = game.status || 'pending';
                                return (
                                    <div key={game.id} className="glass-card-hover p-5">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                    <span className="px-3 py-1 text-sm font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                                                        {game.categoryName}
                                                    </span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        {format(game.date.toDate(), "d 'de' MMMM, yyyy", { locale: es })}
                                                        {game.time && ` - ${game.time}`}
                                                    </span>
                                                    {gameStatus !== 'pending' && (
                                                        <span
                                                            className={`px-2 py-0.5 text-xs font-medium rounded ${gameStatus === 'completed'
                                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                                                }`}
                                                        >
                                                            {gameStatus === 'completed' ? 'Completado' : 'Cancelado'}
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                                    {game.teamA} <span className="text-gray-400 mx-2">vs</span> {game.teamB}
                                                </h3>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tabulador:</p>
                                                    <PriceDisplay usdAmount={game.totalCost} showBoth={true} />
                                                </div>

                                                <div className="flex gap-2">
                                                    {/* Dropdown de estado */}
                                                    <div className="relative group">
                                                        <button
                                                            className={`p-2 rounded-lg transition-colors ${gameStatus === 'completed'
                                                                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                                                                : gameStatus === 'cancelled'
                                                                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                                                                    : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400'
                                                                }`}
                                                            title="Cambiar estado"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </button>
                                                        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                                            <button
                                                                onClick={() => handleChangeStatus(game, 'pending')}
                                                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                                                            >
                                                                Pendiente
                                                            </button>
                                                            <button
                                                                onClick={() => handleChangeStatus(game, 'completed')}
                                                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                                            >
                                                                Completado
                                                            </button>
                                                            <button
                                                                onClick={() => handleChangeStatus(game, 'cancelled')}
                                                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
                                                            >
                                                                Cancelado
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => handleEdit(game)}
                                                        className="p-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                                        title="Editar"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(game)}
                                                        className="p-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
