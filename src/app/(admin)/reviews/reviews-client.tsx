"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Star, Flag, FlagOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable } from "@/components/data-table/data-table";
import { flagReview, unflagReview, removeReview } from "@/lib/actions/reviews";
import { toast } from "sonner";
import type { Review } from "@/lib/types/review";

const columns: ColumnDef<Review>[] = [
  {
    accessorKey: "reviewerName",
    header: "Reviewer",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.reviewerName}</span>
    ),
  },
  {
    accessorKey: "therapistName",
    header: "Therapist",
    cell: ({ row }) => row.original.therapistName || "—",
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${
              i < row.original.rating
                ? "fill-amber-400 text-amber-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
    ),
  },
  {
    accessorKey: "comment",
    header: "Comment",
    cell: ({ row }) => (
      <p className="text-sm max-w-[300px] truncate">{row.original.comment}</p>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.date}</span>
    ),
  },
  {
    accessorKey: "flagged",
    header: "Status",
    cell: ({ row }) =>
      row.original.flagged ? (
        <StatusBadge status="flagged" />
      ) : row.original.isVerified ? (
        <StatusBadge status="verified" />
      ) : null,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const review = row.original;
      return (
        <div className="flex items-center gap-1">
          {review.flagged ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                try {
                  await unflagReview(review.therapistId!, review.id);
                  toast.success("Review unflagged");
                } catch {
                  toast.error("Failed to unflag review");
                }
              }}
            >
              <FlagOff className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                try {
                  await flagReview(review.therapistId!, review.id);
                  toast.success("Review flagged");
                } catch {
                  toast.error("Failed to flag review");
                }
              }}
            >
              <Flag className="h-4 w-4" />
            </Button>
          )}
          <ConfirmDialog
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            }
            title="Remove Review"
            description="Are you sure you want to remove this review? This action cannot be undone."
            confirmLabel="Remove"
            variant="destructive"
            onConfirm={async () => {
              try {
                await removeReview(review.therapistId!, review.id);
                toast.success("Review removed");
              } catch {
                toast.error("Failed to remove review");
              }
            }}
          />
        </div>
      );
    },
  },
];

interface ReviewsClientProps {
  reviews: Review[];
}

export function ReviewsClient({ reviews }: ReviewsClientProps) {
  return (
    <DataTable
      columns={columns}
      data={reviews}
      searchKey="reviewerName"
      searchPlaceholder="Search by reviewer..."
    />
  );
}
