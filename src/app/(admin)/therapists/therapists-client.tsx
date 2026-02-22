"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable } from "@/components/data-table/data-table";
import type { Therapist } from "@/lib/types/therapist";

const columns: ColumnDef<Therapist>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.name}</div>
    ),
  },
  {
    accessorKey: "specializations",
    header: "Specializations",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1 max-w-[200px]">
        {row.original.specializations.slice(0, 2).map((s) => (
          <span key={s} className="inline-flex items-center rounded-md bg-teal-50 dark:bg-teal-900/20 px-2 py-0.5 text-xs font-medium text-teal-700 dark:text-teal-300">
            {s}
          </span>
        ))}
        {row.original.specializations.length > 2 && (
          <span className="text-xs text-muted-foreground">+{row.original.specializations.length - 2}</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "verified",
    header: "Verified",
    cell: ({ row }) => (
      <StatusBadge status={row.original.verified ? "verified" : "unverified"} />
    ),
  },
  {
    accessorKey: "ratings",
    header: "Rating",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        <span className="text-sm">{row.original.ratings.toFixed(1)}</span>
        <span className="text-xs text-muted-foreground">({row.original.reviewsCount})</span>
      </div>
    ),
  },
  {
    accessorKey: "experience",
    header: "Experience",
    cell: ({ row }) => <span>{row.original.experience} yrs</span>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/therapists/${row.original.id}`}>
          <Eye className="h-4 w-4 mr-1" />
          View
        </Link>
      </Button>
    ),
  },
];

interface TherapistsClientProps {
  therapists: Therapist[];
}

export function TherapistsClient({ therapists }: TherapistsClientProps) {
  return (
    <DataTable
      columns={columns}
      data={therapists}
      searchKey="name"
      searchPlaceholder="Search therapists..."
    />
  );
}
