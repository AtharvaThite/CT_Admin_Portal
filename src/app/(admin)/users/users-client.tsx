"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable } from "@/components/data-table/data-table";
import { formatDate } from "@/lib/utils";
import type { UserProfile } from "@/lib/types/user";

const columns: ColumnDef<UserProfile>[] = [
  {
    accessorKey: "firstName",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.firstName} {row.original.lastName}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => row.original.phone || "—",
  },
  {
    accessorKey: "profileType",
    header: "Type",
    cell: ({ row }) => (
      <StatusBadge status={row.original.profileType || "self"} />
    ),
  },
  {
    accessorKey: "onboardingCompleted",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge
        status={row.original.onboardingCompleted ? "active" : "inactive"}
      />
    ),
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
        <Link href={`/users/${row.original.userId}`}>
          <Eye className="h-4 w-4 mr-1" />
          View
        </Link>
      </Button>
    ),
  },
];

interface UsersClientProps {
  users: UserProfile[];
}

export function UsersClient({ users }: UsersClientProps) {
  return (
    <DataTable
      columns={columns}
      data={users}
      searchKey="email"
      searchPlaceholder="Search by email..."
    />
  );
}
