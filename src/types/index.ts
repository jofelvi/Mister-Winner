export interface Prize {
  id: string;
  name: string;
  amount: number;
  position: number; // 1st, 2nd, 3rd, etc.
  imageUrl?: string; // URL of prize image stored in Firebase Storage
  description?: string; // Optional description of the prize
}

export interface Raffle {
  id: string;
  type: 2 | 4 | 5 | 6; // Updated to support 2, 4, 5, 6 digits
  title: string;
  pricePerNumber: number;
  prizes: Prize[]; // Multiple prizes support
  totalNumbers: number;
  numbersSold: number;
  soldNumbers?: string[]; // Array of sold numbers
  drawDate: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string; // User ID who created the raffle
  updatedBy?: string; // User ID who last updated the raffle
}

export interface Winner {
  id: string;
  name: string;
  userId: string;
  ci: string; // Winner's ID number
  phone: string; // Winner's phone number
  raffleId: string;
  raffleTitle?: string; // Made optional since it can be derived from raffle
  prizeAmount?: number; // Made optional since it can be derived from prize
  prizeName?: string;
  prizePosition: number;
  winningNumber: string;
  drawDate?: string;
  status: 'pending' | 'contacted' | 'paid' | 'delivered'; // Winner status tracking
  contactedAt?: string; // ISO string timestamp when winner was contacted
  paidAt?: string; // ISO string timestamp when prize was paid
  deliveredAt?: string; // ISO string timestamp when prize was delivered
  notes?: string; // Additional notes about the winner
  prizeDelivered?: boolean;
  prizeDeliveredAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

// --- MOCK DATA ---
export const mockRaffles: Raffle[] = [
  {
    id: '1',
    type: 4,
    title: 'Rifa Especial de Julio',
    pricePerNumber: 2,
    prizes: [
      { id: '1', name: 'Teléfono Inteligente', amount: 500, position: 1 },
      { id: '2', name: 'Audífonos Bluetooth', amount: 100, position: 2 },
    ],
    totalNumbers: 10000,
    numbersSold: 7800,
    drawDate: '30 de Julio, 2025',
    status: 'active',
    createdAt: new Date('2025-07-01'),
    updatedAt: new Date('2025-07-17'),
  },
  {
    id: '2',
    type: 2,
    title: 'Sorteo Rápido',
    pricePerNumber: 1,
    prizes: [{ id: '3', name: 'Cena para dos', amount: 100, position: 1 }],
    totalNumbers: 100,
    numbersSold: 95,
    drawDate: '15 de Julio, 2025',
    status: 'active',
    createdAt: new Date('2025-07-01'),
    updatedAt: new Date('2025-07-17'),
  },
  {
    id: '3',
    type: 6,
    title: 'Gran Rifa de Aniversario',
    pricePerNumber: 5,
    prizes: [
      { id: '4', name: 'Laptop Gamer', amount: 1500, position: 1 },
      { id: '5', name: 'Monitor 4K', amount: 400, position: 2 },
      { id: '6', name: 'Teclado Mecánico', amount: 150, position: 3 },
    ],
    totalNumbers: 1000000,
    numbersSold: 650000,
    drawDate: '01 de Agosto, 2025',
    status: 'active',
    createdAt: new Date('2025-07-01'),
    updatedAt: new Date('2025-07-17'),
  },
];

export const mockWinners: Winner[] = [
  {
    id: '1',
    name: 'María P.',
    userId: 'user1',
    ci: 'V-12345678',
    phone: '+58-414-123-4567',
    raffleId: 'raffle1',
    raffleTitle: 'Rifa de Junio',
    prizeAmount: 500,
    prizePosition: 1,
    winningNumber: '742',
    status: 'pending',
    createdAt: new Date('2025-07-01'),
  },
  {
    id: '2',
    name: 'Carlos R.',
    userId: 'user2',
    ci: 'V-87654321',
    phone: '+58-424-987-6543',
    raffleId: 'raffle2',
    raffleTitle: 'Sorteo Express',
    prizeAmount: 50,
    prizePosition: 1,
    winningNumber: '31',
    status: 'paid',
    createdAt: new Date('2025-07-05'),
  },
  {
    id: '3',
    name: 'Ana G.',
    userId: 'user3',
    ci: 'V-11223344',
    phone: '+58-412-555-1234',
    raffleId: 'raffle3',
    raffleTitle: 'Rifa de Mayo',
    prizeAmount: 1000,
    prizePosition: 1,
    winningNumber: '1984',
    status: 'delivered',
    createdAt: new Date('2025-06-15'),
  },
];

export interface UserProfile {
  id: string;
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
// notas
