"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { clientAuth, firebaseClientConfigured } from "@/lib/firebase-client";
import { fieldClass } from "./ui";

export function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    setInfo("");
    try {
      const auth = clientAuth();
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pw);
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: await cred.user.getIdToken() }),
      });
      await signOut(auth); // we only need the secure server cookie
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Sign-in failed.");
      router.refresh();
    } catch (e) {
      const code = (e as { code?: string }).code ?? "";
      setErr(
        code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found")
          ? "Wrong email or password."
          : code.includes("too-many-requests")
            ? "Too many attempts. Please wait a few minutes and try again."
            : e instanceof Error
              ? e.message
              : "Sign-in failed.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function reset() {
    setErr("");
    setInfo("");
    if (!email.trim()) return setErr("Type your email above first, then press this again.");
    try {
      await sendPasswordResetEmail(clientAuth(), email.trim());
    } catch {}
    setInfo("If that email has an account, a reset link is on its way.");
  }

  if (!firebaseClientConfigured()) {
    return <p className="rounded-2xl border border-brand-red bg-brand-red/10 p-6 text-sm font-semibold">Sign-in isn&apos;t set up yet (Firebase settings are missing).</p>;
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-ink-soft p-8">
      <h1 className="heading mb-6 text-3xl">Site admin</h1>
      <label className="mb-2 block text-sm font-bold" htmlFor="email">
        Email
      </label>
      <input id="email" type="email" autoComplete="username" className={fieldClass} value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
      <label className="mb-2 mt-4 block text-sm font-bold" htmlFor="pw">
        Password
      </label>
      <input id="pw" type="password" autoComplete="current-password" className={fieldClass} value={pw} onChange={(e) => setPw(e.target.value)} />
      {err && <p className="mt-3 text-sm font-semibold text-brand-red">{err}</p>}
      {info && <p className="mt-3 text-sm font-semibold text-green-400">{info}</p>}
      <button className="btn btn-yellow mt-6 w-full" disabled={busy || !email || !pw}>
        {busy ? "Signing in…" : "Sign in"}
      </button>
      <button type="button" onClick={reset} className="mt-4 w-full text-center text-sm font-semibold text-white/60 hover:text-brand">
        Forgot your password?
      </button>
    </form>
  );
}
