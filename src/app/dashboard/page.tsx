'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/components/AuthProvider';
import { useCourt } from '@/components/CourtProvider';
import { subscribeToGames } from '@/lib/gameService';
import { subscribeToCategories } from '@/lib/categoryService';
import type { Game, Category } from '@/types';
import StatsCard from '@/components/dashboard/StatsCard';
import DashboardGraphs from '@/components/dashboard/DashboardGraphs';
import { useDollarRate } from '@/hooks/useDollarRate';
import RoleGuard from '@/components/RoleGuard';
import BackButton from '@/components/ui/BackButton';

export default function DashboardPage() {
    const { user, role, loading: authLoading } = useAuth();
    const { selectedCourt } = useCourt();
    const router = useRouter();
    const { rate } = useDollarRate();

    const [games, setGames] = useState<Game[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Cargar datos
    useEffect(() => {
        if (!user || !selectedCourt || role !== 'admin') return;

        setLoading(true);

        // 1. Cargar Categorías
        const unsubCategories = subscribeToCategories(null, setCategories);

        // 2. Cargar Juegos (Últimos 7 días para gráficas)
        const unsubGames = subscribeToGames(
            selectedCourt.id,
            { ownerId: null },
            (data) => {
                setGames(data);
                setLoading(false);
            }
        );

        return () => {
            unsubCategories();
            unsubGames();
        };
    }, [user, selectedCourt, role]);

    // Calcular Estadísticas
    const stats = useMemo(() => {
        const today = new Date();
        const gamesToday = games.filter(g => isSameDay(g.date.toDate(), today));

        const totalGamesToday = gamesToday.length;
        const pendingGames = gamesToday.filter(g => (!g.status || g.status === 'pending')).length;
        const completedGames = gamesToday.filter(g => g.status === 'completed').length;

        const revenueToday = gamesToday.reduce((sum, g) => sum + g.totalCost, 0);

        // Ingresos últimos 7 días
        const dailyIncome = Array.from({ length: 7 }).map((_, i) => {
            const d = subDays(today, 6 - i);
            const dayGames = games.filter(g => isSameDay(g.date.toDate(), d));
            const amount = dayGames.reduce((sum, g) => sum + g.totalCost, 0);
            return {
                date: format(d, 'EEE', { locale: es }),
                amount
            };
        });

        // Distribución por Categoría
        const categoryDist = categories.map(cat => {
            const count = games.filter(g => g.categoryId === cat.id).length;
            return { name: cat.name, count };
        }).filter(c => c.count > 0).sort((a, b) => b.count - a.count);

        return {
            totalGamesToday,
            pendingGames,
            completedGames,
            revenueToday,
            dailyIncome,
            categoryDist
        };
    }, [games, categories]);

    return (
        <RoleGuard allowedRoles={['admin']}>
            {loading || authLoading ? (
                <div className="page-container flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500"></div>
                </div>
            ) : (
                <div className="page-container">
                    <div className="flex flex-row md:flex-row justify-between items-center mb-8 gap-4">
                        <div>
                            <h1 className="page-title mb-2">Panel Admin</h1>
                            <p className="text-slate-500 dark:text-slate-400 hidden md:block">
                                Resumen general de {selectedCourt?.name}
                            </p>
                        </div>
                        <BackButton href="/juegos" className="md:order-last md:self-auto !mb-0" />
                    </div>

                    {/* Tarjetas de Resumen */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatsCard
                            title="Juegos Hoy"
                            value={stats.totalGamesToday.toString()}
                            icon={
                                <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                            colorClass="bg-blue-500"
                        />

                        <StatsCard
                            title="Ingresos Hoy (USD)"
                            value={`$${stats.revenueToday.toLocaleString()}`}
                            icon={
                                <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                            trend={rate ? { value: 0, label: `≈ Bs. ${(stats.revenueToday * rate).toLocaleString()}`, isPositive: true } : undefined}
                            colorClass="bg-emerald-500"
                        />

                        <StatsCard
                            title="Pendientes"
                            value={stats.pendingGames.toString()}
                            icon={
                                <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                            colorClass="bg-orange-500"
                        />

                        <StatsCard
                            title="Completados"
                            value={stats.completedGames.toString()}
                            icon={
                                <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                            colorClass="bg-purple-500"
                        />
                    </div>

                    {/* Gráficos */}
                    <DashboardGraphs
                        dailyIncome={stats.dailyIncome}
                        categoryDistribution={stats.categoryDist}
                    />
                </div>
            )}
        </RoleGuard>
    );
}
