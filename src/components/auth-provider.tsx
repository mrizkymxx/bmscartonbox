
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { Skeleton } from "./ui/skeleton";
import { SessionTimeoutDialog } from "./session-timeout-dialog";
import { Package } from "lucide-react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  // Session timeout states
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60); // 60 seconds warning time
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Session timeout duration (30 minutes)
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
  const WARNING_TIME = 60 * 1000; // Show warning 1 minute before timeout

  // Activity detection function
  const resetActivityTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    setShowTimeoutWarning(false);
    setTimeRemaining(60);

    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
    }

    // Set new session timeout
    timeoutRef.current = setTimeout(() => {
      setShowTimeoutWarning(true);

      // Set warning countdown
      warningRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, SESSION_TIMEOUT - WARNING_TIME);
  }, [SESSION_TIMEOUT, WARNING_TIME]);

  // Logout function
  const handleLogout = useCallback(() => {
    // Clear all timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
    }

    // Clear session data
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    setShowTimeoutWarning(false);
    router.push("/login");
  }, [router]);

  // Extend session function
  const extendSession = useCallback(() => {
    setShowTimeoutWarning(false);
    setTimeRemaining(60);
    resetActivityTimer();
  }, [resetActivityTimer]);

  useEffect(() => {
    try {
      const storedLoginStatus = localStorage.getItem("isLoggedIn");
      const sessionIsLoggedIn = storedLoginStatus === "true";

      setIsLoggedIn(sessionIsLoggedIn);

      if (!sessionIsLoggedIn && pathname !== "/login") {
        router.push("/login");
      } else if (sessionIsLoggedIn && pathname === "/login") {
        router.push("/");
      }
    } catch (error) {
        // If localStorage is not available, default to not logged in
        setIsLoggedIn(false);
        if (pathname !== "/login") {
            router.push("/login");
        }
    }
  }, [pathname, router]);

  // Initialize session timeout when user is logged in
  useEffect(() => {
    if (isLoggedIn && pathname !== "/login") {
      resetActivityTimer();

      // Add activity event listeners
      const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

      const handleActivity = () => {
        resetActivityTimer();
      };

      activityEvents.forEach(event => {
        document.addEventListener(event, handleActivity, true);
      });

      // Cleanup function
      return () => {
        activityEvents.forEach(event => {
          document.removeEventListener(event, handleActivity, true);
        });
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        if (warningRef.current) {
          clearTimeout(warningRef.current);
        }
      };
    }
  }, [isLoggedIn, pathname, resetActivityTimer]);

  // While checking auth, show a loading state
  if (isLoggedIn === null) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto ring-1 ring-border/30">
            <Package className="w-4 h-4 text-primary" />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">Loading...</div>
            <div className="text-xs text-muted-foreground">Please wait</div>
          </div>
        </div>
      </div>
    );
  }

  // If on the login page, render it without the main app layout
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // If logged in and not on the login page, render the children (the main app)
  if (isLoggedIn) {
    return (
      <>
        {children}
        <SessionTimeoutDialog
          open={showTimeoutWarning}
          timeRemaining={timeRemaining}
          onExtend={extendSession}
          onLogout={handleLogout}
        />
      </>
    );
  }

  // This case should ideally not be reached due to the redirects, but serves as a fallback.
  return null;
}
