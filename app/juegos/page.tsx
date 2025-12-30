'use client';

import { useEffect, useState, useMemo } from 'react';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import type { Game, Category } from '@/src/types';
import {
    subscribeToGames,
    updateGame,
    deleteGame,
    updateGameStatus,
    updateGamePaymentStatus,
    deleteOldGames,
} from '@/src/lib/gameService';
import { subscribeToCategories } from '@/src/lib/categoryService';
import GameForm from '@/src/components/GameForm';
import PriceDisplay from '@/src/components/PriceDisplay';
import FirebasePermissionsError from '@/src/components/FirebasePermissionsError';
import GamesFilters, { type ViewMode, type GameStatus } from '@/src/components/GamesFilters';
import TeamsView from '@/src/components/TeamsView';
import type { GameFormData } from '@/src/lib/validations';

import { useAuth } from '@/src/components/AuthProvider';
import { useCourt } from '@/src/components/CourtProvider';
import { MotionDiv, staggerContainer, GlassCard, MotionButton } from '@/src/components/ui/motion';
import { AnimatePresence } from 'framer-motion';

export default function JuegosPage() {
    const { user, role, loading: authLoading } = useAuth();
    const { selectedCourt } = useCourt();
    const [games, setGames] = useState<Game[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingGame, setEditingGame] = useState<Game | null>(null);

    // Filtros
    const [viewMode, setViewMode] = useState<ViewMode>('calendar');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<GameStatus>('all');

    useEffect(() => {
        if (authLoading || !user || !selectedCourt) return;

        // Limpieza de juegos antiguos (solo admin)
        if (role === 'admin') {
            deleteOldGames().catch(console.error);
        }

        let gamesUnsubscribe: (() => void) | null = null;
        let categoriesUnsubscribe: (() => void) | null = null;
        let loadingCount = 2;

        const checkLoading = () => {
            loadingCount--;
            if (loadingCount <= 0) {
                setLoading(false);
            }
        };

        categoriesUnsubscribe = subscribeToCategories(
            null, // Global categories
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
            selectedCourt.id,
            {
                ownerId: role === 'admin' ? null : user.uid,
                date: new Date() // Load only today's games by default
            },
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
    }, [user, role, selectedCourt, authLoading]);

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

    const handleEdit = (game: Game) => {
        setEditingGame(game);
        setShowEditForm(true);
    };

    const handleSubmit = async (data: GameFormData) => {
        if (!user || !editingGame) return;

        try {
            const category = categories.find((cat) => cat.id === data.categoryId);
            if (!category) {
                throw new Error('Categoría no encontrada');
            }

            await updateGame(editingGame.id, data, category);
            await Swal.fire({
                title: '¡Actualizado!',
                text: 'El juego se ha actualizado correctamente',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#0ea5e9',
            });

            setShowEditForm(false);
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

    const handlePaymentToggle = async (game: Game, team: 'A' | 'B') => {
        try {
            const currentStatus = team === 'A' ? game.isPaidTeamA : game.isPaidTeamB;
            const newPaymentStatus = !currentStatus;
            let paymentRef = undefined;

            // Si se va a marcar como pagado, pedir referencia opcional
            if (newPaymentStatus) {
                const { value: reference, isDismissed } = await Swal.fire({
                    title: 'Referencia de Pago',
                    text: 'Ingresa la referencia de la operación (Opcional)',
                    input: 'text',
                    inputPlaceholder: 'Ej: 123456...',
                    showCancelButton: true,
                    confirmButtonText: 'Guardar',
                    cancelButtonText: 'Cancelar',
                    confirmButtonColor: '#0ea5e9',
                    cancelButtonColor: '#6b7280',
                    background: '#1e293b', // Fondo oscuro para coincidir con tema
                    color: '#fff',
                });

                // Si el usuario cancela, no hacemos nada
                if (isDismissed) return;

                paymentRef = reference;
            }

            await updateGamePaymentStatus(game.id, team, newPaymentStatus, paymentRef);

            // Feedback visual sutil (Toast)
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                background: '#1e293b',
                color: '#fff'
            });

            Toast.fire({
                icon: 'success',
                title: newPaymentStatus ? 'Pago registrado' : 'Pago revertido'
            });

        } catch (error) {
            console.error('Error updating payment status:', error);
            await Swal.fire({
                title: 'Error',
                text: 'Hubo un error al actualizar el pago',
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
        setShowEditForm(false);
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
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4 mt-10 sm:mt-0">
                <h1 className="page-title mb-0 text-center sm:text-left w-full sm:w-auto">Juegos del Día</h1>
                {!showEditForm && (
                    <Link href="/juegos/cargar" className="btn-primary w-full sm:w-auto justify-center">
                        <svg className="w-5 h-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Cargar Juego
                    </Link>
                )}
            </div>

            {showEditForm ? (
                <div className="glass-card p-6 mb-6 animate-slide-down">
                    <h2 className="section-title">Editar Juego</h2>
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
                                <Link href="/juegos/cargar" className="btn-primary inline-flex">
                                    Registrar Primer Juego
                                </Link>
                            )}
                        </div>
                    ) : viewMode === 'teams' ? (
                        <TeamsView
                            games={filteredGames}
                            onEditGame={handleEdit}
                            onDeleteGame={handleDelete}
                            onTogglePayment={handlePaymentToggle}
                        />
                    ) : (
                        <MotionDiv
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="space-y-4"
                        >
                            <AnimatePresence>
                                {filteredGames.map((game) => {
                                    const gameStatus = game.status || 'pending';
                                    return (
                                        <GlassCard
                                            key={game.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="relative overflow-hidden group p-0"
                                        >
                                            <div className="flex flex-col md:flex-row">
                                                {/* Estado Lateral Izquierdo */}
                                                <div className={`md:w-1.5 h-1.5 md:h-auto w-full transition-colors duration-300 ${gameStatus === 'completed' ? 'bg-emerald-500' :
                                                    gameStatus === 'cancelled' ? 'bg-red-500' : 'bg-blue-500'
                                                    }`} />

                                                <div className="flex-1 p-5">
                                                    {/* Cabecera de la Tarjeta: Fecha, Hora y Chips */}
                                                    <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-700/50">
                                                        <div className="flex items-center gap-2 text-sm text-slate-400">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            <span className="font-medium">{format(game.date.toDate(), "d 'de' MMMM", { locale: es })}</span>
                                                            {game.time && (
                                                                <>
                                                                    <span className="text-slate-600">•</span>
                                                                    <span className="font-semibold text-slate-200 bg-slate-800 px-2 py-0.5 rounded text-xs">{game.time}</span>
                                                                </>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-600 rounded-full tracking-wider">
                                                                {game.categoryName}
                                                            </span>
                                                            {gameStatus !== 'pending' && (
                                                                <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full border tracking-wider ${gameStatus === 'completed'
                                                                    ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/30'
                                                                    : 'bg-red-950/30 text-red-400 border-red-500/30'
                                                                    }`}>
                                                                    {gameStatus === 'completed' ? 'COMPLETADO' : 'CANCELADO'}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Cuerpo del Enfrentamiento */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                                        {/* Equipo A */}
                                                        <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/30">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Local</span>
                                                                {game.isPaidTeamA && (
                                                                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                        PAGADO
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center justify-between gap-3">
                                                                <span className={`text-lg font-bold truncate ${game.isPaidTeamA ? 'text-white' : 'text-slate-300'}`}>
                                                                    {game.teamA}
                                                                </span>
                                                                <MotionButton
                                                                    onClick={() => handlePaymentToggle(game, 'A')}
                                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${game.isPaidTeamA
                                                                        ? 'bg-slate-800 text-emerald-500 border-emerald-900 hover:bg-emerald-950'
                                                                        : 'bg-blue-600 text-white border-blue-500 hover:bg-blue-500 shadow-lg shadow-blue-500/20'
                                                                        }`}
                                                                >
                                                                    {game.isPaidTeamA ? 'REVERTIR' : 'PAGAR'}
                                                                </MotionButton>
                                                            </div>
                                                            {game.paymentRefTeamA && (
                                                                <div className="mt-2 text-[10px] text-slate-500 font-mono bg-slate-900/50 px-2 py-1 rounded w-fit">
                                                                    REF: {game.paymentRefTeamA}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Separador VS Movil */}
                                                        <div className="flex items-center justify-center md:hidden -my-3 z-10">
                                                            <span className="bg-slate-800 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-full border border-slate-700">VS</span>
                                                        </div>

                                                        {/* Equipo B */}
                                                        <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/30">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Visitante</span>
                                                                {game.isPaidTeamB && (
                                                                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                        PAGADO
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center justify-between gap-3">
                                                                <span className={`text-lg font-bold truncate ${game.isPaidTeamB ? 'text-white' : 'text-slate-300'}`}>
                                                                    {game.teamB}
                                                                </span>
                                                                <MotionButton
                                                                    onClick={() => handlePaymentToggle(game, 'B')}
                                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${game.isPaidTeamB
                                                                        ? 'bg-slate-800 text-emerald-500 border-emerald-900 hover:bg-emerald-950'
                                                                        : 'bg-blue-600 text-white border-blue-500 hover:bg-blue-500 shadow-lg shadow-blue-500/20'
                                                                        }`}
                                                                >
                                                                    {game.isPaidTeamB ? 'REVERTIR' : 'PAGAR'}
                                                                </MotionButton>
                                                            </div>
                                                            {game.paymentRefTeamB && (
                                                                <div className="mt-2 text-[10px] text-slate-500 font-mono bg-slate-900/50 px-2 py-1 rounded w-fit">
                                                                    REF: {game.paymentRefTeamB}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Acciones */}
                                                <div className="flex md:flex-col border-t md:border-t-0 md:border-l border-slate-700/50 divide-x md:divide-x-0 md:divide-y divide-slate-700/50 bg-slate-900/50">
                                                    <button
                                                        onClick={() => handleEdit(game)}
                                                        className="flex-1 md:flex-none p-4 md:p-3 text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                                                        title="Editar"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        <span className="md:hidden text-xs font-bold">Editar</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(game)}
                                                        className="flex-1 md:flex-none p-4 md:p-3 text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                                                        title="Eliminar"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        <span className="md:hidden text-xs font-bold">Eliminar</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    );
                                })}
                            </AnimatePresence>
                        </MotionDiv>
                    )}
                </>
            )}
        </div>
    );
}
