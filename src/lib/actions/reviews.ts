'use server';

import { adminDb } from '@/lib/firebase/admin';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { revalidatePath } from 'next/cache';
import { FieldValue } from 'firebase-admin/firestore';

export async function flagReview(therapistId: string, reviewId: string) {
  const doc = await adminDb.collection(COLLECTIONS.THERAPISTS).doc(therapistId).get();
  if (!doc.exists) throw new Error('Therapist not found');

  const data = doc.data()!;
  const reviews = (data.reviews || []).map((r: Record<string, unknown>) =>
    r.id === reviewId ? { ...r, flagged: true } : r
  );

  await adminDb.collection(COLLECTIONS.THERAPISTS).doc(therapistId).update({ reviews });
  revalidatePath('/reviews');
}

export async function unflagReview(therapistId: string, reviewId: string) {
  const doc = await adminDb.collection(COLLECTIONS.THERAPISTS).doc(therapistId).get();
  if (!doc.exists) throw new Error('Therapist not found');

  const data = doc.data()!;
  const reviews = (data.reviews || []).map((r: Record<string, unknown>) =>
    r.id === reviewId ? { ...r, flagged: false } : r
  );

  await adminDb.collection(COLLECTIONS.THERAPISTS).doc(therapistId).update({ reviews });
  revalidatePath('/reviews');
}

export async function removeReview(therapistId: string, reviewId: string) {
  const doc = await adminDb.collection(COLLECTIONS.THERAPISTS).doc(therapistId).get();
  if (!doc.exists) throw new Error('Therapist not found');

  const data = doc.data()!;
  const reviews = (data.reviews || []).filter((r: Record<string, unknown>) => r.id !== reviewId);
  const removedCount = (data.reviews || []).length - reviews.length;

  await adminDb.collection(COLLECTIONS.THERAPISTS).doc(therapistId).update({
    reviews,
    reviewsCount: FieldValue.increment(-removedCount),
  });
  revalidatePath('/reviews');
}
