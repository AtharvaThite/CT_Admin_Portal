import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { getProducts } from "@/lib/queries/products";
import { ProductsClient } from "./products-client";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage shop products and inventory"
      >
        <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white">
          <Link href="/products/new">
            <Plus className="h-4 w-4 mr-1" />
            Add Product
          </Link>
        </Button>
      </PageHeader>
      <ProductsClient products={products} />
    </div>
  );
}
