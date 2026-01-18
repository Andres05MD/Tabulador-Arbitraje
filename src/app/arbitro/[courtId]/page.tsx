'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Swal from 'sweetalert2';

import type { Game, Category, Court } from '@/types';
import { subscribeToGames, updateGamePaymentStatus, updateGameStatus, createGame } from '@/lib/gameService';
import { subscribeToCategories } from '@/lib/categoryService';
import { getCourts } from '@/lib/courtService';
import type { GameFormData } from '@/lib/validations';

import GameForm from '@/components/GameForm';
import { MotionDiv, MotionButton, GlassCard, staggerContainer } from '@/components/ui/motion';
import BackButton from '@/components/ui/BackButton';
import { AnimatePresence } from 'framer-motion';

export default function CourtRefereePage() {
    const params = useParams();
    const courtId = params?.courtId as string;

    const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
    const [games, setGames] = useState<Game[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [courts, setCourts] = useState<Court[]>([]);
    const [court, setCourt] = useState<Court | null>(null);
    const [loading, setLoading] = useState(true);

    // Cargar datos iniciales
    useEffect(() => {
        const loadCourt = async () => {
            try {
                const allCourts = await getCourts();
                setCourts(allCourts);
                const current = allCourts.find(c => c.id === courtId);
                if (current) setCourt(current);
            } catch (e) {
                console.error("Error cargando cancha", e);
            }
        };

        loadCourt();

        const unsubCats = subscribeToCategories(null, setCategories);

        const unsubGames = subscribeToGames(
            courtId,
            { ownerId: null, date: new Date() }, // Filtro para solo HOY y sin restriction de owner
            (data) => {
                setGames(data);
                setLoading(false);
            }
        );

        return () => {
            unsubCats();
            unsubGames();
        };
    }, [courtId]);

    const handleCreateGame = async (data: GameFormData) => {
        if (!court) return;

        try {
            const category = categories.find((cat) => cat.id === data.categoryId);
            if (!category) throw new Error('Categoría no encontrada');

            await createGame({
                ...data,
                ownerId: 'public_referee', // ID genérico para identificar origen
                courtId: court.id,
                courtName: court.name,
            }, category);

            await Swal.fire({
                title: '¡Juego Cargado!',
                icon: 'success',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
            });
            setActiveTab('list');

        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo crear el juego', 'error');
        }
    };

    const handlePaymentToggle = async (game: Game, team: 'A' | 'B') => {
        try {
            const currentStatus = team === 'A' ? game.isPaidTeamA : game.isPaidTeamB;
            const newStatus = !currentStatus;
            let paymentRef = undefined;

            // Si vamos a pagar (activar), pedimos referencia obligatoria
            if (newStatus) {
                const { value: reference, isDismissed } = await Swal.fire({
                    title: `Pago: ${team === 'A' ? game.teamA : game.teamB}`,
                    text: 'Ingresa la referencia (Bancaria, Pago Móvil o Efectivo)',
                    input: 'text',
                    inputPlaceholder: 'Ej: 123456 o Efectivo',
                    inputAttributes: {
                        autocapitalize: 'off'
                    },
                    showCancelButton: true,
                    confirmButtonText: 'Confirmar Pago',
                    cancelButtonText: 'Cancelar',
                    confirmButtonColor: '#10b981', // emerald-500
                    cancelButtonColor: '#64748b', // slate-500
                    background: '#1e293b', // slate-800
                    color: '#fff',
                    inputValidator: (value) => {
                        if (!value) {
                            return '¡Debes ingresar una referencia!';
                        }
                    }
                });

                if (isDismissed) return; // Si cancela, no hacemos nada
                paymentRef = reference;
            }

            // Actualizamos el estado
            await updateGamePaymentStatus(game.id, team, newStatus, paymentRef);

            // Feedback visual rápido
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                background: '#1e293b',
                color: '#fff'
            });

            Toast.fire({
                icon: 'success',
                title: newStatus ? 'Pago registrado' : 'Pago anulado'
            });

        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo actualizar el pago',
                icon: 'error',
                background: '#1e293b',
                color: '#fff'
            });
        }
    };

    const handleFinishGame = async (game: Game) => {
        const result = await Swal.fire({
            title: '¿Finalizar Juego?',
            text: 'Se marcará como completado y no podrás editarlo.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, Finalizar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            await updateGameStatus(game.id, 'completed');
        }
    };

    if (loading) return <div className="p-8 text-center text-white">Cargando tablero...</div>;

    return (
        <div className="min-h-screen bg-slate-900 pb-20">
            {/* Header Fijo */}
            <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-20 px-4 py-3 shadow-lg">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-lg font-bold text-white leading-tight">
                            {court?.name || 'Cancha'}
                        </h1>
                        <p className="text-xs text-slate-400">
                            {format(new Date(), "d 'de' MMMM", { locale: es })}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mt-3 bg-slate-900/50 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'list'
                            ? 'bg-primary-600 text-white shadow'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Juegos ({games.filter(g => g.status !== 'completed' && g.status !== 'cancelled').length})
                    </button>
                    <button
                        onClick={() => setActiveTab('create')}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'create'
                            ? 'bg-primary-600 text-white shadow'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        + Nuevo
                    </button>
                </div>
            </div>

            {/* Contenido */}
            <div className="p-4">
                <div className="flex justify-end mb-4">
                    <BackButton href="/arbitro" className="!text-slate-200 !mb-0" />
                </div>
                {activeTab === 'create' ? (
                    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 animate-fade-in">
                        <h2 className="text-white font-bold mb-4">Cargar Nuevo Juego</h2>
                        <GameForm
                            categories={categories}
                            courts={courts}
                            onSubmit={handleCreateGame}
                            onCancel={() => setActiveTab('list')}
                        />
                    </div>
                ) : (
                    <MotionDiv
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4"
                    >
                        {games.length === 0 ? (
                            <div className="text-center py-10 text-slate-500">
                                <p>No hay juegos para hoy.</p>
                                <button onClick={() => setActiveTab('create')} className="text-primary-400 mt-2 underline">
                                    Cargar el primero
                                </button>
                            </div>
                        ) : (
                            games
                                .filter(g => g.status !== 'cancelled') // Ocultar cancelados para limpiar vista
                                .sort((a, b) => {
                                    // Ordenar: Pendientes/EnProgreso primero, Completados al final
                                    if (a.status === 'completed' && b.status !== 'completed') return 1;
                                    if (a.status !== 'completed' && b.status === 'completed') return -1;
                                    return 0;
                                })
                                .map(game => (
                                    <GlassCard key={game.id} className="bg-slate-800 border-slate-700">
                                        {/* Header Card */}
                                        <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
                                            <span className="text-xs font-bold text-slate-400 bg-slate-900 px-2 py-1 rounded">
                                                {game.time || '--:--'}
                                            </span>
                                            <span className="text-xs font-bold text-primary-400 uppercase">
                                                {game.categoryName}
                                            </span>
                                            {game.status === 'completed' && (
                                                <span className="text-[10px] bg-green-900 text-green-400 px-2 py-0.5 rounded-full border border-green-700">
                                                    FINALIZADO
                                                </span>
                                            )}
                                        </div>

                                        {/* Equipos y Pagos */}
                                        <div className="space-y-4">
                                            {/* Equipo A */}
                                            <div className="flex items-center justify-between bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                                                <span className="font-bold text-white text-lg truncate w-1/2">
                                                    {game.teamA}
                                                </span>
                                                <button
                                                    onClick={() => handlePaymentToggle(game, 'A')}
                                                    disabled={game.status === 'completed'}
                                                    className={`
                                                    px-4 py-2 rounded-lg font-bold text-xs transition-all
                                                    ${game.isPaidTeamA
                                                            ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                                                            : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}
                                                    ${game.status === 'completed' ? 'opacity-50 cursor-not-allowed' : ''}
                                                `}
                                                >
                                                    {game.isPaidTeamA ? 'PAGADO' : 'COBRAR'}
                                                </button>
                                            </div>

                                            <div className="flex justify-center -my-2 opacity-50">
                                                <span className="text-[10px] text-slate-500 font-bold">VS</span>
                                            </div>

                                            {/* Equipo B */}
                                            <div className="flex items-center justify-between bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                                                <span className="font-bold text-white text-lg truncate w-1/2">
                                                    {game.teamB}
                                                </span>
                                                <button
                                                    onClick={() => handlePaymentToggle(game, 'B')}
                                                    disabled={game.status === 'completed'}
                                                    className={`
                                                    px-4 py-2 rounded-lg font-bold text-xs transition-all
                                                    ${game.isPaidTeamB
                                                            ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                                                            : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}
                                                    ${game.status === 'completed' ? 'opacity-50 cursor-not-allowed' : ''}
                                                `}
                                                >
                                                    {game.isPaidTeamB ? 'PAGADO' : 'COBRAR'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Acciones Finales */}
                                        {game.status !== 'completed' && (
                                            <div className="mt-4 pt-3 border-t border-slate-700">
                                                <button
                                                    onClick={() => handleFinishGame(game)}
                                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                                                >
                                                    FINALIZAR PARTIDO
                                                </button>
                                            </div>
                                        )}
                                    </GlassCard>
                                ))
                        )}
                    </MotionDiv>
                )}
            </div>
        </div>
    );
}
