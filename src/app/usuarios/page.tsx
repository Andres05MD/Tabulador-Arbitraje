'use client';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '@/components/AuthProvider';
import { getAllUsers, updateUserRole } from '@/lib/authService';
import type { UserProfile, UserRole } from '@/types';
import RoleGuard from '@/components/RoleGuard';
import { MotionDiv, GlassCard, staggerContainer } from '@/components/ui/motion';
import BackButton from '@/components/ui/BackButton';

export default function UsuariosPage() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUsers = async () => {
            const data = await getAllUsers();
            setUsers(data);
            setLoading(false);
        };
        loadUsers();
    }, []);

    const handleRoleChange = async (uid: string, newRole: UserRole, currentRole: UserRole) => {
        if (uid === currentUser?.uid) {
            Swal.fire({
                title: 'Acción no permitida',
                text: 'No puedes cambiar tu propio rol por seguridad.',
                icon: 'error',
                confirmButtonColor: '#0ea5e9',
            });
            return;
        }

        const result = await Swal.fire({
            title: '¿Cambiar rol?',
            text: `¿Deseas cambiar el rol de ${currentRole} a ${newRole}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, cambiar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#0ea5e9',
            cancelButtonColor: '#6b7280',
        });

        if (result.isConfirmed) {
            try {
                await updateUserRole(uid, newRole);
                setUsers(users.map(u => u.uid === uid ? { ...u, role: newRole } : u));
                Swal.fire({
                    title: '¡Actualizado!',
                    text: 'El rol del usuario ha sido actualizado.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                });
            } catch (error) {
                console.error('Error actualizando rol:', error);
                Swal.fire('Error', 'No se pudo actualizar el rol.', 'error');
            }
        }
    };

    return (
        <RoleGuard allowedRoles={['admin']}>
            <div className="page-container">
                <div className="flex flex-row md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="page-title mb-0 md:mb-2">Usuarios</h1>
                        <p className="text-slate-500 dark:text-slate-400 hidden md:block">
                            Administra los roles y accesos de los usuarios.
                        </p>
                    </div>
                    <BackButton className="md:order-last md:self-auto !mb-0" />
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                    </div>
                ) : (
                    <MotionDiv
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="grid gap-6"
                    >
                        {users.map((user) => (
                            <GlassCard
                                key={user.uid}
                                className="flex flex-col md:flex-row items-center justify-between p-6 hover:translate-y-[-4px] transition-all duration-300 shadow-xl shadow-slate-200/50 dark:shadow-none"
                            >
                                <div className="flex items-center gap-5 mb-6 md:mb-0 w-full md:w-auto">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-primary-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity" />
                                        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center text-primary-600 dark:text-primary-400 font-extrabold text-2xl border border-white/50 dark:border-slate-700 shadow-inner">
                                            {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                            {user.displayName || 'Sin nombre'}
                                            {user.uid === currentUser?.uid && (
                                                <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">Tú</span>
                                            )}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                            {user.email}
                                        </p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${user.role === 'admin'
                                                ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                                                user.role === 'coordinador'
                                                    ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                                                    'bg-slate-500/10 text-slate-600 border-slate-500/20'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
                                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                        Asignar Nuevo Rol
                                    </span>

                                    <div className="flex bg-slate-200/50 dark:bg-slate-900/50 backdrop-blur-sm p-1.5 rounded-2xl border border-white/20 dark:border-slate-800/50 shadow-inner w-full md:w-auto">
                                        {(['admin', 'coordinador', 'user'] as UserRole[]).map((roleOption) => (
                                            <button
                                                key={roleOption}
                                                onClick={() => handleRoleChange(user.uid, roleOption, user.role)}
                                                className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-black transition-all duration-300 ${user.role === roleOption
                                                    ? 'bg-white dark:bg-primary-600 shadow-xl text-primary-600 dark:text-white scale-105'
                                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                                    }`}
                                            >
                                                {roleOption === 'admin' ? 'ADMIN' : roleOption === 'coordinador' ? 'COORD' : 'USER'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </MotionDiv>
                )}
            </div>
        </RoleGuard>
    );
}
