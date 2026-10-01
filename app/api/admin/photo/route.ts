import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getCloudinary } from "@/lib/cloudinary";

const esc = (s: string) => s.replace(/([=|\\])/g, "\\$1");

function refresh() {
  revalidatePath("/gallery");
  revalidatePath("/");
}

/** Edit caption/category of an existing photo. */
export async function PATCH(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const { id, caption = "", category = "General Plumbing" } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  await getCloudinary().uploader.add_context(
    `caption=${esc(String(caption).slice(0, 300))}|category=${esc(String(category))}`,
    [id],
  );
  refresh();
  return NextResponse.json({ ok: true });
}

/** Delete a photo from Cloudinary. */
export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  await getCloudinary().uploader.destroy(id, { invalidate: true });
  refresh();
  return NextResponse.json({ ok: true });
}

/** Called by the admin page after a successful upload so the public gallery updates immediately. */
export async function POST() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  refresh();
  return NextResponse.json({ ok: true });
}
