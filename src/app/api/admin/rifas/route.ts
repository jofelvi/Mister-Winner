import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-utils';
import { FirestoreService } from '@/services/genericServices';
import { Raffle } from '@/types';

const raffleService = new FirestoreService<Raffle>('raffles');

export async function GET(request: NextRequest) {
  const authResult = await withAuth(request, 'admin');

  if (authResult.error) {
    return authResult.error;
  }

  try {
    const raffles = await raffleService.getAll();
    return NextResponse.json(raffles);
  } catch (error) {
    console.error('Error fetching raffles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch raffles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await withAuth(request, 'admin');

  if (authResult.error) {
    return authResult.error;
  }

  try {
    const raffleData = await request.json();

    // Add audit info
    const enrichedRaffle = {
      ...raffleData,
      createdBy: authResult.user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newRaffle = await raffleService.create(enrichedRaffle);
    return NextResponse.json(newRaffle, { status: 201 });
  } catch (error) {
    console.error('Error creating raffle:', error);
    return NextResponse.json(
      { error: 'Failed to create raffle' },
      { status: 500 }
    );
  }
}
