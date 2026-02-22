'use server';

import { adminDb } from '@/lib/firebase/admin';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { revalidatePath } from 'next/cache';
import type { ShopOrderStatus } from '@/lib/types/order';

export async function updateOrderStatus(orderId: string, status: ShopOrderStatus) {
  await adminDb.collection(COLLECTIONS.ORDERS).doc(orderId).update({
    status,
  });
  revalidatePath('/orders');
  revalidatePath(`/orders/${orderId}`);
}
