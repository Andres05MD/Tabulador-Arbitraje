'use client';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import type { Category } from '@/src/types';
import { createGame } from '@/src/lib/gameService';
import { subscribeToCategories } from '@/src/lib/categoryService';
import GameForm from '@/src/components/GameForm';
import FirebasePermissionsError from '@/src/components/FirebasePermissionsError';
import type { GameFormData } from '@/src/lib/validations';
import { useAuth } from '@/src/components/AuthProvider';

export default function CargarJuegoPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        const unsubscribe = subscribeToCategories(
            user.uid,
            (updatedCategories) => {
                setCategories(updatedCategories);
                setLoading(false);
            },
            (err) => {
                console.error('Error loading categories:', err);
                if (err.code === 'permission-denied') {
                    setError('firebase-permissions');
                } else {
                    setError('Error al cargar las categorías');
                }
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [user]);

    const handleSubmit = async (data: GameFormData) => {
        if (!user) return;

        if (categories.length === 0) {
            Swal.fire({
                title: 'Sin Categorías',
                text: 'Primero debes crear categorías antes de registrar juegos.',
                icon: 'warning',
                confirmButtonText: 'OK',
                confirmButtonColor: '#0ea5e9',
            });
            return;
        }

        try {
            const category = categories.find((cat) => cat.id === data.categoryId);
            if (!category) {
                throw new Error('Categoría no encontrada');
            }

            await createGame({
                ...data,
                ownerId: user.uid,
            }, category);

            await Swal.fire({
                title: '¡Registrado!',
                text: 'El juego se ha registrado correctamente',
                icon: 'success',
                showCancelButton: true,
                confirmButtonText: 'Registrar Otro',
                cancelButtonText: 'Ir a Lista de Juegos',
                confirmButtonColor: '#0ea5e9',
                cancelButtonColor: '#6b7280',
            }).then((result) => {
                if (!result.isConfirmed) {
                    router.push('/juegos');
                }
            });
        } catch (error) {
            console.error('Error saving game:', error);
            await Swal.fire({
                title: 'Error',
                text: 'Hubo un error al guardar el juego',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#ef4444',
            });
        }
    };

    const handleCancel = () => {
        router.back();
    };

    if (error === 'firebase-permissions') {
        return (
            <div className="page-container">
                <FirebasePermissionsError />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="page-container">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-300">Cargando...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <h1 className="page-title">Registrar Nuevo Juego</h1>
            <div className="glass-card p-6 animate-scale-in">
                <GameForm
                    categories={categories}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}
