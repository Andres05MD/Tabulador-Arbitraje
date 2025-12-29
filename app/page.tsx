'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/components/AuthProvider';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Si no hay usuario autenticado, redirigir al login
        router.push('/login');
      } else {
        // Si hay usuario autenticado, redirigir a la página de categorías
        router.push('/categorias');
      }
    }
  }, [user, loading, router]);

  // Mostrar un loader mientras se verifica la autenticación
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Cargando...</p>
      </div>
    </div>
  );
}

