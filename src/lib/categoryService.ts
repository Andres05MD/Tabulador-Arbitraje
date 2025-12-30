import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
    Timestamp,
    onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Category } from '@/src/types';

const COLLECTION_NAME = 'categories';

// Obtener todas las categorías (snapshot en tiempo real)
export function subscribeToCategories(
    _ownerId: string | null, // Deprecated/Ignored but kept for signature
    callback: (categories: Category[]) => void,
    onError?: (error: any) => void
) {
    const q = query(
        collection(db, COLLECTION_NAME)
        // Global categories: No owner filter
    );

    return onSnapshot(
        q,
        (snapshot) => {
            const categories: Category[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            } as Category));

            // Ordenar en cliente
            categories.sort((a, b) => a.name.localeCompare(b.name));

            callback(categories);
        },
        (error) => {
            console.error('Firestore subscription error:', error);
            if (onError) {
                onError(error);
            }
        }
    );
}

// Obtener todas las categorías
export async function getCategories(_ownerId?: string): Promise<Category[]> {
    const q = query(
        collection(db, COLLECTION_NAME)
    );
    const snapshot = await getDocs(q);

    const categories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    } as Category));

    return categories.sort((a, b) => a.name.localeCompare(b.name));
}



// Crear nueva categoría
export async function createCategory(data: {
    name: string;
    pricePerTeam: number;
    ownerId: string;
}): Promise<string> {
    const now = Timestamp.now();

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        name: data.name,
        pricePerTeam: data.pricePerTeam,
        ownerId: data.ownerId,
        createdAt: now,
        updatedAt: now,
    });

    return docRef.id;
}

// Actualizar categoría (se mantiene igual, ya tienes el ID)
export async function updateCategory(
    id: string,
    data: {
        name: string;
        pricePerTeam: number;
    }
): Promise<void> {
    const categoryRef = doc(db, COLLECTION_NAME, id);

    await updateDoc(categoryRef, {
        name: data.name,
        pricePerTeam: data.pricePerTeam,
        updatedAt: Timestamp.now(),
    });
}

// Eliminar categoría
export async function deleteCategory(id: string): Promise<void> {
    const categoryRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(categoryRef);
}
