import "server-only";
import { cookies } from "next/headers";
import { adminAuth, allowedAdminEmails, firebaseConfigured } from "./firebase-admin";

export const SESSION_COOKIE = "mbp_session";
export const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 5; // 5 days

/** The signed-in admin's email, or null. Verifies the Firebase session cookie and the allow-list. */
export async function adminEmail(): Promise<string | null> {
  if (!firebaseConfigured()) return null;
  const cookie = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!cookie) return null;
  try {
    const decoded = await (await adminAuth()).verifySessionCookie(cookie, true);
    const email = decoded.email?.toLowerCase();
    return email && allowedAdminEmails().includes(email) ? email : null;
  } catch {
    return null;
  }
}

export async function isAdmin() {
  return (await adminEmail()) !== null;
}
