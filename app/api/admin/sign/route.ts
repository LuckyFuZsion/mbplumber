import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { cloudinaryConfigured, GALLERY_TAG, getCloudinary } from "@/lib/cloudinary";

/** Escape characters that have meaning inside Cloudinary's `context` string. */
const esc = (s: string) => s.replace(/([=|\\])/g, "\\$1");

/**
 * Returns a signed upload payload so the browser can upload straight to Cloudinary
 * (keeps big photos off our server and under serverless body limits).
 * `kind: "project"` is for project photos (their captions live in the site content, not Cloudinary).
 */
export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  if (!cloudinaryConfigured()) return NextResponse.json({ error: "Cloudinary env vars missing." }, { status: 500 });

  const { caption = "", category = "General Plumbing", kind = "gallery" } = (await req.json().catch(() => ({}))) as {
    caption?: string;
    category?: string;
    kind?: "gallery" | "project";
  };

  const cld = getCloudinary();
  const timestamp = Math.round(Date.now() / 1000);
  const params =
    kind === "project"
      ? { timestamp, folder: "mb-plumber/projects", tags: "mbp-project" }
      : {
          timestamp,
          folder: "mb-plumber/gallery",
          tags: GALLERY_TAG,
          context: `caption=${esc(caption.slice(0, 300))}|category=${esc(category)}`,
        };
  const signature = cld.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET!);

  return NextResponse.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    signature,
    ...params,
  });
}
