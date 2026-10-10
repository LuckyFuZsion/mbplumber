import { NextResponse } from "next/server";
import { adminEmail } from "@/lib/auth";
import { listHistory, restoreVersion } from "@/lib/content-server";

export async function GET() {
  if (!(await adminEmail())) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  return NextResponse.json({ versions: await listHistory() });
}

/** Restore the site to how it was before a given save. */
export async function POST(req: Request) {
  const who = await adminEmail();
  if (!who) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const { id } = (await req.json().catch(() => ({}))) as { id?: string };
  if (!id) return NextResponse.json({ error: "Missing version." }, { status: 400 });
  try {
    await restoreVersion(id, who);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Restore failed." }, { status: 400 });
  }
}
