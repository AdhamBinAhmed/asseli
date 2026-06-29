'use server';

import { cookies } from 'next/headers';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

export async function loginAdmin(password: string, locale: string) {
  let role = '';
  let username = '';
  
  if (password === 'megadevs-admin-full') {
    role = 'super_admin';
    username = 'Master Admin';
  } else if (password === 'asseli-admin--8811') {
    role = 'order_admin';
    username = 'Legacy Order Admin';
  } else {
    // Check dynamic admins in Firebase
    try {
      const q = query(collection(db, 'admins'), where('password', '==', password));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const adminData = querySnapshot.docs[0].data();
        role = adminData.role; // 'super_admin' or 'order_admin'
        username = adminData.username;
      }
    } catch (e) {
      console.error("Error querying dynamic admins:", e);
    }
  }

  if (role) {
    const tokenData = JSON.stringify({ role, username });
    (await cookies()).set('admin_token', tokenData, {
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
  if (!token) return null;
  
  try {
    const data = JSON.parse(token);
    return data.role || token; // Fallback if old token format
  } catch (e) {
    return token; // Legacy token (just 'super_admin' or 'order_admin')
  }
}

export async function getAdminDetails() {
  const token = (await cookies()).get('admin_token')?.value;
  if (!token) return null;
  
  try {
    return JSON.parse(token); // { role: string, username: string }
  } catch (e) {
    return { role: token, username: 'Unknown' };
  }
}

export async function logAudit(action: string, details: string) {
  const admin = await getAdminDetails();
  if (!admin) return;

  try {
    await addDoc(collection(db, 'audit_logs'), {
      username: admin.username,
      role: admin.role,
      action,
      details,
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    console.error('Failed to write audit log:', e);
  }
}

import { redirect } from 'next/navigation';

export async function logoutAdmin() {
  (await cookies()).delete('admin_token');
  redirect('/en/admin/login');
}
