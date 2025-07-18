import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-utils';
import FirestoreService from '@/services/genericServices';
import { Raffle, UserProfile, Winner } from '@/types';

const raffleService = new FirestoreService<Raffle>('raffles');
const userService = new FirestoreService<UserProfile>('users');
const winnerService = new FirestoreService<Winner>('winners');

export async function GET(request: NextRequest) {
  const authResult = await withAuth(request, 'admin');

  if (authResult.error) {
    return authResult.error;
  }

  try {
    // Get all data for statistics
    const [raffles, users, winners] = await Promise.all([
      raffleService.getAll(),
      userService.getAll(),
      winnerService.getAll(),
    ]);

    // Calculate statistics
    const totalRaffles = raffles.length;
    const activeRaffles = raffles.filter(
      (r: { status: string }) => r.status === 'active'
    ).length;
    const completedRaffles = raffles.filter(
      (r: { status: string }) => r.status === 'completed'
    ).length;

    const totalUsers = users.length;
    const adminUsers = users.filter(
      (u: { role: string }) => u.role === 'admin'
    ).length;
    const agentUsers = users.filter(
      (u: { role: string }) => u.role === 'agent'
    ).length;

    const totalWinners = winners.length;

    // Calculate total revenue (sum of ticket prices sold)
    const totalRevenue = raffles.reduce((sum: number, raffle: any) => {
      const soldTickets = raffle.soldNumbers?.length || 0;
      return sum + soldTickets * raffle.ticketPrice;
    }, 0);

    const stats = {
      raffles: {
        total: totalRaffles,
        active: activeRaffles,
        completed: completedRaffles,
        cancelled: totalRaffles - activeRaffles - completedRaffles,
      },
      users: {
        total: totalUsers,
        regular: totalUsers - adminUsers - agentUsers,
        agents: agentUsers,
        admins: adminUsers,
      },
      financial: {
        totalRevenue,
        totalWinners,
        averageTicketPrice:
          totalRaffles > 0
            ? raffles.reduce((sum: any, r: any) => sum + r.ticketPrice, 0) /
              totalRaffles
            : 0,
      },
      recent: {
        recentRaffles: raffles
          .sort(
            (a: { createdAt: any }, b: { createdAt: any }) =>
              new Date(b.createdAt || '').getTime() -
              new Date(a.createdAt || '').getTime()
          )
          .slice(0, 5),
        recentWinners: winners
          .sort(
            (a: any, b: any) =>
              new Date(b.drawDate || '').getTime() -
              new Date(a.drawDate || '').getTime()
          )
          .slice(0, 5),
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
