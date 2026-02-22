import { adminDb } from '@/lib/firebase/admin';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { serialize } from '@/lib/firebase/serialize';
import type { Product } from '@/lib/types/product';

export async function getProducts(): Promise<Product[]> {
  const snapshot = await adminDb.collection(COLLECTIONS.PRODUCTS).get();
  return snapshot.docs.map((doc) =>
    serialize<Product>({ id: doc.id, ...doc.data() })
  );
}

export async function getProductById(productId: string): Promise<Product | null> {
  const doc = await adminDb.collection(COLLECTIONS.PRODUCTS).doc(productId).get();
  if (!doc.exists) return null;
  return serialize<Product>({ id: doc.id, ...doc.data() });
}
