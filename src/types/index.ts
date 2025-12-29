import { Timestamp } from 'firebase/firestore';

export interface Category {
    id: string;
    name: string;
    pricePerTeam: number;
    ownerId?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface Game {
    id: string;
    date: Timestamp;
    time?: string;
    categoryId: string;
    categoryName: string;
    teamA: string;
    teamB: string;
    totalCost: number;
    status?: 'pending' | 'completed' | 'cancelled';
    ownerId?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface CategoryFormData {
    name: string;
    pricePerTeam: number;
}

export interface GameFormData {
    date: Date;
    time?: string;
    categoryId: string;
    teamA: string;
    teamB: string;
}
