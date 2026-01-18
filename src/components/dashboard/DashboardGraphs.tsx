import { useMemo } from 'react';
import { MotionDiv } from '../ui/motion';

interface DashboardGraphsProps {
    dailyIncome: { date: string; amount: number }[];
    categoryDistribution: { name: string; count: number }[];
}

export default function DashboardGraphs({ dailyIncome, categoryDistribution }: DashboardGraphsProps) {
    // Calcular altura máxima para normalizar barras
    const maxIncome = Math.max(...dailyIncome.map(d => d.amount), 1);

    // Total de juegos para porcentaje
    const totalGames = categoryDistribution.reduce((sum, item) => sum + item.count, 0);

    return (
        <div className="grid lg:grid-cols-2 gap-6">
            {/* Gráfico de Barras: Ingresos Semanales */}
            <MotionDiv
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6"
            >
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Ingresos (Últimos 7 días)
                </h3>

                <div className="h-64 flex items-end justify-between gap-2">
                    {dailyIncome.map((day, index) => {
                        const heightPercentage = (day.amount / maxIncome) * 100;
                        return (
                            <div key={index} className="flex flex-col items-center flex-1 group relative">
                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap pointer-events-none z-20">
                                    ${day.amount.toFixed(2)}
                                </div>

                                <div className="w-full bg-slate-100 dark:bg-slate-700/30 rounded-t-lg relative h-full flex items-end overflow-hidden">
                                    <div
                                        style={{ height: `${heightPercentage}%` }}
                                        className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all duration-1000 ease-out opacity-80 group-hover:opacity-100 relative"
                                    >
                                        {/* Brillo superior */}
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-white/30"></div>
                                    </div>
                                </div>

                                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-medium truncate w-full text-center">
                                    {day.date}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </MotionDiv>

            {/* Gráfico Circular: Distribución por Categoría */}
            <MotionDiv
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6"
            >
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                    Juegos por Categoría
                </h3>

                <div className="space-y-4">
                    {categoryDistribution.map((category, index) => {
                        const percentage = totalGames > 0 ? (category.count / totalGames) * 100 : 0;
                        const colors = [
                            'bg-blue-500', 'bg-purple-500', 'bg-pink-500',
                            'bg-orange-500', 'bg-cyan-500', 'bg-indigo-500'
                        ];
                        const color = colors[index % colors.length];

                        return (
                            <div key={index} className="relative">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-slate-700 dark:text-slate-300">{category.name}</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{category.count} <span className="text-slate-500 text-xs font-normal">({percentage.toFixed(0)}%)</span></span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        style={{ width: `${percentage}%` }}
                                        className={`h-2.5 rounded-full ${color} transition-all duration-1000 ease-out`}
                                    ></div>
                                </div>
                            </div>
                        )
                    })}

                    {categoryDistribution.length === 0 && (
                        <div className="text-center py-10 text-slate-500">
                            No hay datos para mostrar
                        </div>
                    )}
                </div>
            </MotionDiv>
        </div>
    );
}
