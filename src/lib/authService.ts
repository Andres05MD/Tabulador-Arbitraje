import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
    sendPasswordResetEmail,
    updateProfile,
} from 'firebase/auth';
import { auth } from './firebase';

// Registrar nuevo usuario
export async function registerUser(email: string, password: string, displayName: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Actualizar perfil con nombre
    if (userCredential.user) {
        await updateProfile(userCredential.user, {
            displayName,
        });
    }

    return userCredential.user;
}

// Iniciar sesión
export async function loginUser(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
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
