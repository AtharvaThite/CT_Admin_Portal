'use server';

import { adminDb } from '@/lib/firebase/admin';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { revalidatePath } from 'next/cache';

export async function createProduct(data: Record<string, unknown>) {
  const docRef = await adminDb.collection(COLLECTIONS.PRODUCTS).add({
    ...data,
    rating: 0,
    reviewCount: 0,
  });
  revalidatePath('/products');
  return { id: docRef.id };
}

export async function updateProduct(productId: string, data: Record<string, unknown>) {
  await adminDb.collection(COLLECTIONS.PRODUCTS).doc(productId).update(data);
  revalidatePath('/products');
  revalidatePath(`/products/${productId}`);
}

export async function deleteProduct(productId: string) {
  await adminDb.collection(COLLECTIONS.PRODUCTS).doc(productId).delete();
  revalidatePath('/products');
}
