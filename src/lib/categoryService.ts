import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    orderBy,
    Timestamp,
    onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Category } from '@/src/types';

const COLLECTION_NAME = 'categories';

// Obtener todas las categorías (snapshot en tiempo real)
export function subscribeToCategories(
    callback: (categories: Category[]) => void,
    onError?: (error: any) => void
) {
    const q = query(collection(db, COLLECTION_NAME), orderBy('name', 'asc'));

    return onSnapshot(
        q,
        (snapshot) => {
            const categories: Category[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            } as Category));
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

// Obtener todas las categorías (una sola vez)
export async function getCategories(): Promise<Category[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy('name', 'asc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    } as Category));
}

// Crear nueva categoría
export async function createCategory(data: {
    name: string;
    pricePerTeam: number;
}): Promise<string> {
    const now = Timestamp.now();

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        name: data.name,
        pricePerTeam: data.pricePerTeam,
        createdAt: now,
        updatedAt: now,
    });

    return docRef.id;
}

// Actualizar categoría
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
