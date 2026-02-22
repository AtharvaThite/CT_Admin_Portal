"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrderStatus } from "@/lib/actions/orders";
import { toast } from "sonner";
import type { ShopOrderStatus } from "@/lib/types/order";

const statuses: ShopOrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

interface OrderStatusActionsProps {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusActions({ orderId, currentStatus }: OrderStatusActionsProps) {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      await updateOrderStatus(orderId, newStatus as ShopOrderStatus);
      toast.success(`Order status updated to ${newStatus}`);
    } catch {
      toast.error("Failed to update order status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2 sm:mt-0">
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
