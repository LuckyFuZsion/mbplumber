import { NextResponse } from "next/server";
import { adminEmail } from "@/lib/auth";
import { SECTION_KEYS, type SectionKey } from "@/lib/content";
import { resetAll, resetSection, saveSection } from "@/lib/content-server";

const isSection = (v: unknown): v is SectionKey => typeof v === "string" && (SECTION_KEYS as string[]).includes(v);

/** Save one section of the site. */
export async function PUT(req: Request) {
  const who = await adminEmail();
  if (!who) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const { section, value } = (await req.json().catch(() => ({}))) as { section?: unknown; value?: unknown };
  if (!isSection(section)) return NextResponse.json({ error: "Unknown section." }, { status: 400 });
  try {
    await saveSection(section, value, who);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Save failed." }, { status: 400 });
  }
}

/** Revert one section (or everything, if no section is given) to the original. */
export async function DELETE(req: Request) {
  const who = await adminEmail();
  if (!who) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const { section } = (await req.json().catch(() => ({}))) as { section?: unknown };
  try {
    if (section === undefined) await resetAll(who);
    else if (isSection(section)) await resetSection(section, who);
    else return NextResponse.json({ error: "Unknown section." }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Revert failed." }, { status: 500 });
  }
}
