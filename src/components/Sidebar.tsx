'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import ThemeToggle from './ThemeToggle';
import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { logoutUser } from '@/src/lib/authService';

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
            name: 'Juegos',
            href: '/juegos',
            icon: (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
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
                className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl glass-card shadow-lg hover:shadow-xl transition-all duration-300"
                aria-label="Toggle Menu"
            >
                <svg
                    className="w-6 h-6 text-gray-700 dark:text-gray-200"
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
                    className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 h-screen w-72 z-40
                    glass-card border-r border-gray-200/20 dark:border-gray-700/50
                    flex flex-col
                    transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Logo Section */}
                <div className="p-6 border-b border-gray-200/20 dark:border-gray-700/50">
                    <Link href="/categorias" className="flex items-center space-x-3 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
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
                            <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 bg-clip-text text-transparent">
                                Tabulador
                            </h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Arbitraje</p>
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
                                flex items-center space-x-3 px-4 py-3 rounded-xl
                                font-medium transition-all duration-300
                                ${isActive(item.href)
                                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/30'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'
                                }
                            `}
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {item.icon}
                            </svg>
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                {/* User Section & Theme Toggle */}
                <div className="p-4 border-t border-gray-200/20 dark:border-gray-700/50 space-y-4">
                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between px-4 py-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Tema
                        </span>
                        <ThemeToggle />
                    </div>

                    {/* User Info */}
                    {!loading && user && (
                        <div className="space-y-3">
                            <div className="px-4 py-3 rounded-xl bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 border border-gray-200/20 dark:border-gray-700/50">
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                                    {user.displayName || 'Usuario'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {user.email}
                                </p>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl
                                    bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700
                                    text-white font-medium shadow-lg shadow-red-500/30
                                    transition-all duration-300 hover:shadow-xl"
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
                                    bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300
                                    font-medium hover:bg-white/70 dark:hover:bg-gray-700/70
                                    transition-all duration-300"
                            >
                                Iniciar Sesión
                            </Link>
                            <Link
                                href="/register"
                                className="block w-full px-4 py-3 text-center rounded-xl
                                    bg-gradient-to-r from-primary-500 to-secondary-500
                                    text-white font-medium shadow-lg shadow-primary-500/30
                                    hover:shadow-xl transition-all duration-300"
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
