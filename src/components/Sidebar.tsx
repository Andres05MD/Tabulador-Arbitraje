'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { logoutUser } from '@/src/lib/authService';

import { useDollarRate } from '@/src/hooks/useDollarRate';

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
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        {
            name: 'Categorías',
            href: '/categorias',
            icon: (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
            )
        },
        {
            name: 'Lista de Juegos',
            href: '/juegos',
            icon: (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
            )
        },
        {
            name: 'Cargar Juego',
            href: '/juegos/cargar',
            icon: (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            )
        },
    ];

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
        <>
            {/* Mobile Menu Button - Fixed Top Right */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 transition-all duration-300"
                aria-label="Toggle Menu"
            >
                <svg
                    className="w-6 h-6 text-slate-700 dark:text-slate-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    {sidebarOpen ? (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    ) : (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    )}
                </svg>
            </button>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 animate-fade-in"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 h-screen w-72 z-40
                    bg-white dark:bg-slate-900 
                    border-r border-slate-200 dark:border-slate-700/50
                    flex flex-col
                    transition-transform duration-300 ease-in-out
                    shadow-xl
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Logo Section */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <Link href="/categorias" className="flex items-center space-x-3 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary-500/30">
                            <svg
                                className="w-7 h-7 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                                Tabulador
                            </h1>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Arbitraje</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
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
                                {item.icon}
                            </svg>
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                {/* User Section & Theme Toggle */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-4">

                    {/* Dollar Reference Component */}
                    <DollarReference />



                    {/* User Info */}
                    {!loading && user && (
                        <div className="space-y-3">
                            <div className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border-2 border-slate-300 dark:border-slate-700">
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-200 truncate">
                                    {user.displayName || 'Usuario'}
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
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                                <span>Cerrar Sesión</span>
                            </button>
                        </div>
                    )}

                    {!loading && !user && (
                        <div className="space-y-2">
                            <Link
                                href="/login"
                                className="block w-full px-4 py-3 text-center rounded-xl
                                    bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300
                                    font-bold hover:bg-slate-200 dark:hover:bg-slate-700
                                    border-2 border-slate-400 dark:border-slate-600
                                    transition-all duration-300 shadow-md"
                            >
                                Iniciar Sesión
                            </Link>
                            <Link
                                href="/register"
                                className="block w-full px-4 py-3 text-center rounded-xl
                                    bg-primary-600 text-white font-bold shadow-lg shadow-primary-500/30
                                    hover:bg-primary-700 transform hover:scale-[1.02] transition-all duration-300"
                            >
                                Registrarse
                            </Link>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}
