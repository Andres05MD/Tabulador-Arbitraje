'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNavigation } from '@/hooks/useNavigation';

export default function BottomNav() {
    const { navigation } = useNavigation();
    const pathname = usePathname();

    if (navigation.length === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2">
            <nav className="relative mx-auto max-w-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 shadow-2xl rounded-2xl">
                <div className="flex justify-around items-center h-16 px-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                                    relative flex flex-col items-center justify-center w-full h-full
                                    transition-all duration-300 ease-out p-1
                                    ${isActive
                                        ? 'text-primary-600 dark:text-primary-400'
                                        : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}
                                `}
                            >
                                {/* Active Indicator Dot */}
                                {isActive && (
                                    <span className="absolute -top-1 w-1 h-1 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(14,165,233,0.6)]" />
                                )}

                                {/* Icon with subtle scaling */}
                                <div className={`transform transition-transform duration-300 ${isActive ? 'scale-110 -translate-y-0.5' : ''}`}>
                                    {item.icon("w-6 h-6")}
                                </div>

                                {/* Label (optional, hidden on very small screens if tight) */}
                                <span className={`text-[10px] font-bold mt-1 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
