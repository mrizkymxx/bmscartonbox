"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertTriangle } from "lucide-react";
import { deleteUser, UserProfile } from "@/lib/actions/users";
import { toast } from "@/hooks/use-toast";

interface DeleteUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: UserProfile | null;
}

export function DeleteUserDialog({ open, onClose, onSuccess, user }: DeleteUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const result = await deleteUser(user.uid);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
        
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmText("");
    onClose();
  };

  const isDeleteEnabled = confirmText === "DELETE" && user;

  if (!user) return null;

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertDialogTitle>Delete User Account</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-3">
            <div>
              Are you sure you want to permanently delete the user account for{" "}
              <span className="font-semibold">{user.email}</span>?
            </div>
            
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 text-sm">
              <strong>Warning:</strong> This action cannot be undone. This will:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Permanently delete the user account</li>
                <li>Remove all user data from the system</li>
                <li>Revoke all access permissions</li>
                <li>Cannot be recovered</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-delete">
                Type <span className="font-mono font-semibold">DELETE</span> to confirm:
              </Label>
              <Input
                id="confirm-delete"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="font-mono"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose} disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={!isDeleteEnabled || isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete User
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}