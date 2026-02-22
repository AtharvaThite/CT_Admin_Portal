'use server';

import { adminDb } from '@/lib/firebase/admin';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { revalidatePath } from 'next/cache';

export async function updateTherapist(therapistId: string, data: Record<string, unknown>) {
  await adminDb.collection(COLLECTIONS.THERAPISTS).doc(therapistId).update({
    ...data,
    updatedAt: new Date().toISOString(),
  });
  revalidatePath('/therapists');
  revalidatePath(`/therapists/${therapistId}`);
}

export async function verifyTherapist(therapistId: string) {
  await adminDb.collection(COLLECTIONS.THERAPISTS).doc(therapistId).update({
    verified: true,
    updatedAt: new Date().toISOString(),
  });
  revalidatePath('/therapists');
  revalidatePath(`/therapists/${therapistId}`);
}

export async function rejectTherapist(therapistId: string) {
  await adminDb.collection(COLLECTIONS.THERAPISTS).doc(therapistId).update({
    verified: false,
    updatedAt: new Date().toISOString(),
  });
  revalidatePath('/therapists');
  revalidatePath(`/therapists/${therapistId}`);
}
