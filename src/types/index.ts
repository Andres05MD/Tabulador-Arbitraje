import { Timestamp } from 'firebase/firestore';

export interface Category {
    id: string;
    name: string;
    pricePerTeam: number;
    ownerId?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    role: 'admin' | 'user';
    createdAt: Timestamp;
}

export interface Court {
    id: string;
    name: string;
    createdAt: Timestamp;
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
    isPaidTeamA?: boolean;
    isPaidTeamB?: boolean;
    paymentRefTeamA?: string;
    paymentRefTeamB?: string;

    // New fields
    courtId: string;
    courtName: string;

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
