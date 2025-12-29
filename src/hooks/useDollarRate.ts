'use client';

import { useEffect, useState } from 'react';

interface DollarRateData {
    fuente: string;
    nombre: string;
    compra: number | null;
    venta: number | null;
    promedio: number;
    fechaActualizacion: string;
}

interface CachedDollarRate {
    rate: number;
    timestamp: number;
}

const CACHE_KEY = 'dollar_rate_cache';
const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 horas en milisegundos
const API_URL = 'https://ve.dolarapi.com/v1/dolares/oficial';

export function useDollarRate() {
    const [rate, setRate] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    useEffect(() => {
        const fetchRate = async () => {
            try {
                // Intentar obtener del caché primero
                const cached = getCachedRate();
                if (cached) {
                    setRate(cached.rate);
                    setLastUpdate(new Date(cached.timestamp));
                    setLoading(false);
                    return;
                }

                // Si no hay caché válido, hacer petición a la API
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error('Error al obtener la tasa del dólar');
                }

                const data: DollarRateData = await response.json();
                const newRate = data.promedio;

                // Guardar en caché
                saveToCache(newRate);
                setRate(newRate);
                setLastUpdate(new Date(data.fechaActualizacion));
                setError(null);
            } catch (err) {
                console.error('Error fetching dollar rate:', err);
                setError(err instanceof Error ? err.message : 'Error desconocido');

                // Si hay error, intentar usar un caché expirado como fallback
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    const parsedCache: CachedDollarRate = JSON.parse(cached);
                    setRate(parsedCache.rate);
                    setLastUpdate(new Date(parsedCache.timestamp));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRate();
    }, []);

    return { rate, loading, error, lastUpdate };
}

// Función para obtener la tasa del caché si es válida
function getCachedRate(): CachedDollarRate | null {
    if (typeof window === 'undefined') return null;

    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const parsedCache: CachedDollarRate = JSON.parse(cached);
        const now = Date.now();
        const cacheAge = now - parsedCache.timestamp;

        // Si el caché tiene menos de 4 horas, usarlo
        if (cacheAge < CACHE_DURATION) {
            return parsedCache;
        }

        // Caché expirado
        return null;
    } catch (error) {
        console.error('Error reading cache:', error);
        return null;
    }
}

// Función para guardar en caché
function saveToCache(rate: number): void {
    if (typeof window === 'undefined') return;

    try {
        const cacheData: CachedDollarRate = {
            rate,
            timestamp: Date.now(),
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
        console.error('Error saving to cache:', error);
    }
}

// Función utilitaria para convertir USD a Bs
export function convertToBs(usdAmount: number, rate: number | null): number {
    if (!rate) return 0;
    return usdAmount * rate;
}

// Función utilitaria para formatear moneda
export function formatCurrency(amount: number, currency: 'USD' | 'Bs'): string {
    if (currency === 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    } else {
        return new Intl.NumberFormat('es-VE', {
            style: 'currency',
            currency: 'VES',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    }
}
