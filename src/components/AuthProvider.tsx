'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { onAuthChange, getUserRole, loginAnonymously } from '@/src/lib/authService';

interface AuthContextType {
    user: User | null;
    role: 'admin' | 'user' | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    role: null,
    loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<'admin' | 'user' | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthChange(async (user) => {
            if (!user) {
                // Si no hay usuario, iniciamos sesión anónima automáticamente
                // Esto disparará este callback de nuevo con el usuario anónimo
                try {
                    await loginAnonymously();
                } catch (error) {
                    console.error('Error signing in anonymously:', error);
                    setLoading(false);
                }
                return;
            }

            setUser(user);
            if (user.isAnonymous) {
                setRole('user'); // Usuarios anónimos son 'users'
            } else {
                const userRole = await getUserRole(user.uid);
                setRole(userRole || 'user');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, role, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
