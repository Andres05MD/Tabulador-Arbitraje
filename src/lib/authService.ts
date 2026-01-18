import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
    sendPasswordResetEmail,
    updateProfile,
    signInAnonymously,
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp, getDocs, collection, query, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { UserProfile } from '@/types';

// Obtener todos los usuarios (Solo para admins)
export async function getAllUsers(): Promise<UserProfile[]> {
    try {
        const q = query(collection(db, 'users'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as UserProfile);
    } catch (error) {
        console.error('Error fetching all users:', error);
        return [];
    }
}

// Actualizar rol de usuario
export async function updateUserRole(uid: string, newRole: UserRole): Promise<void> {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
        role: newRole,
        updatedAt: Timestamp.now()
    });
}
// Registrar nuevo usuario
export async function registerUser(email: string, password: string, displayName: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Actualizar perfil con nombre
    if (userCredential.user) {
        await updateProfile(userCredential.user, {
            displayName,
        });

        // Crear documento de usuario en Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            uid: userCredential.user.uid,
            email,
            displayName,
            role: 'user', // Por defecto
            createdAt: Timestamp.now(),
        });
    }

    return userCredential.user;
}

import type { UserRole } from '@/types';

// Obtener rol del usuario
export async function getUserRole(uid: string): Promise<UserRole | null> {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
            return (userDoc.data() as UserProfile).role;
        }
        return null;
    } catch (error) {
        console.error('Error fetching user role:', error);
        return null;
    }
}

// Iniciar sesión
export async function loginUser(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
}

// Iniciar sesión anónima
export async function loginAnonymously() {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
}

// Cerrar sesión
export async function logoutUser() {
    await signOut(auth);
}

// Restablecer contraseña
export async function resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
}

// Observar cambios en autenticación
export function onAuthChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}
