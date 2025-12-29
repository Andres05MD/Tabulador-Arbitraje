'use client';

import { useDollarRate, convertToBs, formatCurrency } from '@/src/hooks/useDollarRate';

interface PriceDisplayProps {
    usdAmount: number;
    showBoth?: boolean;
    className?: string;
}

export default function PriceDisplay({ usdAmount, showBoth = true, className = '' }: PriceDisplayProps) {
    const { rate, loading } = useDollarRate();

    if (loading) {
        return (
            <div className={`animate-pulse ${className}`}>
                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
            </div>
        );
    }

    const bsAmount = convertToBs(usdAmount, rate);

    return (
        <div className={className}>
            <div className="font-bold text-primary-600 dark:text-primary-400">
                {formatCurrency(usdAmount, 'USD')}
            </div>
            {showBoth && rate && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(bsAmount, 'Bs')}
                </div>
            )}
        </div>
    );
}
