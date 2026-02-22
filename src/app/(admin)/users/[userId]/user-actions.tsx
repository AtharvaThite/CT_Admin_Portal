"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { deactivateUser, reactivateUser, resetUserPassword } from "@/lib/actions/users";
import { toast } from "sonner";
import { UserX, UserCheck, KeyRound } from "lucide-react";

interface UserActionsProps {
  userId: string;
  isActive: boolean;
}

export function UserActions({ userId, isActive }: UserActionsProps) {
  const [loading, setLoading] = useState(false);

  const handleToggleStatus = async () => {
    setLoading(true);
    try {
      if (isActive) {
        await deactivateUser(userId);
        toast.success("User deactivated");
      } else {
        await reactivateUser(userId);
        toast.success("User reactivated");
      }
    } catch {
      toast.error("Failed to update user status");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      const result = await resetUserPassword(userId);
      toast.success("Password reset link generated. Check console.");
      console.log("Reset link:", result.link);
    } catch {
      toast.error("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2 sm:mt-0">
      <ConfirmDialog
        trigger={
          <Button variant="outline" size="sm" disabled={loading}>
            <KeyRound className="h-4 w-4 mr-1" />
            Reset Password
          </Button>
        }
        title="Reset Password"
        description="This will generate a password reset link for this user."
        confirmLabel="Reset"
        onConfirm={handleResetPassword}
      />
      <ConfirmDialog
        trigger={
          <Button
            variant={isActive ? "destructive" : "default"}
            size="sm"
            disabled={loading}
          >
            {isActive ? <UserX className="h-4 w-4 mr-1" /> : <UserCheck className="h-4 w-4 mr-1" />}
            {isActive ? "Deactivate" : "Reactivate"}
          </Button>
        }
        title={isActive ? "Deactivate User" : "Reactivate User"}
        description={isActive
          ? "This user will no longer be able to sign in."
          : "This user will be able to sign in again."}
        confirmLabel={isActive ? "Deactivate" : "Reactivate"}
        variant={isActive ? "destructive" : "default"}
        onConfirm={handleToggleStatus}
      />
    </div>
  );
}
