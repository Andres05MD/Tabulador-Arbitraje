'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Court } from '@/src/types';
import { useRouter, usePathname } from 'next/navigation';

interface CourtContextType {
    selectedCourt: Court | null;
    selectCourt: (court: Court) => void;
    clearCourt: () => void;
    loading: boolean;
}

const CourtContext = createContext<CourtContextType>({
    selectedCourt: null,
    selectCourt: () => { },
    clearCourt: () => { },
    loading: true,
});

const PUBLIC_ROUTES = ['/login', '/register', '/seleccionar-cancha'];

export function CourtProvider({ children }: { children: React.ReactNode }) {
    const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Cargar cancha del localStorage al iniciar
        const storedCourt = localStorage.getItem('selectedCourt');
        if (storedCourt) {
            try {
                setSelectedCourt(JSON.parse(storedCourt));
            } catch (e) {
                console.error('Error parsing stored court', e);
                localStorage.removeItem('selectedCourt');
            }
        }
        setLoading(false);
    }, []);

    const selectCourt = (court: Court) => {
        setSelectedCourt(court);
        localStorage.setItem('selectedCourt', JSON.stringify(court));
        router.push('/juegos');
    };

    const clearCourt = () => {
        setSelectedCourt(null);
        localStorage.removeItem('selectedCourt');
        router.push('/seleccionar-cancha');
    };

    useEffect(() => {
        if (!loading) {
            // Si no hay cancha seleccionada y no estamos en una ruta pública, redirigir
            if (!selectedCourt && !PUBLIC_ROUTES.includes(pathname)) {
                router.push('/seleccionar-cancha');
            }
        }
    }, [selectedCourt, loading, pathname, router]);

    return (
        <CourtContext.Provider value={{ selectedCourt, selectCourt, clearCourt, loading }}>
            {children}
        </CourtContext.Provider>
    );
}

export function useCourt() {
    const context = useContext(CourtContext);
    if (context === undefined) {
        throw new Error('useCourt must be used within CourtProvider');
    }
    return context;
}
