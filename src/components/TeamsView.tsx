'use client';

import type { Game } from '@/types';
import PriceDisplay from './PriceDisplay';

interface TeamSummary {
    teamName: string;
    gamesCount: number;
    totalCost: number;
    games: Game[];
}

interface TeamsViewProps {
    games: Game[];
    onEditGame: (game: Game) => void;
    onDeleteGame: (game: Game) => void;
    onTogglePayment: (game: Game, team: 'A' | 'B') => void;
}

export default function TeamsView({ games, onEditGame, onDeleteGame, onTogglePayment }: TeamsViewProps) {
    // Agrupar juegos por equipo
    const teamsSummary = games.reduce((acc, game) => {
        // Procesar Equipo A
        if (!acc[game.teamA]) {
            acc[game.teamA] = {
                teamName: game.teamA,
                gamesCount: 0,
                totalCost: 0,
                games: [],
            };
        }
        acc[game.teamA].gamesCount++;
        acc[game.teamA].totalCost += game.totalCost / 2; // Mitad del costo por equipo
        acc[game.teamA].games.push(game);

        // Procesar Equipo B
        if (!acc[game.teamB]) {
            acc[game.teamB] = {
                teamName: game.teamB,
                gamesCount: 0,
                totalCost: 0,
                games: [],
            };
        }
        acc[game.teamB].gamesCount++;
        acc[game.teamB].totalCost += game.totalCost / 2; // Mitad del costo por equipo
        acc[game.teamB].games.push(game);

        return acc;
    }, {} as Record<string, TeamSummary>);

    const teamsArray = Object.values(teamsSummary).sort((a, b) => b.gamesCount - a.gamesCount);

    if (teamsArray.length === 0) {
        return (
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    No hay equipos para mostrar
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                    Los equipos aparecerán aquí una vez que registres juegos
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {teamsArray.map((team) => (
                <div key={team.teamName} className="glass-card p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                                {team.teamName}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {team.gamesCount} {team.gamesCount === 1 ? 'juego' : 'juegos'}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Costo de arbitraje:</p>
                            <PriceDisplay usdAmount={team.totalCost} showBoth={true} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        {team.games.map((game) => {
                            const isTeamA = game.teamA === team.teamName;
                            const opponent = isTeamA ? game.teamB : game.teamA;
                            const isPaid = isTeamA ? game.isPaidTeamA : game.isPaidTeamB;

                            return (
                                <div
                                    key={game.id}
                                    className="p-3 rounded-lg bg-white/30 dark:bg-gray-800/30 border border-gray-200/30 dark:border-gray-700/30 flex justify-between items-center"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded">
                                                {game.categoryName}
                                            </span>
                                            {game.status && game.status !== 'pending' && (
                                                <span
                                                    className={`px-2 py-0.5 text-xs font-medium rounded ${game.status === 'completed'
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                                        }`}
                                                >
                                                    {game.status === 'completed' ? 'Completado' : 'Cancelado'}
                                                </span>
                                            )}
                                            {game.courtName && (
                                                <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-blue-950/30 text-blue-400 border border-blue-500/30 rounded-full tracking-wider">
                                                    {game.courtName}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => onTogglePayment(game, isTeamA ? 'A' : 'B')}
                                                title={isPaid ? "PAGADO" : "Marcar como PAGADO"}
                                                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${isPaid
                                                    ? 'bg-green-500 text-white shadow-sm'
                                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-600'
                                                    }`}
                                            >
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </button>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                vs <strong>{opponent}</strong>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onEditGame(game)}
                                            className="p-1.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                            title="Editar"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => onDeleteGame(game)}
                                            className="p-1.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                            title="Eliminar"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
