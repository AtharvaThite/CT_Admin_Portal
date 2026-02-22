'use server';

import { createSession, destroySession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export async function loginAction(idToken: string) {
  try {
    await createSession(idToken);
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Login failed' };
  }
  redirect('/dashboard');
}

export async function logoutAction() {
  await destroySession();
  redirect('/login');
}
