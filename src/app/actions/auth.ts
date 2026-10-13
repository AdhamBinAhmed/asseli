'use server';

import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

/**
 * Secret used to sign the admin session cookie. MUST be set in the
 * environment in production; a missing secret disables login so that an
 * unsigned/forgeable token can never be issued.
 */
const AUTH_SECRET = process.env.ADMIN_AUTH_SECRET;

interface AdminSession {
  role: string;
  username: string;
}

function sign(payload: string): string {
  return createHmac('sha256', AUTH_SECRET as string).update(payload).digest('hex');
}

/** Returns a cookie value of `base64(json).signature`. */
function createToken(session: AdminSession): string {
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

/** Verifies the HMAC and returns the session, or null if tampered/invalid. */
function verifyToken(token: string | undefined): AdminSession | null {
  if (!token || !AUTH_SECRET) return null;
  const dot = token.lastIndexOf('.');
  if (dot < 0) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = sign(payload);
  // Constant-time compare; bail if lengths differ.
  if (sig.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString()) as AdminSession;
  } catch {
    return null;
  }
}

export async function loginAdmin(password: string, locale: string) {
  if (!AUTH_SECRET) {
    console.error('ADMIN_AUTH_SECRET is not configured — refusing to issue a session.');
    return { success: false, error: 'Server auth is not configured' };
  }

  let role = '';
  let username = '';

  // Built-in accounts are configured via environment, never hardcoded.
  const superPw = process.env.ADMIN_SUPER_PASSWORD;
  const orderPw = process.env.ADMIN_ORDER_PASSWORD;

  if (superPw && password === superPw) {
    role = 'super_admin';
    username = 'Master Admin';
  } else if (orderPw && password === orderPw) {
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
    (await cookies()).set('admin_token', createToken({ role, username }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    return { success: true, role };
  }
  return { success: false, error: 'Invalid password' };
}

export async function getAdminRole() {
  const session = verifyToken((await cookies()).get('admin_token')?.value);
  return session?.role ?? null;
}

export async function getAdminDetails() {
  return verifyToken((await cookies()).get('admin_token')?.value);
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
