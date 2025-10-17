"use client";

import { useAuth } from "@/contexts/auth-context";
import { UserRole } from "@/lib/types";
import { ReactNode, useEffect, useState } from "react";
import { getUserRole } from "@/lib/auth-helpers";

interface RoleGuardProps {
  children: ReactNode;
  requiredRole: UserRole;
  fallback?: ReactNode;
}

/**
 * Component that renders children only if user has required role
 */
export function RoleGuard({ children, requiredRole, fallback = null }: RoleGuardProps) {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUserRole() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const role = await getUserRole(user.id);
        setUserRole(role);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    }

    checkUserRole();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !userRole) {
    return <>{fallback}</>;
  }

  // Role hierarchy check
  const roleHierarchy: Record<UserRole, number> = {
    'admin': 3,
    'editor': 2,
    'viewer': 1,
  };

  const userLevel = roleHierarchy[userRole] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;

  if (userLevel >= requiredLevel) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

/**
 * Hook to check if current user has required role
 */
export function useRole(requiredRole?: UserRole) {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUserRole() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const role = await getUserRole(user.id);
        setUserRole(role);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    }

    checkUserRole();
  }, [user]);

  const hasRequiredRole = (role: UserRole) => {
    if (!userRole) return false;

    const roleHierarchy: Record<UserRole, number> = {
      'admin': 3,
      'editor': 2,
      'viewer': 1,
    };

    const userLevel = roleHierarchy[userRole] || 0;
    const requiredLevel = roleHierarchy[role] || 0;

    return userLevel >= requiredLevel;
  };

  return {
    userRole,
    loading,
    isAdmin: userRole === 'admin',
    isEditor: hasRequiredRole('editor'),
    isViewer: hasRequiredRole('viewer'),
    hasRole: hasRequiredRole,
    hasRequiredRole: requiredRole ? hasRequiredRole(requiredRole) : true,
  };
}