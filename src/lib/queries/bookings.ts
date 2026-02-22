import { adminDb } from '@/lib/firebase/admin';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { serialize } from '@/lib/firebase/serialize';
import type { Booking } from '@/lib/types/booking';

function sortByDateDesc(bookings: Booking[]): Booking[] {
  return bookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBookings(): Promise<Booking[]> {
  const snapshot = await adminDb.collection(COLLECTIONS.BOOKINGS).get();
  const bookings = snapshot.docs.map((doc) =>
    serialize<Booking>({ id: doc.id, ...doc.data() })
  );
  return sortByDateDesc(bookings);
}

export async function getBookingById(bookingId: string): Promise<Booking | null> {
  const doc = await adminDb.collection(COLLECTIONS.BOOKINGS).doc(bookingId).get();
  if (!doc.exists) return null;
  return serialize<Booking>({ id: doc.id, ...doc.data() });
}

export async function getBookingsByUserId(userId: string): Promise<Booking[]> {
  const snapshot = await adminDb
    .collection(COLLECTIONS.BOOKINGS)
    .where('userId', '==', userId)
    .get();
  const bookings = snapshot.docs.map((doc) =>
    serialize<Booking>({ id: doc.id, ...doc.data() })
  );
  return sortByDateDesc(bookings);
}

export async function getBookingsByTherapistId(therapistId: string): Promise<Booking[]> {
  const snapshot = await adminDb
    .collection(COLLECTIONS.BOOKINGS)
    .where('therapistId', '==', therapistId)
    .get();
  const bookings = snapshot.docs.map((doc) =>
    serialize<Booking>({ id: doc.id, ...doc.data() })
  );
  return sortByDateDesc(bookings);
}
