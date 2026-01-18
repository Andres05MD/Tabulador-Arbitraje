import { Timestamp } from 'firebase/firestore';

export type UserRole = 'admin' | 'coordinador' | 'user';

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
    role: UserRole;
    createdAt: Timestamp;
}

export interface Court {
    id: string;
    name: string;
    createdAt: Timestamp;
    updatedAt?: Timestamp;
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
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';

    // Payment status
    isPaidTeamA?: boolean;
    isPaidTeamB?: boolean;
    paymentRefTeamA?: string;
    paymentRefTeamB?: string;

    // Location info
    courtId: string;
    courtName: string;

    // Referee/Admin info
    ownerId?: string; // Creator ID
    refereeName?: string; // For public referee access

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

