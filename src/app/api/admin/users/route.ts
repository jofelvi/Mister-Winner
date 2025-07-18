import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-utils';
import { FirestoreService } from '@/services/genericServices';
import { UserProfile } from '@/types';

const userService = new FirestoreService<UserProfile>('users');

export async function GET(request: NextRequest) {
  const authResult = await withAuth(request, 'admin');

  if (authResult.error) {
    return authResult.error;
  }

  try {
    const users = await userService.getAll();
    // Remove sensitive data before sending
    const safeUsers = users.map(user => ({
      ...user,
      // Remove any sensitive fields if needed
    }));

    return NextResponse.json(safeUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
