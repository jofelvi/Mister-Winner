import FirestoreService from './genericServices';
import { Winner } from '@/types';

class WinnerService extends FirestoreService<Winner> {
  constructor() {
    super('winners');
  }

  async createWinner(
    winnerData: Omit<Winner, 'id' | 'createdAt'>
  ): Promise<Winner> {
    try {
      const enrichedWinner: Omit<Winner, 'id'> = {
        ...winnerData,
        createdAt: new Date(),
      };

      return await this.create(enrichedWinner);
    } catch (error) {
      console.error('Error creating winner:', error);
      throw error;
    }
  }

  async getWinnersByRaffle(raffleId: string): Promise<Winner[]> {
    try {
      const allWinners = await this.getAll();
      return allWinners.filter(winner => winner.raffleId === raffleId);
    } catch (error) {
      console.error('Error getting winners by raffle:', error);
      throw error;
    }
  }

  async getRecentWinners(limit: number = 5): Promise<Winner[]> {
    try {
      const allWinners = await this.getAll();
      return allWinners
        .sort(
          (a, b) =>
            new Date(b.drawDate || '').getTime() -
            new Date(a.drawDate || '').getTime()
        )
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting recent winners:', error);
      throw error;
    }
  }

  async getWinnersByUser(userId: string): Promise<Winner[]> {
    try {
      const allWinners = await this.getAll();
      return allWinners.filter(winner => winner.userId === userId);
    } catch (error) {
      console.error('Error getting winners by user:', error);
      throw error;
    }
  }

  async getWinnersByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<Winner[]> {
    try {
      const allWinners = await this.getAll();
      return allWinners.filter(winner => {
        if (!winner.drawDate) return false;
        const drawDate = new Date(winner.drawDate);
        return drawDate >= startDate && drawDate <= endDate;
      });
    } catch (error) {
      console.error('Error getting winners by date range:', error);
      throw error;
    }
  }

  async getTotalPrizesAwarded(): Promise<number> {
    try {
      const allWinners = await this.getAll();
      return allWinners.reduce(
        (total, winner) => total + winner.prizeAmount,
        0
      );
    } catch (error) {
      console.error('Error getting total prizes awarded:', error);
      throw error;
    }
  }

  async getWinnerStats(): Promise<{
    totalWinners: number;
    totalPrizesAwarded: number;
    averagePrize: number;
    biggestPrize: number;
    winnersThisMonth: number;
  }> {
    try {
      const allWinners = await this.getAll();
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const winnersThisMonth = allWinners.filter(winner => {
        if (!winner.drawDate) return false;
        const drawDate = new Date(winner.drawDate);
        return (
          drawDate.getMonth() === currentMonth &&
          drawDate.getFullYear() === currentYear
        );
      }).length;

      const totalPrizesAwarded = allWinners.reduce(
        (total, winner) => total + winner.prizeAmount,
        0
      );
      const averagePrize =
        allWinners.length > 0 ? totalPrizesAwarded / allWinners.length : 0;
      const biggestPrize =
        allWinners.length > 0
          ? Math.max(...allWinners.map(w => w.prizeAmount))
          : 0;

      return {
        totalWinners: allWinners.length,
        totalPrizesAwarded,
        averagePrize,
        biggestPrize,
        winnersThisMonth,
      };
    } catch (error) {
      console.error('Error getting winner stats:', error);
      throw error;
    }
  }

  async searchWinners(query: string): Promise<Winner[]> {
    try {
      const allWinners = await this.getAll();
      const lowercaseQuery = query.toLowerCase();

      return allWinners.filter(
        winner =>
          winner.name.toLowerCase().includes(lowercaseQuery) ||
          winner.raffleTitle.toLowerCase().includes(lowercaseQuery) ||
          winner.winningNumber.includes(query) ||
          (winner.prizeName &&
            winner.prizeName.toLowerCase().includes(lowercaseQuery))
      );
    } catch (error) {
      console.error('Error searching winners:', error);
      throw error;
    }
  }

  async markPrizeDelivered(
    winnerId: string,
    deliveredAt?: Date
  ): Promise<void> {
    try {
      const updates = {
        prizeDelivered: true,
        prizeDeliveredAt: deliveredAt || new Date(),
        updatedAt: new Date(),
      };

      return await this.update(winnerId, updates);
    } catch (error) {
      console.error('Error marking prize as delivered:', error);
      throw error;
    }
  }

  async getPendingDeliveries(): Promise<Winner[]> {
    try {
      const allWinners = await this.getAll();
      return allWinners.filter(winner => !winner.prizeDelivered);
    } catch (error) {
      console.error('Error getting pending deliveries:', error);
      throw error;
    }
  }
}

const winnerService = new WinnerService();
export default winnerService;
