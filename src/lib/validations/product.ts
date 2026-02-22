import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().min(1, 'Description is required').max(1000),
  price: z.number().positive('Price must be positive'),
  imageUrl: z.string().url('Must be a valid URL'),
  category: z.enum(['mind', 'body', 'sleep', 'digital', 'giftKit']),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  tags: z.string(),
  isTherapistRecommended: z.boolean().default(false),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export function parseProductTags(tags: string): string[] {
  return tags.split(',').map((t) => t.trim()).filter(Boolean);
}
