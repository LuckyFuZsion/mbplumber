import { NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_MAX_AGE_MS } from "@/lib/auth";
import { adminAuth, allowedAdminEmails, firebaseConfigured } from "@/lib/firebase-admin";

/** Exchange a fresh Firebase ID token (from email + password sign-in) for a secure session cookie. */
export async function POST(req: Request) {
  if (!firebaseConfigured()) return NextResponse.json({ error: "Admin isn't set up yet." }, { status: 500 });
  const { idToken } = (await req.json().catch(() => ({}))) as { idToken?: string };
  if (!idToken) return NextResponse.json({ error: "Missing token." }, { status: 400 });
  try {
    const auth = await adminAuth();
    const decoded = await auth.verifyIdToken(idToken);
    const email = decoded.email?.toLowerCase();
    if (!email || !allowedAdminEmails().includes(email)) {
      return NextResponse.json({ error: "This account isn't allowed to edit the site." }, { status: 403 });
    }
    const cookie = await auth.createSessionCookie(idToken, { expiresIn: SESSION_MAX_AGE_MS });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, cookie, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE_MS / 1000,
    });
    return res;
  } catch (err) {
    // Logged (never returned to the browser) so a failure can be diagnosed from the server logs.
    console.error("Admin sign-in failed:", (err as { code?: string }).code ?? "", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Sign-in failed. Please try again." }, { status: 401 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
