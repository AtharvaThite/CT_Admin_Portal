"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable } from "@/components/data-table/data-table";
import { formatDate, formatCurrencyRupees } from "@/lib/utils";
import type { Booking } from "@/lib/types/booking";

const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: "id",
    header: "Booking ID",
    cell: ({ row }) => (
      <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
        {row.original.id.slice(0, 8)}...
      </code>
    ),
  },
  {
    accessorKey: "therapistName",
    header: "Therapist",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.therapistName}</span>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => formatDate(row.original.date),
  },
  {
    accessorKey: "timeSlot",
    header: "Time",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => formatCurrencyRupees(row.original.amount),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "paymentId",
    header: "Payment ID",
    cell: ({ row }) =>
      row.original.paymentId ? (
        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
          {row.original.paymentId}
        </code>
      ) : (
        "—"
      ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/bookings/${row.original.id}`}>
          <Eye className="h-4 w-4 mr-1" />
          View
        </Link>
      </Button>
    ),
  },
];

interface BookingsClientProps {
  bookings: Booking[];
}

export function BookingsClient({ bookings }: BookingsClientProps) {
  return (
    <DataTable
      columns={columns}
      data={bookings}
      searchKey="therapistName"
      searchPlaceholder="Search by therapist..."
    />
  );
}
