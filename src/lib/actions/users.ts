'use server';

import { adminDb, adminAuth } from '@/lib/firebase/admin';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { revalidatePath } from 'next/cache';

export async function updateUser(userId: string, data: Record<string, unknown>) {
  await adminDb.collection(COLLECTIONS.USERS).doc(userId).update({
    ...data,
    updatedAt: new Date().toISOString(),
  });
  revalidatePath('/users');
  revalidatePath(`/users/${userId}`);
}

export async function deactivateUser(userId: string) {
  await adminAuth.updateUser(userId, { disabled: true });
  revalidatePath('/users');
  revalidatePath(`/users/${userId}`);
}

export async function reactivateUser(userId: string) {
  await adminAuth.updateUser(userId, { disabled: false });
  revalidatePath('/users');
  revalidatePath(`/users/${userId}`);
}

export async function resetUserPassword(userId: string) {
  const user = await adminAuth.getUser(userId);
  if (user.email) {
    // Generate password reset link (admin can share it)
    const link = await adminAuth.generatePasswordResetLink(user.email);
    return { link };
  }
  throw new Error('User has no email');
}
