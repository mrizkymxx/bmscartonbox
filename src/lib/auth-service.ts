import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User, UserRole } from './auth-types';
import { logger } from './logger';

// Enhanced user document structure in Firestore
interface UserDocument {
  email: string;
  name: string;
  role: UserRole;
  createdAt: any; // Firestore timestamp
  lastLogin: any; // Firestore timestamp
  isActive: boolean;
  metadata?: {
    lastLoginIP?: string;
    loginCount?: number;
  };
}

export class AuthService {
  /**
   * Create a new user with role assignment
   */
  async createUser(
    email: string, 
    password: string, 
    name: string, 
    role: UserRole = UserRole.VIEWER
  ): Promise<User> {
    try {
      logger.info('Creating new user', { email, role });
      
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update profile with display name
      await updateProfile(firebaseUser, { displayName: name });

      // Create user document in Firestore
      const userDoc: UserDocument = {
        email,
        name,
        role,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        isActive: true,
        metadata: {
          loginCount: 1
        }
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userDoc);

      logger.info('User created successfully', { uid: firebaseUser.uid, email });

      return {
        id: firebaseUser.uid,
        email,
        name,
        role,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Failed to create user', error, { email });
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  /**
   * Sign in user with email and password
   */
  async signIn(email: string, password: string): Promise<User> {
    try {
      logger.info('User attempting to sign in', { email });
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Get user document from Firestore
      const userDoc = await this.getUserDocument(firebaseUser.uid);
      
      if (!userDoc.isActive) {
        throw new Error('Account is deactivated. Please contact administrator.');
      }

      // Update last login
      await this.updateLastLogin(firebaseUser.uid);

      logger.info('User signed in successfully', { uid: firebaseUser.uid, email });

      return {
        id: firebaseUser.uid,
        email: userDoc.email,
        name: userDoc.name,
        role: userDoc.role,
        createdAt: userDoc.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Sign in failed', error, { email });
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (user) {
        logger.info('User signing out', { uid: user.uid });
      }
      
      await signOut(auth);
      logger.info('User signed out successfully');
    } catch (error: any) {
      logger.error('Sign out failed', error);
      throw new Error('Failed to sign out');
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<void> {
    try {
      logger.info('Password reset requested', { email });
      await sendPasswordResetEmail(auth, email);
      logger.info('Password reset email sent', { email });
    } catch (error: any) {
      logger.error('Password reset failed', error, { email });
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userDoc = await this.getUserDocument(firebaseUser.uid);
          const user: User = {
            id: firebaseUser.uid,
            email: userDoc.email,
            name: userDoc.name,
            role: userDoc.role,
            createdAt: userDoc.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            lastLogin: userDoc.lastLogin?.toDate?.()?.toISOString() || new Date().toISOString(),
          };
          callback(user);
        } catch (error) {
          logger.error('Failed to get user document', error as Error, { uid: firebaseUser.uid });
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  /**
   * Get user document from Firestore
   */
  private async getUserDocument(uid: string): Promise<UserDocument> {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);
    
    if (!userDocSnap.exists()) {
      throw new Error('User document not found');
    }
    
    return userDocSnap.data() as UserDocument;
  }

  /**
   * Update user's last login timestamp
   */
  private async updateLastLogin(uid: string): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const currentCount = userDoc.data()?.metadata?.loginCount || 0;
        await setDoc(userDocRef, {
          lastLogin: serverTimestamp(),
          metadata: {
            ...userDoc.data()?.metadata,
            loginCount: currentCount + 1
          }
        }, { merge: true });
      }
    } catch (error) {
      logger.error('Failed to update last login', error as Error, { uid });
      // Don't throw error as this is not critical for auth flow
    }
  }

  /**
   * Convert Firebase error codes to user-friendly messages
   */
  private getAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/invalid-email':
        return 'Invalid email address format.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      default:
        return 'Authentication failed. Please try again.';
    }
  }
}

// Export singleton instance
export const authService = new AuthService();