"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable } from "@/components/data-table/data-table";
import { formatDate, formatCurrencyRupees } from "@/lib/utils";
import type { ShopOrder } from "@/lib/types/order";

const columns: ColumnDef<ShopOrder>[] = [
  {
    accessorKey: "orderId",
    header: "Order ID",
    cell: ({ row }) => (
      <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
        {row.original.orderId.slice(0, 8)}...
      </code>
    ),
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => <span>{row.original.items.length} item(s)</span>,
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => (
      <span className="font-medium">{formatCurrencyRupees(row.original.total)}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/orders/${row.original.orderId}`}>
          <Eye className="h-4 w-4 mr-1" />
          View
        </Link>
      </Button>
    ),
  },
];

interface OrdersClientProps {
  orders: ShopOrder[];
}

export function OrdersClient({ orders }: OrdersClientProps) {
  return (
    <DataTable
      columns={columns}
      data={orders}
      searchKey="orderId"
      searchPlaceholder="Search by order ID..."
    />
  );
}
