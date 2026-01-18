import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    onSnapshot,
    Timestamp,
    deleteDoc,
    doc,
    updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Court } from '@/types';

const COLLECTION_NAME = 'courts';

// Suscribirse a las canchas en tiempo real
export function subscribeToCourts(
    onSuccess: (courts: Court[]) => void,
    onError: (error: any) => void
) {
    const q = query(collection(db, COLLECTION_NAME), orderBy('name', 'asc'));

    return onSnapshot(
        q,
        (snapshot) => {
            const courts = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            } as Court));
            onSuccess(courts);
        },
        onError
    );
}

// Obtener todas las canchas ordenadas por nombre
export async function getCourts(): Promise<Court[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy('name', 'asc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    } as Court));
}

// Crear nueva cancha
export async function createCourt(name: string): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        name,
        createdAt: Timestamp.now(),
    });

    return docRef.id;
}

// Actualizar cancha
export async function updateCourt(id: string, name: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
        name,
        updatedAt: Timestamp.now(),
    });
}

// Eliminar cancha
export async function deleteCourt(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
}
