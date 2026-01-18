'use client';

import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { UserRole } from '../types';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
    redirectPath?: string;
}

export default function RoleGuard({ children, allowedRoles, redirectPath = '/login' }: RoleGuardProps) {
    const { user, role, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            // Caso 1: No logueado (o anónimo si la ruta requiere auth estricto)
            // Asumimos que si allowedRoles no incluye 'user', entonces requiere una cuenta 'registrada' (admin/coordinador)
            // Ojo: 'user' en este sistema es básicamente "anónimo" por ahora, a menos que cambiemos la lógica.
            // Los roles privilegiados son 'admin' y 'coordinador'.

            const isPrivileged = user && !user.isAnonymous && role && allowedRoles.includes(role);
            const isGuestAllowed = user && user.isAnonymous && allowedRoles.includes('user');

            if (!isPrivileged && !isGuestAllowed) {
                // router.push(redirectPath);
            }
        }
    }, [user, role, loading, allowedRoles, redirectPath, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-900">
                <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Comprobación de renderizado
    // Si es usuario privilegiado y tiene rol permitido: OK
    if (user && !user.isAnonymous && role && allowedRoles.includes(role)) {
        return <>{children}</>;
    }

    // Si es invitado/user anónimo y está permitido: OK
    if (user && user.isAnonymous && allowedRoles.includes('user')) {
        return <>{children}</>;
    }

    // Si falló:
    // Retornamos null mientras el useEffect redirige, o un mensaje de error si preferimos.
    // Para UX, mejor retornamos null y dejamos que el useEffect maneje la redirección (aunque puede haber un flash).
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Acceso Restringido</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">No tienes permisos para ver esta sección.</p>
            <button
                onClick={() => router.push(redirectPath)}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
                Volver
            </button>
        </div>
    );
}
