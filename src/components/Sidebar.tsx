'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

import { useAuth } from './AuthProvider';
import { useCourt } from './CourtProvider';
import { logoutUser } from '@/lib/authService';
import { useNavigation } from '@/hooks/useNavigation';
import { useDollarRate } from '@/hooks/useDollarRate';
import { usePathname } from 'next/navigation';

function DollarReference() {
    const { rate, loading, error, formatCurrency } = useDollarRate();

    if (loading) return <div className="px-4 py-2 text-xs text-slate-500 animate-pulse text-center">Cargando tasa...</div>;
    if (error || !rate) return null;

    return (
        <div className="mx-4 mb-4 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-2 border-emerald-300 dark:border-emerald-800/40 shadow-md">
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></div>
                    <span className="text-xs font-bold uppercase text-emerald-800 dark:text-emerald-400 tracking-wider">Tasa BCV</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-500 bg-emerald-200 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded">USD</span>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-emerald-900 dark:text-emerald-100 tracking-tight">
                    {formatCurrency(rate, 'Bs')}
                </span>
            </div>
            <div className="mt-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-500/60 truncate">
                Banco Central de Venezuela
            </div>
        </div>
    );
}

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading } = useAuth();
    const { selectedCourt, clearCourt } = useCourt();
    const { navigation } = useNavigation();

    const isActive = (href: string) => pathname === href;

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: '¿Cerrar Sesión?',
            text: '¿Estás seguro de que deseas cerrar sesión?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, cerrar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#0ea5e9',
            cancelButtonColor: '#6b7280',
        });

        if (result.isConfirmed) {
            try {
                await logoutUser();
                await Swal.fire({
                    title: '¡Hasta pronto!',
                    text: 'Has cerrado sesión correctamente',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#0ea5e9',
                    timer: 2000,
                });
                router.push('/login');
            } catch (error) {
                console.error('Error logging out:', error);
                await Swal.fire({
                    title: 'Error',
                    text: 'Hubo un error al cerrar sesión',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#ef4444',
                });
            }
        }
    };

    // No mostrar sidebar en páginas de autenticación
    if (pathname === '/login' || pathname === '/register') {
        return null;
    }

    return (
        <aside
            className={`
                hidden lg:flex
                fixed top-0 left-0 h-screen w-72 z-40
                bg-white dark:bg-slate-900 
                border-r border-slate-200 dark:border-slate-700/50
                flex-col
                shadow-xl
            `}
        >
            {/* Logo Section */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <Link href="/dashboard" className="flex items-center space-x-3 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary-500/30">
                        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                            Tabulador
                        </h1>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Arbitraje</p>
                    </div>
                </Link>

                {!loading && user && !user.isAnonymous && (
                    <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50">
                        {selectedCourt ? (
                            <>
                                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">
                                    Cancha Actual
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate pr-2">
                                        {selectedCourt.name}
                                    </span>
                                    <Link
                                        href="/seleccionar-cancha"
                                        className="text-xs text-primary-500 hover:text-primary-400 font-bold hover:underline"
                                    >
                                        Cambiar
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Sin Cancha
                                </span>
                                <Link
                                    href="/seleccionar-cancha"
                                    className="text-xs text-primary-500 hover:text-primary-400 font-bold hover:underline"
                                >
                                    Seleccionar
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navigation.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`
                        flex items-center space-x-3 px-4 py-3.5 rounded-xl
                        font-bold transition-all duration-300
                        ${isActive(item.href)
                                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-sm border border-primary-100 dark:border-primary-800/30'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                            }
                    `}
                    >
                        <svg
                            className={`w-5 h-5 ${isActive(item.href) ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500'}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                        >
                            {item.icon()}
                        </svg>
                        <span>{item.name}</span>
                    </Link>
                ))}
            </nav>

            {/* User Section & Theme Toggle */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <DollarReference />

                {!loading && user && !user.isAnonymous && (
                    <div className="space-y-3">
                        <div className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border-2 border-slate-300 dark:border-slate-700">
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-200 truncate">
                                {user.displayName || 'Administrador'}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                {user.email}
                            </p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl
                                bg-white dark:bg-slate-800
                                text-red-700 dark:text-red-400 font-bold border-2 border-red-300 dark:border-red-900/40
                                hover:bg-red-50 dark:hover:bg-red-900/20
                                transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Cerrar Sesión</span>
                        </button>
                    </div>
                )}

                {!loading && user && user.isAnonymous && (
                    <div className="space-y-2">
                        <div className="px-4 py-2 mb-2 text-center">
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                Modo Invitado
                            </p>
                        </div>
                        <Link
                            href="/login"
                            className="block w-full px-4 py-3 text-center rounded-xl
                                    bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300
                                    font-bold hover:bg-slate-200 dark:hover:bg-slate-700
                                    border-2 border-slate-400 dark:border-slate-600
                                    transition-all duration-300 shadow-md"
                        >
                            Acceder
                        </Link>
                    </div>
                )}
            </div>
        </aside>
    );
}
