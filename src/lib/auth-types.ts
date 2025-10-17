// Role-based access control types and utilities

export enum UserRole {
  ADMIN = 'admin',
  VIEWER = 'viewer'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  lastLogin: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Permission definitions
export const PERMISSIONS = {
  // Customer permissions
  CUSTOMERS_VIEW: 'customers:view',
  CUSTOMERS_CREATE: 'customers:create',
  CUSTOMERS_EDIT: 'customers:edit',
  CUSTOMERS_DELETE: 'customers:delete',
  
  // Purchase Order permissions
  PO_VIEW: 'po:view',
  PO_CREATE: 'po:create',
  PO_EDIT: 'po:edit',
  PO_DELETE: 'po:delete',
  
  // Production permissions
  PRODUCTION_VIEW: 'production:view',
  PRODUCTION_UPDATE: 'production:update',
  
  // Delivery permissions
  DELIVERY_VIEW: 'delivery:view',
  DELIVERY_CREATE: 'delivery:create',
  DELIVERY_EDIT: 'delivery:edit',
  DELIVERY_DELETE: 'delivery:delete',
  
  // Settings permissions
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Role-permission mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // Full access to everything
    PERMISSIONS.CUSTOMERS_VIEW,
    PERMISSIONS.CUSTOMERS_CREATE,
    PERMISSIONS.CUSTOMERS_EDIT,
    PERMISSIONS.CUSTOMERS_DELETE,
    PERMISSIONS.PO_VIEW,
    PERMISSIONS.PO_CREATE,
    PERMISSIONS.PO_EDIT,
    PERMISSIONS.PO_DELETE,
    PERMISSIONS.PRODUCTION_VIEW,
    PERMISSIONS.PRODUCTION_UPDATE,
    PERMISSIONS.DELIVERY_VIEW,
    PERMISSIONS.DELIVERY_CREATE,
    PERMISSIONS.DELIVERY_EDIT,
    PERMISSIONS.DELIVERY_DELETE,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_EDIT,
  ],
  [UserRole.VIEWER]: [
    // Read-only access
    PERMISSIONS.CUSTOMERS_VIEW,
    PERMISSIONS.PO_VIEW,
    PERMISSIONS.PRODUCTION_VIEW,
    PERMISSIONS.DELIVERY_VIEW,
    PERMISSIONS.SETTINGS_VIEW,
  ],
};

// Check if user has permission
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false;
}

// Check if user can perform CRUD operations
export function canCreate(userRole: UserRole, resource: string): boolean {
  const permission = `${resource}:create` as Permission;
  return hasPermission(userRole, permission);
}

export function canEdit(userRole: UserRole, resource: string): boolean {
  const permission = `${resource}:edit` as Permission;
  return hasPermission(userRole, permission);
}

export function canDelete(userRole: UserRole, resource: string): boolean {
  const permission = `${resource}:delete` as Permission;
  return hasPermission(userRole, permission);
}

export function canView(userRole: UserRole, resource: string): boolean {
  const permission = `${resource}:view` as Permission;
  return hasPermission(userRole, permission);
}

// Predefined users (for now, later can be moved to database)
export const USERS: Record<string, User> = {
  admin: {
    id: 'admin-001',
    email: 'admin@bsmcarton.com',
    name: 'Administrator',
    role: UserRole.ADMIN,
    createdAt: '2025-01-01T00:00:00Z',
    lastLogin: new Date().toISOString(),
  },
  viewer: {
    id: 'viewer-001', 
    email: 'viewer@bsmcarton.com',
    name: 'Viewer User',
    role: UserRole.VIEWER,
    createdAt: '2025-01-01T00:00:00Z',
    lastLogin: new Date().toISOString(),
  },
};

// Login credentials (temporary - should be replaced with proper auth later)
export const LOGIN_CREDENTIALS = {
  admin: {
    username: 'admin',
    password: 'admin123',
    user: USERS.admin,
  },
  viewer: {
    username: 'viewer', 
    password: 'viewer123',
    user: USERS.viewer,
  },
} as const;

export type LoginCredentialKey = keyof typeof LOGIN_CREDENTIALS;