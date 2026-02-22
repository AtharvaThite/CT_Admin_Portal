import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/forms/product-form";
import { getProductById } from "@/lib/queries/products";

export default async function EditProductPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const product = await getProductById(productId);

  if (!product) return notFound();

  return (
    <div>
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/products">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </Button>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
