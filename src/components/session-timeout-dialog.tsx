"use client";

import { useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SessionTimeoutDialogProps {
  open: boolean;
  timeRemaining: number;
  onExtend: () => void;
  onLogout: () => void;
}

export function SessionTimeoutDialog({
  open,
  timeRemaining,
  onExtend,
  onLogout,
}: SessionTimeoutDialogProps) {
  useEffect(() => {
    if (open && timeRemaining === 0) {
      onLogout();
    }
  }, [open, timeRemaining, onLogout]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-sm bg-card border-border shadow-lg">
        <AlertDialogHeader className="space-y-3">
          <AlertDialogTitle className="flex items-center gap-2 text-foreground">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            Session expiring
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Your session will expire in <strong className="text-foreground font-semibold">{formatTime(timeRemaining)}</strong> due to inactivity.
            <br />
            <br />
            Would you like to extend your session?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogAction
            onClick={onLogout}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
          >
            End session
          </AlertDialogAction>
          <AlertDialogAction
            onClick={onExtend}
            className="bg-foreground text-background hover:bg-foreground/90 shadow-sm"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
