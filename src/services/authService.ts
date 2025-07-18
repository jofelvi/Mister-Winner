import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebase';
import { UserProfile } from '@/types';
import FirestoreService from './genericServices';

class AuthService {
  private userService: FirestoreService<UserProfile>;

  constructor() {
    this.userService = new FirestoreService<UserProfile>('users');
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    ci: string;
    phone: string;
    secondaryPhone?: string;
    referredBy?: string;
  }): Promise<UserProfile> {
    try {
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        );

      await updateProfile(userCredential.user, {
        displayName: `${userData.firstName} ${userData.lastName}`,
      });

      const referralCode = this.generateReferralCode(
        userData.firstName,
        userData.lastName
      );

      const userProfile: Omit<UserProfile, 'id'> = {
        uid: userCredential.user.uid,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        ci: userData.ci,
        phone: userData.phone,
        secondaryPhone: userData.secondaryPhone,
        referralCode,
        referredBy: userData.referredBy,
        points: 0,
        credits: 0,
        role: 'user',
        createdAt: new Date(),
      };

      return await this.userService.createWithId(
        userCredential.user.uid,
        userProfile
      );
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<UserCredential> {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  async getCurrentUserProfile(): Promise<UserProfile | null> {
    try {
      const user = auth.currentUser;
      if (!user) return null;

      return await this.userService.getById(user.uid);
    } catch (error) {
      console.error('Error getting current user profile:', error);
      return null;
    }
  }

  async updateUserProfile(
    updates: Partial<Omit<UserProfile, 'id' | 'uid' | 'createdAt'>>
  ): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user authenticated');

      await this.userService.update(user.uid, updates);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  async updateUserRole(userId: string, role: 'user' | 'agent' | 'admin'): Promise<void> {
    try {
      // Only allow this for admin operations
      const currentUser = await this.getCurrentUserProfile();
      if (!currentUser || currentUser.role !== 'admin') {
        throw new Error('Unauthorized: Admin role required');
      }

      await this.userService.update(userId, { 
        role,
        updatedAt: new Date()
      });

      // TODO: Update Firebase Auth custom claims
      // This requires Firebase Admin SDK implementation
      // await admin.auth().setCustomUserClaims(userId, { role });
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  async getIdToken(): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (!user) return null;
      
      return await user.getIdToken();
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  }

  private generateReferralCode(firstName: string, lastName: string): string {
    const initials =
      `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    const randomNumber = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, '0');
    return `${initials}${randomNumber}`;
  }

  getCurrentUser(): User | null {
    return auth.currentUser;
  }
}

const authService = new AuthService();
export default authService;
