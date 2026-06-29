'use server';

import { cookies } from 'next/headers';

export async function loginAdmin(password: string, locale: string) {
  let role = '';
  if (password === 'megadevs-admin-full') {
    role = 'super_admin';
  } else if (password === 'asseli-admin--8811') {
    role = 'order_admin';
  }

  if (role) {
    (await cookies()).set('admin_token', role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    return { success: true, role };
  }
  return { success: false, error: 'Invalid password' };
}

export async function getAdminRole() {
  const token = (await cookies()).get('admin_token')?.value;
  return token || null;
}

import { redirect } from 'next/navigation';

export async function logoutAdmin() {
  (await cookies()).delete('admin_token');
  redirect('/en/admin/login');
}
