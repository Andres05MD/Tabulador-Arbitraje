'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCourt } from '@/src/components/CourtProvider';
import { getCourts, createCourt } from '@/src/lib/courtService';
import type { Court } from '@/src/types';

export default function SelectCourtPage() {
    const [courts, setCourts] = useState<Court[]>([]);
    const [newCourtName, setNewCourtName] = useState('');
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const { selectCourt } = useCourt();
    const router = useRouter();

    useEffect(() => {
        loadCourts();
    }, []);

    const loadCourts = async () => {
        try {
            const data = await getCourts();
            setCourts(data);
        } catch (error) {
            console.error('Error loading courts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (court: Court) => {
        selectCourt(court);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCourtName.trim()) return;

        setCreating(true);
        try {
            const id = await createCourt(newCourtName.trim());
            const newCourt: Court = {
                id,
                name: newCourtName.trim(),
                createdAt: {} as any // Timestamp mock, will be refreshed on reload
            };
            // Select immediately
            handleSelect(newCourt);
        } catch (error) {
            console.error('Error creating court:', error);
            setCreating(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent mb-2">
                        Seleccionar Cancha
                    </h1>
                    <p className="text-gray-400">
                        Elige dónde se jugará hoy o agrega una nueva ubicación.
                    </p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
                    {loading ? (
                        <div className="text-center py-8 text-gray-400">Cargando canchas...</div>
                    ) : (
                        <div className="space-y-4">
                            {courts.length > 0 ? (
                                <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    {courts.map((court) => (
                                        <button
                                            key={court.id}
                                            onClick={() => handleSelect(court)}
                                            className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-primary-500/20 hover:border-primary-500/50 border border-white/10 transition-all duration-300 group"
                                        >
                                            <span className="font-medium text-gray-200 group-hover:text-primary-400">
                                                {court.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-gray-500 text-sm">
                                    No hay canchas registradas.
                                </div>
                            )}

                            <div className="relative border-t border-white/10 pt-4 mt-4">
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3 text-center">
                                    Nueva Cancha
                                </p>
                                <form onSubmit={handleCreate} className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Nombre de la cancha..."
                                        value={newCourtName}
                                        onChange={(e) => setNewCourtName(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                                    />
                                    <button
                                        type="submit"
                                        disabled={creating || !newCourtName.trim()}
                                        className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-blue-600 text-white font-medium hover:from-primary-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-500/20"
                                    >
                                        {creating ? 'Creando...' : 'Crear y Acceder'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
