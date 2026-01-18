'use client';

import { useRouter } from 'next/navigation';
import { MotionButton } from './motion';

interface BackButtonProps {
    className?: string;
    label?: string;
    href?: string;
}

export default function BackButton({ className, label = 'Regresar', href }: BackButtonProps) {
    const router = useRouter();

    const handleBack = () => {
        if (href) {
            router.push(href);
        } else {
            router.back();
        }
    };

    return (
        <MotionButton
            onClick={handleBack}
            className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-xl
                bg-white/40 dark:bg-slate-800/40 backdrop-blur-md
                border border-white/50 dark:border-slate-700/50
                text-slate-600 dark:text-slate-300
                hover:text-primary-600 dark:hover:text-primary-400
                hover:border-primary-500/30 dark:hover:border-primary-500/30
                hover:shadow-lg hover:shadow-primary-500/10
                transition-all duration-300 group
                ${className}
            `}
        >
            <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/10 rounded-full scale-0 group-hover:scale-150 transition-all duration-300" />
                <svg
                    className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform relative z-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </div>
            <span className="text-sm font-bold tracking-tight relative z-10 hidden md:inline-block">{label}</span>
        </MotionButton>
    );
}
