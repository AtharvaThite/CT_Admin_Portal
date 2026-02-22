import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { COLLECTIONS } from '@/lib/firebase/collections';

const SESSION_COOKIE_NAME = '__session';
const SESSION_EXPIRY = 60 * 60 * 24 * 5 * 1000; // 5 days

export async function createSession(idToken: string) {
  const decodedToken = await adminAuth.verifyIdToken(idToken);

  // Check if user is an admin
  const adminDoc = await adminDb
    .collection(COLLECTIONS.ADMINS)
    .doc(decodedToken.uid)
    .get();

  if (!adminDoc.exists) {
    throw new Error('Unauthorized: Not an admin');
  }

  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: SESSION_EXPIRY,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
    maxAge: SESSION_EXPIRY / 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });

  return { uid: decodedToken.uid, email: decodedToken.email };
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) return null;

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    return { uid: decodedClaims.uid, email: decodedClaims.email };
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
