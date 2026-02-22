"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/data-table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { formatCurrencyRupees } from "@/lib/utils";
import { deleteProduct } from "@/lib/actions/products";
import { toast } from "sonner";
import type { Product } from "@/lib/types/product";

const categoryColors: Record<string, string> = {
  mind: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  body: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  sleep: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  digital: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
  giftKit: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
};

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) => (
      <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden">
        {row.original.imageUrl ? (
          <img
            src={row.original.imageUrl}
            alt={row.original.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
            N/A
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge
        variant="secondary"
        className={`capitalize border-0 ${categoryColors[row.original.category] || ""}`}
      >
        {row.original.category}
      </Badge>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => formatCurrencyRupees(row.original.price),
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => (
      <span className={row.original.stock < 5 ? "text-red-600 font-medium" : ""}>
        {row.original.stock}
      </span>
    ),
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        <span className="text-sm">{row.original.rating.toFixed(1)}</span>
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/products/${row.original.id}`}>
            <Edit className="h-4 w-4" />
          </Link>
        </Button>
        <ConfirmDialog
          trigger={
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          }
          title="Delete Product"
          description={`Are you sure you want to delete "${row.original.name}"? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="destructive"
          onConfirm={async () => {
            try {
              await deleteProduct(row.original.id);
              toast.success("Product deleted");
            } catch {
              toast.error("Failed to delete product");
            }
          }}
        />
      </div>
    ),
  },
];

interface ProductsClientProps {
  products: Product[];
}

export function ProductsClient({ products }: ProductsClientProps) {
  return (
    <DataTable
      columns={columns}
      data={products}
      searchKey="name"
      searchPlaceholder="Search products..."
    />
  );
}
