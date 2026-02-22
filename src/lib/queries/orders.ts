import { adminDb } from '@/lib/firebase/admin';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { serialize } from '@/lib/firebase/serialize';
import type { ShopOrder } from '@/lib/types/order';

export async function getOrders(): Promise<ShopOrder[]> {
  const snapshot = await adminDb.collection(COLLECTIONS.ORDERS).get();
  const orders = snapshot.docs.map((doc) =>
    serialize<ShopOrder>({ orderId: doc.id, ...doc.data() })
  );
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getOrderById(orderId: string): Promise<ShopOrder | null> {
  const doc = await adminDb.collection(COLLECTIONS.ORDERS).doc(orderId).get();
  if (!doc.exists) return null;
  return serialize<ShopOrder>({ orderId: doc.id, ...doc.data() });
}
