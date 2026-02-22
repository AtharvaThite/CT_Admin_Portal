import { adminDb } from '@/lib/firebase/admin';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { serialize } from '@/lib/firebase/serialize';
import type { Therapist } from '@/lib/types/therapist';

export async function getTherapists(): Promise<Therapist[]> {
  const snapshot = await adminDb.collection(COLLECTIONS.THERAPISTS).get();
  return snapshot.docs.map((doc) =>
    serialize<Therapist>({ id: doc.id, ...doc.data() })
  );
}

export async function getTherapistById(therapistId: string): Promise<Therapist | null> {
  const doc = await adminDb.collection(COLLECTIONS.THERAPISTS).doc(therapistId).get();
  if (!doc.exists) return null;
  return serialize<Therapist>({ id: doc.id, ...doc.data() });
}
