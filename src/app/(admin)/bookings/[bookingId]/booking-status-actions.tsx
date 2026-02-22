"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateBookingStatus } from "@/lib/actions/bookings";
import { toast } from "sonner";
import type { BookingStatus } from "@/lib/types/booking";

const statuses: BookingStatus[] = ["pending", "confirmed", "completed", "cancelled"];

interface BookingStatusActionsProps {
  bookingId: string;
  currentStatus: string;
}

export function BookingStatusActions({ bookingId, currentStatus }: BookingStatusActionsProps) {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      await updateBookingStatus(bookingId, newStatus as BookingStatus);
      toast.success(`Booking status updated to ${newStatus}`);
    } catch {
      toast.error("Failed to update booking status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2 sm:mt-0">
      <Select defaultValue={currentStatus} onValueChange={handleStatusChange} disabled={loading}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Update status" />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((status) => (
            <SelectItem key={status} value={status} className="capitalize">
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
