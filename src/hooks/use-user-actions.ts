"use client";

import { useState } from "react";
import { UserProfile, sendPasswordResetEmail, updateUser } from "@/lib/actions/users";
import { toast } from "@/hooks/use-toast";

export function useUserActions() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSendPasswordReset = async (email: string) => {
    setIsLoading(true);
    
    try {
      const result = await sendPasswordResetEmail(email);
      
      if (result.success) {
        toast({
          title: "Password Reset Sent",
          description: `Password reset instructions have been sent to ${email}`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleUserStatus = async (user: UserProfile) => {
    setIsLoading(true);
    
    try {
      const result = await updateUser(user.uid, {
        disabled: !user.disabled
      });
      
      if (result.success) {
        toast({
          title: "Success",
          description: `User account ${user.disabled ? 'enabled' : 'disabled'} successfully`,
        });
        
        // Refresh the page to show updated status
        window.location.reload();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSendPasswordReset,
    handleToggleUserStatus,
  };
}