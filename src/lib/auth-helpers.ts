'use server';

import { auth } from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/lib/firebase-admin';
import { logger } from '@/lib/logger';
import { UserRole } from '@/lib/types';
import { headers } from 'next/headers';

// Initialize Firebase Admin
initializeFirebaseAdmin();
const db = getFirestore();

export interface CurrentUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  disabled: boolean;
  emailVerified: boolean;
}

/**
 * Get current authenticated user from session/token
 * This is a server-side function that validates the current user
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    // In a real implementation, you would get this from:
    // 1. Session cookie
    // 2. Authorization header
    // 3. Firebase Auth token verification
    
    // For now, we'll simulate getting user from auth context
    // This would typically come from middleware or auth verification
    
    // Get authorization header
    const headersList = await headers();
    const authorization = headersList.get('authorization');
    
    if (!authorization) {
      logger.info('No authorization header found');
      return null;
    }

    // Extract token from "Bearer <token>"
    const token = authorization.replace('Bearer ', '');
    
    if (!token) {
      logger.info('No token found in authorization header');
      return null;
    }

    // Verify the token with Firebase Admin
    const decodedToken = await auth().verifyIdToken(token);
    
    if (!decodedToken) {
      logger.info('Invalid token');
      return null;
    }

    // Get user record from Firebase Auth
    const userRecord = await auth().getUser(decodedToken.uid);
    
    // Get user profile from Firestore
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.data();

    if (!userData) {
      logger.warn('User profile not found in Firestore for UID: ' + decodedToken.uid);
      return null;
    }

    return {
      uid: userRecord.uid,
      email: userRecord.email || '',
      displayName: userRecord.displayName || userData.displayName || '',
      role: userData.role || 'viewer',
      disabled: userRecord.disabled,
      emailVerified: userRecord.emailVerified,
    };

  } catch (error: any) {
    logger.error('Error getting current user: ' + (error.message || error));
    return null;
  }
}

/**
 * Check if current user has required permission
 */
export async function hasPermission(requiredRole: UserRole): Promise<boolean> {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return false;
    }

    // Role hierarchy: admin > editor > viewer
    const roleHierarchy: Record<UserRole, number> = {
      'admin': 3,
      'editor': 2,
      'viewer': 1,
    };

    const userLevel = roleHierarchy[currentUser.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    return userLevel >= requiredLevel;

  } catch (error: any) {
    logger.error('Error checking permission: ' + (error.message || error));
    return false;
  }
}

/**
 * Require admin permission - throws error if not admin
 */
export async function requireAdmin(): Promise<CurrentUser> {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    throw new Error('Authentication required');
  }

  if (currentUser.role !== 'admin') {
    throw new Error('Admin permission required');
  }

  return currentUser;
}

/**
 * Require editor or higher permission
 */
export async function requireEditor(): Promise<CurrentUser> {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    throw new Error('Authentication required');
  }

  if (currentUser.role !== 'admin' && currentUser.role !== 'editor') {
    throw new Error('Editor permission required');
  }

  return currentUser;
}

/**
 * Get user role for client-side checks (simplified version)
 * This version works without token verification for client components
 */
export async function getUserRole(uid: string): Promise<UserRole | null> {
  try {
    const userDoc = await db.collection('users').doc(uid).get();
    const userData = userDoc.data();
    
    return userData?.role || null;
  } catch (error: any) {
    logger.error('Error getting user role: ' + (error.message || error));
    return null;
  }
}