'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader } from '@/components/shared/Loader/Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'agent' | 'admin';
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { isAuthenticated, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (!loading && isAuthenticated && requiredRole && userProfile) {
      // Check if user has required role
      const hasRequiredRole =
        requiredRole === 'user' ||
        userProfile.role === requiredRole ||
        (requiredRole === 'agent' && userProfile.role === 'admin') ||
        (requiredRole === 'admin' && userProfile.role === 'admin');

      if (!hasRequiredRole) {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, userProfile, requiredRole, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && userProfile) {
    const hasRequiredRole =
      requiredRole === 'user' ||
      userProfile.role === requiredRole ||
      (requiredRole === 'agent' && userProfile.role === 'admin') ||
      (requiredRole === 'admin' && userProfile.role === 'admin');

    if (!hasRequiredRole) {
      return null;
    }
  }

  return <>{children}</>;
}
