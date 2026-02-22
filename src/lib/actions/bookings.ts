'use server';

import { adminDb } from '@/lib/firebase/admin';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { revalidatePath } from 'next/cache';
import type { BookingStatus } from '@/lib/types/booking';

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  await adminDb.collection(COLLECTIONS.BOOKINGS).doc(bookingId).update({
    status,
  });
  revalidatePath('/bookings');
  revalidatePath(`/bookings/${bookingId}`);
}
