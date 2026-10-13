'use server';

import nodemailer from 'nodemailer';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

const ORDER_LIMIT = 3;
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Normalize an email to a single logical inbox so the rate limit can't be
 * trivially bypassed. For Gmail/Googlemail, dots in the local part are ignored
 * and anything after a "+" is a sub-address of the same inbox.
 */
function normalizeEmail(email: string): string {
  const lower = email.trim().toLowerCase();
  const at = lower.lastIndexOf('@');
  if (at < 0) return lower;
  let local = lower.slice(0, at);
  const domain = lower.slice(at + 1);
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    local = local.split('+')[0].replace(/\./g, '');
    return `${local}@gmail.com`;
  }
  return `${local}@${domain}`;
}

/** Count orders placed in the trailing window for a given key field/value. */
async function countRecent(field: 'email' | 'phone', value: string): Promise<number> {
  const cutoff = Date.now() - WINDOW_MS;
  // Equality-only query (no composite index needed); window-filter in memory.
  const snap = await getDocs(
    query(collection(db, 'order_rate_limits'), where(field, '==', value))
  );
  return snap.docs.filter((d) => (d.data().createdAt ?? 0) >= cutoff).length;
}

/**
 * Enforces ORDER_LIMIT orders per 24h for BOTH the email inbox and the phone
 * number. If either is already at the limit the order is rejected. Records the
 * attempt (keyed by both) when allowed. Backed by Firestore so the limit holds
 * across server instances. Fails open on read error so a transient DB issue
 * never blocks a legitimate order.
 */
async function checkAndRecordRateLimit(
  email: string,
  phone: string
): Promise<{ allowed: boolean; reason?: 'email' | 'phone' }> {
  const emailKey = normalizeEmail(email);
  const phoneKey = phone.replace(/\D/g, '');
  try {
    if ((await countRecent('email', emailKey)) >= ORDER_LIMIT) {
      return { allowed: false, reason: 'email' };
    }
    if ((await countRecent('phone', phoneKey)) >= ORDER_LIMIT) {
      return { allowed: false, reason: 'phone' };
    }
    await addDoc(collection(db, 'order_rate_limits'), {
      email: emailKey,
      phone: phoneKey,
      createdAt: Date.now(),
    });
    return { allowed: true };
  } catch (e) {
    console.error('Rate-limit check failed, allowing send:', e);
    return { allowed: true };
  }
}

export interface OrderEmailItem {
  name: string;
  quantity: number;
  price: string;
}

export interface OrderEmailPayload {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  governorate: string;
  items: OrderEmailItem[];
  total: number;
}

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

function createTransport() {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    throw new Error(
      'Missing GMAIL_USER / GMAIL_APP_PASSWORD environment variables.'
    );
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });
}

function buildHtml(order: OrderEmailPayload): string {
  const rows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #eee;color:#2a1608;">${escapeHtml(
          item.name
        )}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #eee;text-align:center;color:#2a1608;">${item.quantity}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #eee;text-align:right;color:#2a1608;">${escapeHtml(
          item.price
        )}</td>
      </tr>`
    )
    .join('');

  return `
  <div style="margin:0;padding:0;background:#0b0705;font-family:'Helvetica Neue',Arial,sans-serif;">
    <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
      <div style="text-align:center;padding:24px 0;">
        <h1 style="margin:0;font-size:26px;color:#f59e0b;letter-spacing:0.5px;">Artisan Honey</h1>
        <p style="margin:6px 0 0;color:#d6c4a8;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Order Confirmation</p>
      </div>

      <div style="background:#fffaf2;border-radius:20px;overflow:hidden;border:1px solid #f1e5cf;">
        <div style="padding:28px 24px;">
          <p style="margin:0 0 4px;color:#2a1608;font-size:18px;font-weight:bold;">Thank you, ${escapeHtml(
            order.customerName
          )}!</p>
          <p style="margin:0;color:#6b5a42;font-size:14px;line-height:1.6;">
            We've received your order and it's being prepared. Your order reference is below.
          </p>

          <div style="margin:20px 0;padding:14px 18px;background:#fdf2dc;border-radius:12px;text-align:center;">
            <span style="display:block;color:#9a7b3f;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Order ID</span>
            <span style="display:block;margin-top:4px;font-family:monospace;font-size:18px;font-weight:bold;color:#b45309;">${escapeHtml(
              order.orderId
            )}</span>
          </div>

          <table style="width:100%;border-collapse:collapse;margin-top:12px;">
            <thead>
              <tr>
                <th style="padding:10px 16px;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#9a7b3f;border-bottom:2px solid #f1e5cf;">Item</th>
                <th style="padding:10px 16px;text-align:center;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#9a7b3f;border-bottom:2px solid #f1e5cf;">Qty</th>
                <th style="padding:10px 16px;text-align:right;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#9a7b3f;border-bottom:2px solid #f1e5cf;">Price</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>

          <div style="margin-top:20px;padding-top:16px;border-top:2px solid #f1e5cf;display:flex;justify-content:space-between;">
            <span style="font-size:16px;font-weight:bold;color:#2a1608;">Total</span>
            <span style="font-size:18px;font-weight:bold;color:#b45309;">EGP ${order.total.toFixed(
              2
            )}</span>
          </div>
        </div>

        <div style="padding:20px 24px;background:#f9f0dd;">
          <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#9a7b3f;">Delivery Details</p>
          <p style="margin:0;color:#2a1608;font-size:14px;line-height:1.7;">
            ${escapeHtml(order.customerName)}<br/>
            ${escapeHtml(order.customerAddress)}<br/>
            ${escapeHtml(order.governorate)}<br/>
            ${escapeHtml(order.customerPhone)}
          </p>
        </div>
      </div>

      <p style="text-align:center;color:#8a7558;font-size:12px;margin-top:24px;">
        Payment is Cash on Delivery. We'll contact you to confirm shipping.
      </p>
    </div>
  </div>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function sendOrderEmail(
  order: OrderEmailPayload
): Promise<{ success: boolean; error?: string; blocked?: boolean }> {
  try {
    if (!order.customerEmail) {
      return { success: false, blocked: true, error: 'No customer email provided' };
    }

    // Basic validation to keep this public endpoint from being abused as an
    // open relay / spam amplifier.
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(order.customerEmail);
    if (!emailOk || order.customerEmail.length > 254) {
      return { success: false, blocked: true, error: 'Invalid email address' };
    }
    if (!Array.isArray(order.items) || order.items.length === 0 || order.items.length > 100) {
      return { success: false, blocked: true, error: 'Invalid order items' };
    }

    // Egyptian mobile: exactly 11 digits starting with "01".
    if (!/^01\d{9}$/.test((order.customerPhone || '').replace(/\D/g, ''))) {
      return { success: false, blocked: true, error: 'Phone must start with 01 and be 11 digits.' };
    }

    // Allow at most 3 orders per 24 hours per email inbox AND per phone number.
    const limit = await checkAndRecordRateLimit(order.customerEmail, order.customerPhone);
    if (!limit.allowed) {
      return {
        success: false,
        blocked: true,
        error:
          limit.reason === 'phone'
            ? 'Order limit reached: a maximum of 3 orders per 24 hours is allowed for this phone number.'
            : 'Order limit reached: a maximum of 3 orders per 24 hours is allowed for this email.',
      };
    }

    const transporter = createTransport();

    await transporter.sendMail({
      from: `"Artisan Honey" <${GMAIL_USER}>`,
      to: order.customerEmail,
      // Shop gets a copy of every order (defaults to the sending account).
      bcc: process.env.ORDER_NOTIFY_EMAIL || GMAIL_USER,
      subject: `Your Artisan Honey Order #${order.orderId}`,
      html: buildHtml(order),
    });

    return { success: true };
  } catch (err: any) {
    console.error('Order email error:', err);
    return { success: false, error: err?.message || 'Failed to send email' };
  }
}
