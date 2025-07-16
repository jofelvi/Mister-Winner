export interface Raffle {
    id: string;
    type: 2 | 3 | 4;
    title: string;
    pricePerNumber: number;
    prize: {
        name: string;
        amount: number;
    };
    totalNumbers: number;
    numbersSold: number;
    drawDate: string;
}

export interface Winner {
    name: string;
    raffleTitle: string;
    prizeAmount: number;
    winningNumber: string;
}

// --- MOCK DATA ---
export const mockRaffles: Raffle[] = [
    { id: '1', type: 3, title: 'Rifa Especial de Julio', pricePerNumber: 2, prize: { name: 'Teléfono Inteligente', amount: 500 }, totalNumbers: 1000, numbersSold: 780, drawDate: '30 de Julio, 2025' },
    { id: '2', type: 2, title: 'Sorteo Rápido', pricePerNumber: 1, prize: { name: 'Cena para dos', amount: 100 }, totalNumbers: 100, numbersSold: 95, drawDate: '15 de Julio, 2025' },
    { id: '3', type: 4, title: 'Gran Rifa de Aniversario', pricePerNumber: 5, prize: { name: 'Laptop Gamer', amount: 1500 }, totalNumbers: 10000, numbersSold: 6500, drawDate: '01 de Agosto, 2025' },
];

export const mockWinners: Winner[] = [
    { name: 'María P.', raffleTitle: 'Rifa de Junio', prizeAmount: 500, winningNumber: '742' },
    { name: 'Carlos R.', raffleTitle: 'Sorteo Express', prizeAmount: 50, winningNumber: '31' },
    { name: 'Ana G.', raffleTitle: 'Rifa de Mayo', prizeAmount: 1000, winningNumber: '1984' },
];

export interface UserProfile {
    uid: string;
    email: string;
    firstName: string;
    lastName: string; 
    ci: string;
    phone: string;
    secondaryPhone?: string;
    referralCode: string;
    referredBy?: string;
    points: number;
    credits: number;
    role: 'user' | 'agent' | 'admin';
    createdAt: Date;
}