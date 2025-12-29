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

// Obtener categorías por ownerId (snapshot en tiempo real)
export function subscribeToCategories(
    ownerId: string,
    callback: (categories: Category[]) => void,
    onError?: (error: any) => void
) {
    if (!ownerId) {
        callback([]);
        return () => { };
    }

    const q = query(
        collection(db, COLLECTION_NAME),
        where('ownerId', '==', ownerId)
    );

    return onSnapshot(
        q,
        (snapshot) => {
            const categories: Category[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            } as Category));

            // Ordenar en cliente para evitar requerir índice compuesto
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

// Obtener todas las categorías de un usuario (una sola vez)
export async function getCategories(ownerId: string): Promise<Category[]> {
    if (!ownerId) return [];

    const q = query(
        collection(db, COLLECTION_NAME),
        where('ownerId', '==', ownerId)
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
