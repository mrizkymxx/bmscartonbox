"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, UserRole } from '@/lib/auth-types';
import { authService } from '@/lib/auth-service';
import { logger } from '@/lib/logger';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  canCreate: (resource: string) => boolean;
  canEdit: (resource: string) => boolean;
  canUpdate: (resource: string) => boolean;
  canDelete: (resource: string) => boolean;
  canView: (resource: string) => boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const [error, setError] = useState<string | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    logger.info('Setting up auth state listener');
    
    const unsubscribe = authService.onAuthStateChange((user: User | null) => {
      logger.info('Auth state changed', { user: user ? { id: user.id, email: user.email, role: user.role } : null });
      
      setAuthState({
        user,
        isAuthenticated: !!user,
        isLoading: false,
      });
    });

    return () => {
      logger.info('Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      logger.info('Login attempt', { email });
      const user = await authService.signIn(email, password);
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      logger.info('Login successful', { userId: user.id });
      return true;
    } catch (error: any) {
      logger.error('Login failed', error as Error, { email });
      setError(error.message);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setError(null);
      logger.info('Logout attempt');
      
      await authService.signOut();
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      logger.info('Logout successful');
    } catch (error: any) {
      logger.error('Logout failed', error as Error);
      setError(error.message);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      setError(null);
      logger.info('Password reset attempt', { email });
      
      await authService.resetPassword(email);
      
      logger.info('Password reset email sent', { email });
    } catch (error: any) {
      logger.error('Password reset failed', error as Error, { email });
      setError(error.message);
      throw error;
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Permission checking functions
  const hasPermission = (permission: string): boolean => {
    if (!authState.user) return false;
    
    const { ROLE_PERMISSIONS } = require('@/lib/auth-types');
    const userPermissions = ROLE_PERMISSIONS[authState.user.role] || [];
    return userPermissions.includes(permission);
  };

  const canCreate = (resource: string): boolean => {
    return hasPermission(`${resource}:create`);
  };

  const canEdit = (resource: string): boolean => {
    return hasPermission(`${resource}:edit`);
  };

  const canUpdate = (resource: string): boolean => {
    return hasPermission(`${resource}:update`);
  };

  const canDelete = (resource: string): boolean => {
    return hasPermission(`${resource}:delete`);
  };

  const canView = (resource: string): boolean => {
    return hasPermission(`${resource}:view`);
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    resetPassword,
    hasPermission,
    canCreate,
    canEdit,
    canUpdate,
    canDelete,
    canView,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}