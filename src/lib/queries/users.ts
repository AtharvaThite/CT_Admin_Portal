import { adminDb, adminAuth } from '@/lib/firebase/admin';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { serialize } from '@/lib/firebase/serialize';
import type { UserProfile } from '@/lib/types/user';

export async function getUsers(): Promise<UserProfile[]> {
  const snapshot = await adminDb.collection(COLLECTIONS.USERS).get();
  return snapshot.docs.map((doc) =>
    serialize<UserProfile>({ userId: doc.id, ...doc.data() })
  );
}

export async function getUserById(userId: string): Promise<(UserProfile & { isDisabled: boolean }) | null> {
  const [doc, authUser] = await Promise.all([
    adminDb.collection(COLLECTIONS.USERS).doc(userId).get(),
    adminAuth.getUser(userId).catch(() => null),
  ]);
  if (!doc.exists) return null;
  return serialize<UserProfile & { isDisabled: boolean }>({
    userId: doc.id,
    ...doc.data(),
    isDisabled: authUser?.disabled ?? false,
  });
}
