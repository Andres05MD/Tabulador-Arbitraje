'use client';

import { useMemo } from 'react';
import { useDollarRate } from '@/hooks/useDollarRate';

interface PriceDisplayProps {
    usdAmount: number;
    showBoth?: boolean;
    className?: string;
}

export default function PriceDisplay({ usdAmount, showBoth = false, className = '' }: PriceDisplayProps) {
    const { rate, loading, convertToBs, formatCurrency } = useDollarRate();

    // Memoizar cálculos para evitar recalcular en cada render
    const formattedUsd = useMemo(() =>
        formatCurrency(usdAmount, 'USD'),
        [usdAmount, formatCurrency]
    );

    const bsAmount = useMemo(() =>
        convertToBs(usdAmount),
        [usdAmount, convertToBs]
    );

    const formattedBs = useMemo(() =>
        formatCurrency(bsAmount, 'Bs'),
        [bsAmount, formatCurrency]
    );

    if (loading) {
        return <span className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>Cargando...</span>;
    }

    if (showBoth) {
        return (
            <div className={className}>
                <div className="font-bold text-gray-800 dark:text-gray-100">{formattedUsd}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{formattedBs}</div>
            </div>
        );
    }

    return (
        <div className={className}>
            <div className="font-bold text-gray-800 dark:text-gray-100">{formattedUsd}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{formattedBs}</div>
        </div>
    );
}
