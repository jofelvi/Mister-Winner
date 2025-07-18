import { FirestoreService } from '@/services/genericServices';
import { UserProfile } from '@/types';

export interface AuthTokenPayload {
  uid: string;
  email?: string;
  role?: string;
}

/**
 * Verifies Firebase ID token and returns user data with role
 * This should be used in API routes to verify authentication and authorization
 */
export async function verifyAuthToken(
  authHeader?: string
): Promise<AuthTokenPayload | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    // In a real implementation, you would verify the token server-side
    // For now, we'll trust the client token but this needs Firebase Admin SDK
    // TODO: Implement server-side token verification with Firebase Admin SDK

    // This is a placeholder - in production you need Firebase Admin SDK
    const decodedToken = JSON.parse(atob(token.split('.')[1]));

    if (!decodedToken.uid) {
      return null;
    }

    // Get user profile from Firestore to check role
    const userService = new FirestoreService<UserProfile>('users');
    const userProfile = await userService.getById(decodedToken.uid);

    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: userProfile?.role || 'user',
    };
  } catch (error) {
    console.error('Error verifying auth token:', error);
    return null;
  }
}

/**
 * Checks if user has admin role
 */
export function isAdmin(user: AuthTokenPayload | null): boolean {
  return user?.role === 'admin';
}

/**
 * Checks if user has agent or admin role
 */
export function isAgent(user: AuthTokenPayload | null): boolean {
  return user?.role === 'agent' || user?.role === 'admin';
}

/**
 * Creates authorization error response
 */
export function createUnauthorizedResponse(message = 'Unauthorized'): Response {
  return new Response(JSON.stringify({ error: message }), {
    status: 403,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Creates authentication error response
 */
export function createUnauthenticatedResponse(
  message = 'Authentication required'
): Response {
  return new Response(JSON.stringify({ error: message }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Middleware function to protect API routes
 */
export async function withAuth(
  request: Request,
  requiredRole?: 'user' | 'agent' | 'admin'
): Promise<
  { user: AuthTokenPayload; error?: never } | { user?: never; error: Response }
> {
  const authHeader = request.headers.get('Authorization');
  const user = await verifyAuthToken(authHeader || undefined);

  if (!user) {
    return { error: createUnauthenticatedResponse() };
  }

  if (requiredRole) {
    const hasAccess =
      requiredRole === 'user'
        ? true
        : requiredRole === 'agent'
          ? isAgent(user)
          : requiredRole === 'admin'
            ? isAdmin(user)
            : false;

    if (!hasAccess) {
      return {
        error: createUnauthorizedResponse(`${requiredRole} role required`),
      };
    }
  }

  return { user };
}
