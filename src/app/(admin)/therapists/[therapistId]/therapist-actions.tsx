"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { verifyTherapist, rejectTherapist } from "@/lib/actions/therapists";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";

interface TherapistActionsProps {
  therapistId: string;
  verified: boolean;
}

export function TherapistActions({ therapistId, verified }: TherapistActionsProps) {
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      await verifyTherapist(therapistId);
      toast.success("Therapist verified successfully");
    } catch {
      toast.error("Failed to verify therapist");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await rejectTherapist(therapistId);
      toast.success("Therapist verification rejected");
    } catch {
      toast.error("Failed to reject therapist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {!verified ? (
        <ConfirmDialog
          trigger={
            <Button size="sm" disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white">
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve Verification
            </Button>
          }
          title="Approve Therapist Verification"
          description="This will mark the therapist as verified on the platform."
          confirmLabel="Approve"
          onConfirm={handleVerify}
        />
      ) : (
        <ConfirmDialog
          trigger={
            <Button variant="destructive" size="sm" disabled={loading}>
              <XCircle className="h-4 w-4 mr-1" />
              Revoke Verification
            </Button>
          }
          title="Revoke Verification"
          description="This will mark the therapist as unverified."
          confirmLabel="Revoke"
          variant="destructive"
          onConfirm={handleReject}
        />
      )}
    </div>
  );
}
