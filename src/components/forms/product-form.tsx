"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createProduct, updateProduct } from "@/lib/actions/products";
import { productSchema, parseProductTags, type ProductFormValues } from "@/lib/validations/product";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { Product } from "@/lib/types/product";

interface ProductFormProps {
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!product;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: product
      ? {
          name: product.name,
          description: product.description,
          price: product.price,
          imageUrl: product.imageUrl,
          category: product.category,
          stock: product.stock,
          tags: product.tags.join(", "),
          isTherapistRecommended: product.isTherapistRecommended,
        }
      : {
          isTherapistRecommended: false,
          category: "mind",
        },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const payload = { ...data, tags: parseProductTags(data.tags) };
      if (isEditing) {
        await updateProduct(product.id, payload);
        toast.success("Product updated");
      } else {
        await createProduct(payload);
        toast.success("Product created");
      }
      router.push("/products");
    } catch {
      toast.error(isEditing ? "Failed to update product" : "Failed to create product");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {isEditing ? "Edit Product" : "New Product"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} placeholder="Product name" />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                defaultValue={watch("category")}
                onValueChange={(val) => setValue("category", val as ProductFormValues["category"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mind">Mind</SelectItem>
                  <SelectItem value="body">Body</SelectItem>
                  <SelectItem value="sleep">Sleep</SelectItem>
                  <SelectItem value="digital">Digital</SelectItem>
                  <SelectItem value="giftKit">Gift Kit</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs text-destructive">{errors.category.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Product description"
              rows={3}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="price">Price (INR)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-xs text-destructive">{errors.price.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                {...register("stock", { valueAsNumber: true })}
                placeholder="0"
              />
              {errors.stock && (
                <p className="text-xs text-destructive">{errors.stock.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                {...register("imageUrl")}
                placeholder="https://..."
              />
              {errors.imageUrl && (
                <p className="text-xs text-destructive">{errors.imageUrl.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              {...register("tags")}
              placeholder="wellness, therapy, mindfulness"
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="isTherapistRecommended"
              checked={watch("isTherapistRecommended")}
              onCheckedChange={(checked) => setValue("isTherapistRecommended", checked)}
            />
            <Label htmlFor="isTherapistRecommended">Therapist Recommended</Label>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/products")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
