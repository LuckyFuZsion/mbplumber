import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

/**
 * FIREBASE_SERVICE_ACCOUNT is the service-account JSON (raw, or base64 encoded to survive env-var editors).
 * Never expose it to the browser.
 */
function credentials() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) return null;
  try {
    const text = raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
    const json = JSON.parse(text);
    return { ...json, private_key: String(json.private_key).replace(/\\n/g, "\n") };
  } catch {
    console.error("FIREBASE_SERVICE_ACCOUNT is not valid JSON/base64.");
    return null;
  }
}

export function firebaseConfigured() {
  return Boolean(credentials());
}

function app(): App {
  const existing = getApps()[0];
  if (existing) return existing;
  const creds = credentials();
  if (!creds) throw new Error("Firebase is not configured.");
  return initializeApp({ credential: cert(creds) });
}

export const adminAuth = () => getAuth(app());
export const adminDb = () => getFirestore(app());

/** Comma-separated list of email addresses allowed into /admin. */
export function allowedAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}
