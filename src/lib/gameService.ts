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
    getDoc,
    deleteField,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Game, Category } from '@/src/types';

const COLLECTION_NAME = 'games';

// Obtener todos los juegos de un usuario (snapshot en tiempo real)
export function subscribeToGames(
    ownerId: string,
    callback: (games: Game[]) => void,
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
            const games: Game[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            } as Game));

            // Ordenar por fecha descendente en cliente
            games.sort((a, b) => b.date.toMillis() - a.date.toMillis());

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

// Obtener juegos por rango de fechas y usuario
export function subscribeToGamesByDateRange(
    ownerId: string,
    startDate: Date,
    endDate: Date,
    callback: (games: Game[]) => void,
    onError?: (error: any) => void
) {
    if (!ownerId) {
        callback([]);
        return () => { };
    }

    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);

    const q = query(
        collection(db, COLLECTION_NAME),
        where('ownerId', '==', ownerId),
        where('date', '>=', startTimestamp),
        where('date', '<=', endTimestamp)
    );

    return onSnapshot(
        q,
        (snapshot) => {
            const games: Game[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            } as Game));

            // Ordenar por fecha descendente en cliente
            games.sort((a, b) => b.date.toMillis() - a.date.toMillis());

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
        ownerId: string;
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
        isPaidTeamA: false,
        isPaidTeamB: false,
        ownerId: data.ownerId,
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

// Actualizar estado de pago de un equipo
export async function updateGamePaymentStatus(
    id: string,
    team: 'A' | 'B',
    isPaid: boolean,
    paymentReference?: string
): Promise<void> {
    const gameRef = doc(db, COLLECTION_NAME, id);
    const gameSnap = await getDoc(gameRef);

    if (!gameSnap.exists()) {
        throw new Error('Game not found');
    }

    const gameData = gameSnap.data() as Game;
    const isPaidTeamA = team === 'A' ? isPaid : gameData.isPaidTeamA;
    const isPaidTeamB = team === 'B' ? isPaid : gameData.isPaidTeamB;

    // Si ambos están pagados, el estado es 'completed', si no 'pending'
    // Mantenemos 'cancelled' si estaba cancelado y se modifican pagos? 
    // Asumiremos que el pago reactiva el flujo, o simplemente cambiamos a completed/pending.
    // Si estaba cancelled y pagamos, probablemente debería seguir cancelled o pasar a completed si es intencional.
    // Para simplificar: Pagos completos = completed. Pagos incompletos = pending (a menos que ya estuviera cancelled, pero por ahora forzaremos pending para simplificar el flujo activo).

    let newStatus = gameData.status;
    if (isPaidTeamA && isPaidTeamB) {
        newStatus = 'completed';
    } else if (newStatus === 'completed' && (!isPaidTeamA || !isPaidTeamB)) {
        // Si estaba completado y desmarcamos uno, vuelve a pendiente
        newStatus = 'pending';
    }

    const updateData: any = {
        [`isPaidTeam${team}`]: isPaid,
        updatedAt: Timestamp.now(),
    };

    // Si se paga y hay referencia, guardarla. Si se despaga, podríamos borrarla o mantenerla como historial. 
    // Asumiremos que si se marca como NO pagado, se quiere limpiar la referencia, 
    // o si el usuario simplemente cambia el estado.
    if (isPaid && paymentReference !== undefined) {
        updateData[`paymentRefTeam${team}`] = paymentReference;
    } else if (!isPaid) {
        // Opción: Limpiar referencia si se marca como no pagado
        updateData[`paymentRefTeam${team}`] = deleteField();
    }

    if (newStatus !== gameData.status) {
        updateData.status = newStatus;
    }

    await updateDoc(gameRef, updateData);
}

// Eliminar juego
export async function deleteGame(id: string): Promise<void> {
    const gameRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(gameRef);
}
