'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCourts } from '@/lib/courtService';
import type { Court } from '@/types';

export default function RefereeSelectionPage() {
    const [courts, setCourts] = useState<Court[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getCourts();
                setCourts(data);
            } catch (error) {
                console.error('Error cargando canchas:', error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500/10 mb-4 ring-1 ring-primary-500/30">
                        <svg className="w-8 h-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        Acceso Arbitral
                    </h1>
                    <p className="text-slate-400 text-sm">
                        Selecciona tu sede para comenzar a gestionar juegos.
                    </p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
                    {loading ? (
                        <div className="p-8 text-center text-slate-500">
                            <div className="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                            Cargando sedes disponibles...
                        </div>
                    ) : courts.length > 0 ? (
                        <div className="divide-y divide-slate-700/50">
                            {courts.map((court) => (
                                <Link
                                    key={court.id}
                                    href={`/arbitro/${court.id}`}
                                    className="flex items-center justify-between p-4 hover:bg-slate-700/50 transition-colors group cursor-pointer"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-slate-200 group-hover:text-primary-400 transition-colors">
                                            {court.name}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            Tocar para ingresar
                                        </span>
                                    </div>
                                    <svg
                                        className="w-5 h-5 text-slate-600 group-hover:text-primary-400 transform group-hover:translate-x-1 transition-all"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <p className="text-slate-400 mb-4">No hay canchas registradas.</p>
                        </div>
                    )}
                </div>

                <div className="text-center">
                    <Link href="/login" className="text-xs text-slate-500 hover:text-white transition-colors">
                        ¿Eres Coordinador? Inicia Sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}
