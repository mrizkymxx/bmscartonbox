'use server';

import { auth } from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/lib/firebase-admin';
import { logger } from '@/lib/logger';
import { DatabaseError } from '@/lib/errors';
import { UserRole } from '@/lib/types';

// Initialize Firebase Admin
initializeFirebaseAdmin();
const db = getFirestore();

export interface CreateUserData {
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
  phoneNumber?: string;
  department?: string;
}

export interface UpdateUserData {
  displayName?: string;
  role?: UserRole;
  phoneNumber?: string;
  department?: string;
  disabled?: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phoneNumber?: string;
  department?: string;
  disabled: boolean;
  emailVerified: boolean;
  createdAt: Date;
  lastSignInTime?: Date;
}

/**
 * Create a new user account
 */
export async function createUser(userData: CreateUserData) {
  try {
    logger.info('Creating new user', { email: userData.email });

    // Create user in Firebase Auth
    const userRecord = await auth().createUser({
      email: userData.email,
      password: userData.password,
      displayName: userData.displayName,
      emailVerified: false,
    });

    // Create user profile in Firestore
    const userProfile = {
      uid: userRecord.uid,
      email: userData.email,
      displayName: userData.displayName,
      role: userData.role,
      phoneNumber: userData.phoneNumber || '',
      department: userData.department || '',
      disabled: false,
      emailVerified: false,
      createdAt: new Date(),
    };

    await db.collection('users').doc(userRecord.uid).set(userProfile);

    logger.info('User created successfully', { uid: userRecord.uid });
    
    return {
      success: true,
      data: {
        uid: userRecord.uid,
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role,
      },
      message: 'User created successfully'
    };

  } catch (error: any) {
    logger.error('Error creating user: ' + (error.message || error));
    
    let message = 'Failed to create user';
    if (error.code === 'auth/email-already-exists') {
      message = 'Email already exists';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Invalid email format';
    } else if (error.code === 'auth/weak-password') {
      message = 'Password is too weak';
    }

    throw new DatabaseError(message);
  }
}

/**
 * Get all users with pagination
 */
export async function getUsers(pageSize: number = 10, nextPageToken?: string) {
  try {
    logger.info('Fetching users list');

    // Get users from Firebase Auth
    const listUsersResult = await auth().listUsers(pageSize, nextPageToken);
    
    // Get user profiles from Firestore
    const userProfiles: UserProfile[] = [];
    
    for (const userRecord of listUsersResult.users) {
      try {
        const userDoc = await db.collection('users').doc(userRecord.uid).get();
        const userData = userDoc.data();
        
        if (userData) {
          userProfiles.push({
            uid: userRecord.uid,
            email: userRecord.email || '',
            displayName: userRecord.displayName || userData.displayName || '',
            role: userData.role || 'viewer',
            phoneNumber: userData.phoneNumber || '',
            department: userData.department || '',
            disabled: userRecord.disabled,
            emailVerified: userRecord.emailVerified,
            createdAt: userData.createdAt?.toDate() || new Date(userRecord.metadata.creationTime),
            lastSignInTime: userRecord.metadata.lastSignInTime ? new Date(userRecord.metadata.lastSignInTime) : undefined,
          });
        }
      } catch (docError) {
        logger.warn('Error fetching profile for user ' + userRecord.uid + ': ' + (docError as any).message);
        // Add user even if profile is missing
        userProfiles.push({
          uid: userRecord.uid,
          email: userRecord.email || '',
          displayName: userRecord.displayName || '',
          role: 'viewer',
          disabled: userRecord.disabled,
          emailVerified: userRecord.emailVerified,
          createdAt: new Date(userRecord.metadata.creationTime),
          lastSignInTime: userRecord.metadata.lastSignInTime ? new Date(userRecord.metadata.lastSignInTime) : undefined,
        });
      }
    }

    return {
      success: true,
      data: userProfiles,
      nextPageToken: listUsersResult.pageToken,
      hasMore: !!listUsersResult.pageToken,
    };

  } catch (error: any) {
    logger.error('Error fetching users: ' + (error.message || error));
    throw new DatabaseError('Failed to fetch users');
  }
}

/**
 * Update user information
 */
export async function updateUser(uid: string, updateData: UpdateUserData) {
  try {
    logger.info('Updating user: ' + uid);

    // Update Firebase Auth user
    const authUpdateData: any = {};
    if (updateData.displayName) {
      authUpdateData.displayName = updateData.displayName;
    }
    if (updateData.disabled !== undefined) {
      authUpdateData.disabled = updateData.disabled;
    }

    if (Object.keys(authUpdateData).length > 0) {
      await auth().updateUser(uid, authUpdateData);
    }

    // Update Firestore profile
    const firestoreUpdateData: any = {};
    if (updateData.displayName) firestoreUpdateData.displayName = updateData.displayName;
    if (updateData.role) firestoreUpdateData.role = updateData.role;
    if (updateData.phoneNumber !== undefined) firestoreUpdateData.phoneNumber = updateData.phoneNumber;
    if (updateData.department !== undefined) firestoreUpdateData.department = updateData.department;
    
    firestoreUpdateData.updatedAt = new Date();

    if (Object.keys(firestoreUpdateData).length > 0) {
      await db.collection('users').doc(uid).update(firestoreUpdateData);
    }

    logger.info('User updated successfully: ' + uid);
    
    return {
      success: true,
      message: 'User updated successfully'
    };

  } catch (error: any) {
    logger.error('Error updating user: ' + (error.message || error));
    
    let message = 'Failed to update user';
    if (error.code === 'auth/user-not-found') {
      message = 'User not found';
    }

    throw new DatabaseError(message);
  }
}

/**
 * Delete user account
 */
export async function deleteUser(uid: string) {
  try {
    logger.info('Deleting user: ' + uid);

    // Delete from Firebase Auth
    await auth().deleteUser(uid);
    
    // Delete from Firestore
    await db.collection('users').doc(uid).delete();

    logger.info('User deleted successfully: ' + uid);
    
    return {
      success: true,
      message: 'User deleted successfully'
    };

  } catch (error: any) {
    logger.error('Error deleting user: ' + (error.message || error));
    
    let message = 'Failed to delete user';
    if (error.code === 'auth/user-not-found') {
      message = 'User not found';
    }

    throw new DatabaseError(message);
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string) {
  try {
    logger.info('Sending password reset email to: ' + email);
    
    // Generate password reset link
    const resetLink = await auth().generatePasswordResetLink(email);
    
    // In a real app, you would send this via email service
    // For now, we'll just log it or return it
    logger.info('Password reset link generated: ' + resetLink);
    
    return {
      success: true,
      message: 'Password reset email sent',
      resetLink // Remove this in production, send via email instead
    };

  } catch (error: any) {
    logger.error('Error sending password reset email: ' + (error.message || error));
    
    let message = 'Failed to send password reset email';
    if (error.code === 'auth/user-not-found') {
      message = 'No user found with this email';
    }

    throw new DatabaseError(message);
  }
}

/**
 * Get user by UID
 */
export async function getUserById(uid: string): Promise<UserProfile | null> {
  try {
    logger.info('Fetching user by ID: ' + uid);

    // Get from Firebase Auth
    const userRecord = await auth().getUser(uid);
    
    // Get from Firestore
    const userDoc = await db.collection('users').doc(uid).get();
    const userData = userDoc.data();

    if (!userData) {
      return null;
    }

    return {
      uid: userRecord.uid,
      email: userRecord.email || '',
      displayName: userRecord.displayName || userData.displayName || '',
      role: userData.role || 'viewer',
      phoneNumber: userData.phoneNumber || '',
      department: userData.department || '',
      disabled: userRecord.disabled,
      emailVerified: userRecord.emailVerified,
      createdAt: userData.createdAt?.toDate() || new Date(userRecord.metadata.creationTime),
      lastSignInTime: userRecord.metadata.lastSignInTime ? new Date(userRecord.metadata.lastSignInTime) : undefined,
    };

  } catch (error: any) {
    logger.error('Error fetching user by ID: ' + (error.message || error));
    
    if (error.code === 'auth/user-not-found') {
      return null;
    }
    
    throw new DatabaseError('Failed to fetch user');
  }
}