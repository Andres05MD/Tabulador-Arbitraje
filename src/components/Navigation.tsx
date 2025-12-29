'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import ThemeToggle from './ThemeToggle';
import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { logoutUser } from '@/src/lib/authService';

export default function Navigation() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { name: 'Categorías', href: '/categorias' },
        { name: 'Juegos', href: '/juegos' },
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

    return (
        <nav className="sticky top-0 z-50 glass-card mb-8">
            <div className="page-container">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/categorias" className="flex items-center space-x-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                            <svg
                                className="w-6 h-6 text-white"
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
                        <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 bg-clip-text text-transparent">
                            Tabulador Arbitraje
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${isActive(item.href)
                                    ? 'bg-primary-500 text-white shadow-lg'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side - User Info & Theme Toggle */}
                    <div className="flex items-center space-x-4">
                        {!loading && (
                            <>
                                {user ? (
                                    <div className="hidden md:flex items-center space-x-3">
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {user.displayName || 'Usuario'}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {user.email}
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                ) : (
                                    <div className="hidden md:flex items-center space-x-2">
                                        <Link
                                            href="/login"
                                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                                        >
                                            Iniciar Sesión
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors shadow-lg"
                                        >
                                            Registrarse
                                        </Link>
                                    </div>
                                )}
                            </>
                        )}

                        <ThemeToggle />

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/50 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-300"
                            aria-label="Menú"
                        >
                            <svg
                                className="w-6 h-6 text-gray-700 dark:text-gray-200"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {mobileMenuOpen ? (
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
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 space-y-2 animate-slide-down">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-4 py-3 rounded-lg font-medium transition-all duration-300 ${isActive(item.href)
                                    ? 'bg-primary-500 text-white shadow-lg'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}

                        {/* Mobile Auth Buttons */}
                        {!loading && (
                            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                {user ? (
                                    <>
                                        <div className="px-4 py-2 text-sm">
                                            <p className="font-medium text-gray-700 dark:text-gray-300">
                                                {user.displayName || 'Usuario'}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {user.email}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setMobileMenuOpen(false);
                                                handleLogout();
                                            }}
                                            className="w-full mt-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                                        >
                                            Iniciar Sesión
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block px-4 py-3 text-center font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors shadow-lg mt-2"
                                        >
                                            Registrarse
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
