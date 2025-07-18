import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-utils';
import FirestoreService from '@/services/genericServices';
import { UserProfile } from '@/types';

const userService = new FirestoreService<UserProfile>('users');

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await withAuth(request, 'admin');

  if (authResult.error) {
    return authResult.error;
  }

  try {
    const { role } = await request.json();

    // Validate role
    if (!['user', 'agent', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be user, agent, or admin' },
        { status: 400 }
      );
    }

    // Prevent admins from changing their own role
    if (params.id === authResult.user.uid) {
      return NextResponse.json(
        { error: 'Cannot change your own role' },
        { status: 400 }
      );
    }

    // Update user role
    const updates = {
      role,
      updatedBy: authResult.user.uid,
      updatedAt: new Date().toISOString(),
    };

    const updatedUser = await userService.update(params.id, updates);

    // TODO: Update Firebase Auth custom claims here
    // This requires Firebase Admin SDK implementation

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    );
  }
}
