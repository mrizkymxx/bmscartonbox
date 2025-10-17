"use client";

import { useAuth } from '@/contexts/auth-context';
import { ReactNode } from 'react';

interface ProtectedActionProps {
  resource: string;
  action: 'create' | 'edit' | 'update' | 'delete' | 'view';
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProtectedAction({ 
  resource, 
  action, 
  children, 
  fallback = null 
}: ProtectedActionProps) {
  const { canCreate, canEdit, canUpdate, canDelete, canView } = useAuth();

  let hasAccess = false;
  
  switch (action) {
    case 'create':
      hasAccess = canCreate(resource);
      break;
    case 'edit':
      hasAccess = canEdit(resource);
      break;
    case 'update':
      hasAccess = canUpdate(resource);
      break;
    case 'delete':
      hasAccess = canDelete(resource);
      break;
    case 'view':
      hasAccess = canView(resource);
      break;
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface RoleBasedProps {
  allowedRoles: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleBased({ allowedRoles, children, fallback = null }: RoleBasedProps) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}