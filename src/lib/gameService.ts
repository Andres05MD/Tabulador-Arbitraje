import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    orderBy,
    where,
    Timestamp,
    onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Game, Category } from '@/src/types';

const COLLECTION_NAME = 'games';

// Obtener todos los juegos (snapshot en tiempo real)
export function subscribeToGames(
    callback: (games: Game[]) => void,
    onError?: (error: any) => void
) {
    const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));

    return onSnapshot(
        q,
        (snapshot) => {
            const games: Game[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            } as Game));
            callback(games);
        },
        (error) => {
            console.error('Firestore subscription error:', error);
            if (onError) {
                onError(error);
            }
        }
    );
}

// Obtener juegos por rango de fechas
export function subscribeToGamesByDateRange(
    startDate: Date,
    endDate: Date,
    callback: (games: Game[]) => void,
    onError?: (error: any) => void
) {
    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);

    const q = query(
        collection(db, COLLECTION_NAME),
        where('date', '>=', startTimestamp),
        where('date', '<=', endTimestamp),
        orderBy('date', 'desc')
    );

    return onSnapshot(
        q,
        (snapshot) => {
            const games: Game[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            } as Game));
            callback(games);
        },
        (error) => {
            console.error('Firestore subscription error:', error);
            if (onError) {
                onError(error);
            }
        }
    );
}

// Crear nuevo juego
export async function createGame(
    data: {
        date: Date;
        time?: string;
        categoryId: string;
        teamA: string;
        teamB: string;
    },
    category: Category
): Promise<string> {
    const now = Timestamp.now();
    const totalCost = category.pricePerTeam * 2;

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        date: Timestamp.fromDate(data.date),
        time: data.time || '',
        categoryId: data.categoryId,
        categoryName: category.name,
        teamA: data.teamA,
        teamB: data.teamB,
        totalCost,
        status: 'pending',
        createdAt: now,
        updatedAt: now,
    });

    return docRef.id;
}

// Actualizar juego
export async function updateGame(
    id: string,
    data: {
        date: Date;
        time?: string;
        categoryId: string;
        teamA: string;
        teamB: string;
    },
    category: Category
): Promise<void> {
    const gameRef = doc(db, COLLECTION_NAME, id);
    const totalCost = category.pricePerTeam * 2;

    await updateDoc(gameRef, {
        date: Timestamp.fromDate(data.date),
        time: data.time || '',
        categoryId: data.categoryId,
        categoryName: category.name,
        teamA: data.teamA,
        teamB: data.teamB,
        totalCost,
        updatedAt: Timestamp.now(),
    });
}

// Actualizar estado del juego
export async function updateGameStatus(
    id: string,
    status: 'pending' | 'completed' | 'cancelled'
): Promise<void> {
    const gameRef = doc(db, COLLECTION_NAME, id);

    await updateDoc(gameRef, {
        status,
        updatedAt: Timestamp.now(),
    });
}

// Eliminar juego
export async function deleteGame(id: string): Promise<void> {
    const gameRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(gameRef);
}
