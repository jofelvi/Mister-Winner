import FirestoreService from './genericServices';
import { Raffle } from '@/types';

class RaffleService extends FirestoreService<Raffle> {
  constructor() {
    super('raffles');
  }

  async getActiveRaffles(): Promise<Raffle[]> {
    try {
      const allRaffles = await this.getAll();
      return allRaffles.filter(raffle => raffle.status === 'active');
    } catch (error) {
      console.error('Error getting active raffles:', error);
      throw error;
    }
  }

  async getCompletedRaffles(): Promise<Raffle[]> {
    try {
      const allRaffles = await this.getAll();
      return allRaffles.filter(raffle => raffle.status === 'completed');
    } catch (error) {
      console.error('Error getting completed raffles:', error);
      throw error;
    }
  }

  async getRafflesByStatus(
    status: 'active' | 'completed' | 'cancelled'
  ): Promise<Raffle[]> {
    try {
      const allRaffles = await this.getAll();
      return allRaffles.filter(raffle => raffle.status === status);
    } catch (error) {
      console.error(`Error getting ${status} raffles:`, error);
      throw error;
    }
  }

  async createRaffle(
    raffleData: Omit<Raffle, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Raffle> {
    try {
      const now = new Date();
      const enrichedRaffle: Omit<Raffle, 'id'> = {
        ...raffleData,
        status: 'active',
        numbersSold: 0,
        soldNumbers: [],
        createdAt: now,
        updatedAt: now,
      };

      return await this.create(enrichedRaffle);
    } catch (error) {
      console.error('Error creating raffle:', error);
      throw error;
    }
  }

  async updateRaffleStatus(
    raffleId: string,
    status: 'active' | 'completed' | 'cancelled'
  ): Promise<void> {
    try {
      const updates = {
        status,
        updatedAt: new Date(),
      };

      return await this.update(raffleId, updates);
    } catch (error) {
      console.error('Error updating raffle status:', error);
      throw error;
    }
  }

  async addSoldNumber(
    raffleId: string,
    number: string,
    userId: string
  ): Promise<void> {
    try {
      const raffle = await this.getById(raffleId);
      if (!raffle) {
        throw new Error('Raffle not found');
      }

      // Check if number is already sold
      if (raffle.soldNumbers?.includes(number)) {
        throw new Error('Number already sold');
      }

      const updatedSoldNumbers = [...(raffle.soldNumbers || []), number];
      const updates = {
        soldNumbers: updatedSoldNumbers,
        numbersSold: updatedSoldNumbers.length,
        updatedAt: new Date(),
      };

      return await this.update(raffleId, updates);
    } catch (error) {
      console.error('Error adding sold number:', error);
      throw error;
    }
  }

  async getRaffleProgress(
    raffleId: string
  ): Promise<{ sold: number; total: number; percentage: number }> {
    try {
      const raffle = await this.getById(raffleId);
      if (!raffle) {
        throw new Error('Raffle not found');
      }

      const sold = raffle.numbersSold;
      const total = raffle.totalNumbers;
      const percentage = Math.round((sold / total) * 100);

      return { sold, total, percentage };
    } catch (error) {
      console.error('Error getting raffle progress:', error);
      throw error;
    }
  }

  async getRecentRaffles(limit: number = 5): Promise<Raffle[]> {
    try {
      const allRaffles = await this.getAll();
      return allRaffles
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting recent raffles:', error);
      throw error;
    }
  }

  async searchRaffles(query: string): Promise<Raffle[]> {
    try {
      const allRaffles = await this.getAll();
      const lowercaseQuery = query.toLowerCase();

      return allRaffles.filter(
        raffle =>
          raffle.title.toLowerCase().includes(lowercaseQuery) ||
          raffle.prizes.some(
            prize =>
              prize.name.toLowerCase().includes(lowercaseQuery) ||
              (prize.description &&
                prize.description.toLowerCase().includes(lowercaseQuery))
          )
      );
    } catch (error) {
      console.error('Error searching raffles:', error);
      throw error;
    }
  }

  async getRaffleStats(): Promise<{
    total: number;
    active: number;
    completed: number;
    cancelled: number;
    totalRevenue: number;
  }> {
    try {
      const allRaffles = await this.getAll();

      const stats = {
        total: allRaffles.length,
        active: allRaffles.filter(r => r.status === 'active').length,
        completed: allRaffles.filter(r => r.status === 'completed').length,
        cancelled: allRaffles.filter(r => r.status === 'cancelled').length,
        totalRevenue: allRaffles.reduce((sum, raffle) => {
          const soldTickets = raffle.numbersSold || 0;
          return sum + soldTickets * raffle.pricePerNumber;
        }, 0),
      };

      return stats;
    } catch (error) {
      console.error('Error getting raffle stats:', error);
      throw error;
    }
  }

  async checkDrawEligibility(
    raffleId: string,
    threshold: number = 0.8
  ): Promise<boolean> {
    try {
      const raffle = await this.getById(raffleId);
      if (!raffle) {
        throw new Error('Raffle not found');
      }

      const soldPercentage = raffle.numbersSold / raffle.totalNumbers;
      return soldPercentage >= threshold;
    } catch (error) {
      console.error('Error checking draw eligibility:', error);
      throw error;
    }
  }
}

const raffleService = new RaffleService();
export default raffleService;
