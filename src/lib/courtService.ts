import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Court } from '@/src/types';

const COLLECTION_NAME = 'courts';

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
