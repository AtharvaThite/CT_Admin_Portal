import { adminDb } from '@/lib/firebase/admin';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { serialize } from '@/lib/firebase/serialize';
import type { UserProfile } from '@/lib/types/user';

export async function getUsers(): Promise<UserProfile[]> {
  const snapshot = await adminDb.collection(COLLECTIONS.USERS).get();
  return snapshot.docs.map((doc) =>
    serialize<UserProfile>({ userId: doc.id, ...doc.data() })
  );
}

export async function getUserById(userId: string): Promise<UserProfile | null> {
  const doc = await adminDb.collection(COLLECTIONS.USERS).doc(userId).get();
  if (!doc.exists) return null;
  return serialize<UserProfile>({ userId: doc.id, ...doc.data() });
}
