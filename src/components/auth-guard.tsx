"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Package } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect during loading
    if (isLoading) return;

    // Allow access to login page
    if (pathname === '/login') {
      if (isAuthenticated) {
        // Redirect authenticated users away from login page
        router.push('/');
      }
      return;
    }

    // Redirect unauthenticated users to login
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto ring-1 ring-border/30">
            <Package className="w-4 h-4 text-primary animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">Loading...</div>
            <div className="text-xs text-muted-foreground">Please wait</div>
          </div>
        </div>
      </div>
    );
  }

  // Show login page for unauthenticated users
  if (!isAuthenticated && pathname === '/login') {
    return <>{children}</>;
  }

  // Don't render anything for unauthenticated users on protected pages
  if (!isAuthenticated && pathname !== '/login') {
    return null;
  }

  // Render children for authenticated users
  return <>{children}</>;
}