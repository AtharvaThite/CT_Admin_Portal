import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/forms/product-form";

export default function NewProductPage() {
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
      <ProductForm />
    </div>
  );
}
