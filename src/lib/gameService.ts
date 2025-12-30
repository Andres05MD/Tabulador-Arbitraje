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
    writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import type { Game, Category } from '@/src/types';

const COLLECTION_NAME = 'games';

// Eliminar juegos antiguos (más de 5 días)
export async function deleteOldGames() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 5);
    const cutoffTimestamp = Timestamp.fromDate(cutoffDate);

    // Consultamos por fecha de juego
    const q = query(
        collection(db, COLLECTION_NAME),
        where('date', '<', cutoffTimestamp)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) return;

    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });

    await batch.commit();
}

// Obtener juegos con filtros (Tiempo real)
// Si ownerId es null, se asume Admin y se traen todos del court
export function subscribeToGames(
    courtId: string,
    filters: {
        date?: Date;
        ownerId?: string | null;
    },
    callback: (games: Game[]) => void,
    onError?: (error: any) => void
) {
    if (!courtId) {
        callback([]);
        return () => { };
    }

    let q = query(
        collection(db, COLLECTION_NAME),
        where('courtId', '==', courtId)
    );

    // Filtrar por dueño si no es admin (o si se quiere filtrar específico)
    if (filters.ownerId) {
        q = query(q, where('ownerId', '==', filters.ownerId));
    }

    // Filtrar por fecha (default: hoy, pero manejado por el componente mejor?)
    // El prompt dice "cargar los juegos del dia".
    // Si pasamos fecha, filtramos.
    if (filters.date) {
        const start = new Date(filters.date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(filters.date);
        end.setHours(23, 59, 59, 999);

        q = query(
            q,
            where('date', '>=', Timestamp.fromDate(start)),
            where('date', '<=', Timestamp.fromDate(end))
        );
    }

    return onSnapshot(
        q,
        (snapshot) => {
            const games: Game[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            } as Game));

            // Ordenar por fecha/hora descendente en cliente
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
        courtId: string;
        courtName: string;
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
        courtId: data.courtId,
        courtName: data.courtName,
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

    let newStatus = gameData.status;
    if (isPaidTeamA && isPaidTeamB) {
        newStatus = 'completed';
    } else if (newStatus === 'completed' && (!isPaidTeamA || !isPaidTeamB)) {
        newStatus = 'pending';
    }

    const updateData: any = {
        [`isPaidTeam${team}`]: isPaid,
        updatedAt: Timestamp.now(),
    };

    if (isPaid && paymentReference !== undefined) {
        updateData[`paymentRefTeam${team}`] = paymentReference;
    } else if (!isPaid) {
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
