'use server';

import { cookies } from 'next/headers';

export async function loginAdmin(password: string, locale: string) {
  if (password === process.env.ADMIN_PASSWORD) {
    (await cookies()).set('admin_token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    return { success: true };
  }
  return { success: false, error: 'Invalid password' };
}

import { redirect } from 'next/navigation';

export async function logoutAdmin() {
  (await cookies()).delete('admin_token');
  redirect('/en/admin/login');
}
