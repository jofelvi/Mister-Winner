'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { UserProfile } from '@/types';
import authService from '@/services/authService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setUser(user);

      if (user) {
        try {
          const profile = await authService.getCurrentUserProfile();
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await authService.login(email, password);
      // El estado se actualizará automáticamente por onAuthStateChanged
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    ci: string;
    phone: string;
    secondaryPhone?: string;
    referredBy?: string;
  }) => {
    setLoading(true);
    try {
      const profile = await authService.register(userData);
      setUserProfile(profile);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      // El estado se actualizará automáticamente por onAuthStateChanged
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await authService.resetPassword(email);
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    userProfile,
    loading,
    login,
    register,
    logout,
    resetPassword,
    isAuthenticated: !!user,
    isAdmin: userProfile?.role === 'admin',
    isAgent: userProfile?.role === 'agent',
  };
};
