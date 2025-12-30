'use client';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import type { Category } from '@/src/types';
import {
    subscribeToCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from '@/src/lib/categoryService';
import CategoryForm from '@/src/components/CategoryForm';
import PriceDisplay from '@/src/components/PriceDisplay';
import FirebasePermissionsError from '@/src/components/FirebasePermissionsError';
import type { CategoryFormData } from '@/src/lib/validations';

import { useAuth } from '@/src/components/AuthProvider';

export default function CategoriasPage() {
    const { user } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    useEffect(() => {
        if (!user) return;

        const unsubscribe = subscribeToCategories(
            user.uid,
            (updatedCategories) => {
                setCategories(updatedCategories);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error('Error loading categories:', err);
                setLoading(false);

                // Detectar error de permisos de Firebase
                if (err.code === 'permission-denied') {
                    setError('firebase-permissions');
                } else {
                    setError('Error al cargar las categorías. Por favor, intenta nuevamente.');
                }
            }
        );

        return () => unsubscribe();
    }, [user]);

    const handleCreate = () => {
        setEditingCategory(null);
        setShowForm(true);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setShowForm(true);
    };

    const handleSubmit = async (data: CategoryFormData) => {
        if (!user) return;

        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, data);
                await Swal.fire({
                    title: '¡Actualizado!',
                    text: 'La categoría se ha actualizado correctamente',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#0ea5e9',
                });
            } else {
                await createCategory({
                    ...data,
                    ownerId: user.uid,
                });
                await Swal.fire({
                    title: '¡Creado!',
                    text: 'La categoría se ha creado correctamente',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#0ea5e9',
                });
            }
            setShowForm(false);
            setEditingCategory(null);
        } catch (error) {
            console.error('Error saving category:', error);
            await Swal.fire({
                title: 'Error',
                text: 'Hubo un error al guardar la categoría',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#ef4444',
            });
        }
    };

    const handleDelete = async (category: Category) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            html: `¿Deseas eliminar la categoría <strong>${category.name}</strong>?<br/>Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
        });

        if (result.isConfirmed) {
            try {
                await deleteCategory(category.id);
                await Swal.fire({
                    title: '¡Eliminado!',
                    text: 'La categoría se ha eliminado correctamente',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#0ea5e9',
                });
            } catch (error) {
                console.error('Error deleting category:', error);
                await Swal.fire({
                    title: 'Error',
                    text: 'Hubo un error al eliminar la categoría',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#ef4444',
                });
            }
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingCategory(null);
    };

    // Mostrar error de permisos de Firebase
    if (error === 'firebase-permissions') {
        return (
            <div className="page-container">
                <FirebasePermissionsError />
            </div>
        );
    }

    // Mostrar otros errores
    if (error) {
        return (
            <div className="page-container">
                <div className="glass-card p-8 text-center">
                    <svg
                        className="w-16 h-16 mx-auto mb-4 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                        Error
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn-primary"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="page-container">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-300">Cargando categorías...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
                <h1 className="page-title mb-0 text-center sm:text-left w-full sm:w-auto">Gestión de Categorías</h1>
                {!showForm && (
                    <button onClick={handleCreate} className="btn-primary w-full sm:w-auto justify-center">
                        <svg className="w-5 h-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nueva Categoría
                    </button>
                )}
            </div>

            {showForm ? (
                <div className="glass-card p-6 mb-6 animate-slide-down">
                    <h2 className="section-title">
                        {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                    </h2>
                    <CategoryForm
                        category={editingCategory || undefined}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />
                </div>
            ) : (
                <>
                    {categories.length === 0 ? (
                        <div className="glass-card p-12 text-center">
                            <svg
                                className="w-16 h-16 mx-auto mb-4 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                />
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                                No hay categorías
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Comienza creando tu primera categoría de voleybol
                            </p>
                            <button onClick={handleCreate} className="btn-primary">
                                Crear Primera Categoría
                            </button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="glass-card-hover p-5 group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                                {category.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                Por equipo
                                            </p>
                                        </div>
                                        <PriceDisplay usdAmount={category.pricePerTeam} />
                                    </div>

                                    <div className="pt-4 mb-4 border-t border-gray-200 dark:border-gray-600">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                            Total por juego (2 equipos):
                                        </p>
                                        <PriceDisplay usdAmount={category.pricePerTeam * 2} showBoth={true} />
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                        >
                                            <svg className="w-4 h-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category)}
                                            className="flex-1 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                        >
                                            <svg className="w-4 h-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
