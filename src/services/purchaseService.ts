import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  runTransaction,
} from 'firebase/firestore';
import { db } from './firebase';
import FirestoreService from './genericServices';

export interface NumberPurchase {
  id: string;
  raffleId: string;
  userId: string;
  numbers: string[];
  totalAmount: number;
  paymentMethod: 'pago_movil' | 'transferencia' | 'creditos' | 'puntos';
  paymentReference?: string;
  status: 'pending' | 'confirmed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'pago_movil' | 'transferencia' | 'creditos' | 'puntos';
  description: string;
  icon: string;
  requiresReference: boolean;
  enabled: boolean;
}

class PurchaseService extends FirestoreService<NumberPurchase> {
  constructor() {
    super('purchases');
  }

  /**
   * Get available payment methods
   */
  getPaymentMethods(): PaymentMethod[] {
    return [
      {
        id: 'pago_movil',
        name: 'Pago Móvil',
        type: 'pago_movil',
        description: 'Pago instantáneo desde tu banco',
        icon: '📱',
        requiresReference: true,
        enabled: true,
      },
      {
        id: 'transferencia',
        name: 'Transferencia Bancaria',
        type: 'transferencia',
        description: 'Transferencia desde cualquier banco',
        icon: '🏦',
        requiresReference: true,
        enabled: true,
      },
      {
        id: 'creditos',
        name: 'Mis Créditos',
        type: 'creditos',
        description: 'Usar créditos acumulados',
        icon: '💰',
        requiresReference: false,
        enabled: true,
      },
      {
        id: 'puntos',
        name: 'Mis Puntos',
        type: 'puntos',
        description: 'Canjear puntos por números',
        icon: '⭐',
        requiresReference: false,
        enabled: true,
      },
    ];
  }

  /**
   * Listen to real-time updates of sold numbers for a raffle
   */
  listenToSoldNumbers(
    raffleId: string,
    callback: (soldNumbers: string[]) => void
  ): () => void {
    const raffleDocRef = doc(db, 'raffles', raffleId);

    return onSnapshot(raffleDocRef, doc => {
      if (doc.exists()) {
        const data = doc.data();
        callback(data.soldNumbers || []);
      }
    });
  }

  /**
   * Check if numbers are still available (real-time check)
   */
  async checkNumbersAvailability(
    raffleId: string,
    numbers: string[]
  ): Promise<{ available: string[]; taken: string[] }> {
    try {
      const raffleDocRef = doc(db, 'raffles', raffleId);
      const raffleSnap = await getDoc(raffleDocRef);

      if (!raffleSnap.exists()) {
        throw new Error('Raffle not found');
      }

      const raffleData = raffleSnap.data();
      const soldNumbers = raffleData.soldNumbers || [];

      const available = numbers.filter(num => !soldNumbers.includes(num));
      const taken = numbers.filter(num => soldNumbers.includes(num));

      return { available, taken };
    } catch (error) {
      console.error('Error checking number availability:', error);
      throw error;
    }
  }

  /**
   * Purchase numbers with atomic transaction
   */
  async purchaseNumbers(
    raffleId: string,
    userId: string,
    numbers: string[],
    paymentMethod: PaymentMethod,
    paymentReference?: string
  ): Promise<NumberPurchase> {
    try {
      const result = await runTransaction(db, async transaction => {
        const raffleDocRef = doc(db, 'raffles', raffleId);
        const raffleDoc = await transaction.get(raffleDocRef);

        if (!raffleDoc.exists()) {
          throw new Error('Raffle not found');
        }

        const raffleData = raffleDoc.data();
        const soldNumbers = raffleData.soldNumbers || [];

        // Check if any numbers are already sold
        const conflictNumbers = numbers.filter(num =>
          soldNumbers.includes(num)
        );
        if (conflictNumbers.length > 0) {
          throw new Error(
            `Los siguientes números ya fueron vendidos: ${conflictNumbers.join(', ')}`
          );
        }

        // Check if raffle is still active
        if (raffleData.status !== 'active') {
          throw new Error('Esta rifa ya no está activa');
        }

        // Calculate total amount
        const totalAmount = numbers.length * raffleData.pricePerNumber;

        // Create purchase record
        const now = new Date().toISOString();
        const purchaseData: Omit<NumberPurchase, 'id'> = {
          raffleId,
          userId,
          numbers,
          totalAmount,
          paymentMethod: paymentMethod.type,
          paymentReference,
          status:
            paymentMethod.type === 'creditos' || paymentMethod.type === 'puntos'
              ? 'confirmed'
              : 'pending',
          createdAt: now,
          updatedAt: now,
        };

        // Add purchase to purchases collection
        const purchaseDocRef = doc(collection(db, 'purchases'));
        transaction.set(purchaseDocRef, purchaseData);

        // Update raffle with new sold numbers and count
        const newSoldNumbers = [...soldNumbers, ...numbers];
        transaction.update(raffleDocRef, {
          soldNumbers: newSoldNumbers,
          numbersSold: newSoldNumbers.length,
          updatedAt: now,
        });

        return {
          id: purchaseDocRef.id,
          ...purchaseData,
        };
      });

      return result;
    } catch (error) {
      console.error('Error purchasing numbers:', error);
      throw error;
    }
  }

  /**
   * Get user purchases for a specific raffle
   */
  async getUserRafflePurchases(
    userId: string,
    raffleId: string
  ): Promise<NumberPurchase[]> {
    try {
      const purchases = await this.getWhere('userId', '==', userId);
      return purchases.filter(p => p.raffleId === raffleId);
    } catch (error) {
      console.error('Error fetching user raffle purchases:', error);
      return [];
    }
  }

  /**
   * Get all purchases for a specific raffle
   */
  async getPurchasesByRaffle(raffleId: string): Promise<NumberPurchase[]> {
    try {
      const purchases = await this.getWhere('raffleId', '==', raffleId);
      return purchases;
    } catch (error) {
      console.error('Error fetching raffle purchases:', error);
      return [];
    }
  }

  /**
   * Generate available numbers for a raffle
   */
  generateNumbersForRaffle(
    type: 2 | 4 | 5 | 6,
    soldNumbers: string[] = []
  ): string[] {
    const totalNumbers = Math.pow(10, type);
    const numbers: string[] = [];

    for (let i = 0; i < totalNumbers; i++) {
      const number = i.toString().padStart(type, '0');
      if (!soldNumbers.includes(number)) {
        numbers.push(number);
      }
    }

    return numbers;
  }

  /**
   * Get random available numbers
   */
  getRandomAvailableNumbers(
    availableNumbers: string[],
    count: number
  ): string[] {
    const shuffled = [...availableNumbers].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, availableNumbers.length));
  }
}

const purchaseService = new PurchaseService();
export default purchaseService;
