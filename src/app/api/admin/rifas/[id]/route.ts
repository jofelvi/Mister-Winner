import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-utils';
import { FirestoreService } from '@/services/genericServices';
import { Raffle } from '@/types';

const raffleService = new FirestoreService<Raffle>('raffles');

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await withAuth(request, 'admin');
  
  if (authResult.error) {
    return authResult.error;
  }

  try {
    const raffle = await raffleService.getById(params.id);
    
    if (!raffle) {
      return NextResponse.json(
        { error: 'Raffle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(raffle);
  } catch (error) {
    console.error('Error fetching raffle:', error);
    return NextResponse.json(
      { error: 'Failed to fetch raffle' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await withAuth(request, 'admin');
  
  if (authResult.error) {
    return authResult.error;
  }

  try {
    const updates = await request.json();
    
    // Add audit info
    const enrichedUpdates = {
      ...updates,
      updatedBy: authResult.user.uid,
      updatedAt: new Date().toISOString(),
    };

    const updatedRaffle = await raffleService.update(params.id, enrichedUpdates);
    return NextResponse.json(updatedRaffle);
  } catch (error) {
    console.error('Error updating raffle:', error);
    return NextResponse.json(
      { error: 'Failed to update raffle' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await withAuth(request, 'admin');
  
  if (authResult.error) {
    return authResult.error;
  }

  try {
    await raffleService.delete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting raffle:', error);
    return NextResponse.json(
      { error: 'Failed to delete raffle' },
      { status: 500 }
    );
  }
}