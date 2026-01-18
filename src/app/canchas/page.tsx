'use client';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import type { Court } from '@/types';
import {
    subscribeToCourts,
    createCourt,
    updateCourt,
    deleteCourt,
} from '@/lib/courtService';
import { useAuth } from '@/components/AuthProvider';
import BackButton from '@/components/ui/BackButton';
import RoleGuard from '@/components/RoleGuard';

export default function CanchasPage() {
    const { role } = useAuth();
    const [courts, setCourts] = useState<Court[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToCourts(
            (updatedCourts) => {
                setCourts(updatedCourts);
                setLoading(false);
            },
            (err) => {
                console.error('Error loading courts:', err);
                setLoading(false);
                setError('Error al cargar las canchas.');
            }
        );

        return () => unsubscribe();
    }, []);

    const handleCreate = async () => {
        const { value: name } = await Swal.fire({
            title: 'Nueva Cancha',
            input: 'text',
            inputLabel: 'Nombre de la cancha',
            inputPlaceholder: 'Ej: Cancha Central, Polideportivo...',
            showCancelButton: true,
            confirmButtonText: 'Crear',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#0ea5e9',
            inputValidator: (value) => {
                if (!value) return '¡Debes ingresar un nombre!';
                return null;
            }
        });

        if (name) {
            try {
                setIsSaving(true);
                await createCourt(name.trim());
                await Swal.fire({
                    title: '¡Creada!',
                    text: 'La cancha se ha creado correctamente',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                });
            } catch (err) {
                console.error('Error creating court:', err);
                await Swal.fire('Error', 'No se pudo crear la cancha', 'error');
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleEdit = async (court: Court) => {
        const { value: name } = await Swal.fire({
            title: 'Editar Cancha',
            input: 'text',
            inputLabel: 'Nombre de la cancha',
            inputValue: court.name,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#0ea5e9',
            inputValidator: (value) => {
                if (!value) return '¡Debes ingresar un nombre!';
                return null;
            }
        });

        if (name && name !== court.name) {
            try {
                setIsSaving(true);
                await updateCourt(court.id, name.trim());
                await Swal.fire({
                    title: '¡Actualizada!',
                    text: 'La cancha se ha actualizado correctamente',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                });
            } catch (err) {
                console.error('Error updating court:', err);
                await Swal.fire('Error', 'No se pudo actualizar la cancha', 'error');
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleDelete = async (court: Court) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas eliminar la cancha "${court.name}"? Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
        });

        if (result.isConfirmed) {
            try {
                setIsSaving(true);
                await deleteCourt(court.id);
                await Swal.fire({
                    title: '¡Eliminada!',
                    text: 'La cancha se ha eliminado correctamente',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                });
            } catch (err) {
                console.error('Error deleting court:', err);
                await Swal.fire('Error', 'No se pudo eliminar la cancha', 'error');
            } finally {
                setIsSaving(false);
            }
        }
    };

    if (loading) {
        return (
            <div className="page-container flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <RoleGuard allowedRoles={['admin', 'coordinador']}>
            <div className="page-container">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 mt-6 sm:mt-0">
                    <div>
                        <h1 className="page-title mb-0">Gestión de Canchas</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Administra las ubicaciones donde se realizan los juegos.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                        <BackButton href="/dashboard" className="!mb-0" />
                        <button
                            onClick={handleCreate}
                            disabled={isSaving}
                            className="btn-primary w-full sm:w-auto justify-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Nueva Cancha
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-xl mb-6 flex items-center">
                        <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}

                {courts.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">No hay canchas</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">Aún no has registrado ninguna cancha para los juegos.</p>
                        <button onClick={handleCreate} className="btn-primary">Registrar Primera Cancha</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courts.map((court) => (
                            <div
                                key={court.id}
                                className="glass-card p-6 group hover:border-primary-500/50 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-primary-500 transition-colors">
                                                {court.name}
                                            </h3>
                                        </div>

                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleEdit(court)}
                                            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                            title="Editar"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(court)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                            title="Eliminar"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] uppercase tracking-wider font-bold text-slate-400">
                                    <span>Sistema de Arbitraje</span>
                                    <span className="text-primary-500/50">Activo</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </RoleGuard>
    );
}
