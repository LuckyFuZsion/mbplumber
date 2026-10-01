import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "mbp_admin";

function token() {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return createHmac("sha256", process.env.ADMIN_SESSION_SECRET ?? "mbp-admin").update(pw).digest("hex");
}

export function passwordMatches(input: string) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(pw);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function sessionToken() {
  return token();
}

export async function isAdmin() {
  const expected = token();
  if (!expected) return false;
  const got = (await cookies()).get(ADMIN_COOKIE)?.value ?? "";
  const a = Buffer.from(got);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
