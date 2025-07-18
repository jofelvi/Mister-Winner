import FirestoreService from './genericServices';

export interface UserParticipation {
  id: string;
  userId: string;
  raffleId: string;
  raffleTitle: string;
  numbers: string[];
  totalPaid: number;
  status: 'active' | 'completed' | 'cancelled';
  purchaseDate: string;
  drawDate: string;
  createdAt: string;
  updatedAt: string;
}

class ParticipationService extends FirestoreService<UserParticipation> {
  constructor() {
    super('participations');
  }

  /**
   * Get user participations
   * @param userId - User ID
   * @returns Promise<UserParticipation[]>
   */
  async getUserParticipations(userId: string): Promise<UserParticipation[]> {
    try {
      const participations = await this.getWhere('userId', '==', userId);
      return participations.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error fetching user participations:', error);
      return [];
    }
  }

  /**
   * Get active participations for a user
   * @param userId - User ID
   * @returns Promise<UserParticipation[]>
   */
  async getActiveParticipations(userId: string): Promise<UserParticipation[]> {
    try {
      const participations = await this.getUserParticipations(userId);
      return participations.filter(p => p.status === 'active');
    } catch (error) {
      console.error('Error fetching active participations:', error);
      return [];
    }
  }

  /**
   * Get participation count for a user
   * @param userId - User ID
   * @returns Promise<number>
   */
  async getUserParticipationCount(userId: string): Promise<number> {
    try {
      const participations = await this.getUserParticipations(userId);
      return participations.length;
    } catch (error) {
      console.error('Error fetching participation count:', error);
      return 0;
    }
  }

  /**
   * Create a new participation
   * @param participation - Participation data
   * @returns Promise<UserParticipation>
   */
  async createParticipation(
    participation: Omit<UserParticipation, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<UserParticipation> {
    try {
      const now = new Date().toISOString();
      const newParticipation = {
        ...participation,
        createdAt: now,
        updatedAt: now,
      };

      return await this.create(newParticipation);
    } catch (error) {
      console.error('Error creating participation:', error);
      throw error;
    }
  }

  /**
   * Update participation status
   * @param participationId - Participation ID
   * @param status - New status
   * @returns Promise<UserParticipation>
   */
  async updateParticipationStatus(
    participationId: string,
    status: 'active' | 'completed' | 'cancelled'
  ): Promise<void> {
    try {
      const updates = {
        status,
        updatedAt: new Date().toISOString(),
      };

      return await this.update(participationId, updates);
    } catch (error) {
      console.error('Error updating participation status:', error);
      throw error;
    }
  }
}

const participationService = new ParticipationService();
export default participationService;
