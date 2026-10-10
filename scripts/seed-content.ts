/**
 * Copies the site "as delivered" into Firestore (all text sections) and Cloudinary (project photos),
 * so the public site and the /admin editor then read everything from there.
 *
 *   npx tsx --env-file=.env.local scripts/seed-content.ts
 *
 * Safe to re-run: photos use fixed Cloudinary names (replaced, not duplicated) and the previous
 * Firestore content is snapshotted into `site_history` first. "Revert to original" in the admin
 * still returns to the code defaults.
 */
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { DEFAULT_CONTENT, SECTION_KEYS, type SiteContent } from "../lib/content";
import { sanitizeSection } from "../lib/content-validate";

function need(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}. Run with --env-file=.env.local`);
  return v;
}

async function main() {
  // --- connect
  const raw = need("FIREBASE_SERVICE_ACCOUNT");
  const json = JSON.parse(raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8"));
  initializeApp({ credential: cert({ ...json, private_key: String(json.private_key).replace(/\\n/g, "\n") }) });
  const db = getFirestore();
  cloudinary.config({
    cloud_name: need("CLOUDINARY_CLOUD_NAME"),
    api_key: need("CLOUDINARY_API_KEY"),
    api_secret: need("CLOUDINARY_API_SECRET"),
    secure: true,
  });

  // --- 1. photos -> Cloudinary
  const content: SiteContent = structuredClone(DEFAULT_CONTENT);
  let uploaded = 0;
  for (const project of content.projects.items) {
    for (const [i, img] of project.images.entries()) {
      if (!img.file.startsWith("/work/")) continue; // already remote
      const local = path.join(process.cwd(), "public", img.file);
      const res = await cloudinary.uploader.upload(local, {
        public_id: `mb-plumber/projects/${project.slug}-${String(i + 1).padStart(2, "0")}`,
        overwrite: true,
        invalidate: true,
        resource_type: "image",
        tags: ["mbp-project", "mbp-seed"],
      });
      img.file = res.secure_url;
      img.width = res.width;
      img.height = res.height;
      uploaded++;
      console.log(`  uploaded ${project.slug} #${i + 1}  ${res.width}x${res.height}  ${Math.round(res.bytes / 1024)}KB  ${res.format}`);
    }
  }
  console.log(`Cloudinary: ${uploaded} photos uploaded.`);

  // --- 2. snapshot whatever is in Firestore now
  const ref = db.collection("site").doc("content");
  const before = await ref.get();
  await db.collection("site_history").add({
    createdAt: Date.now(),
    note: before.exists ? "Before seeding the original content" : "Before seeding (nothing saved yet)",
    by: "seed script",
    data: before.exists ? before.data() : {},
  });

  // --- 3. every section -> Firestore (validated the same way the admin validates)
  const out: Record<string, unknown> = {};
  for (const key of SECTION_KEYS) {
    const clean = sanitizeSection(key, content[key]);
    if (!clean) throw new Error(`Section "${key}" failed validation, nothing was written.`);
    out[key] = clean;
  }
  await ref.set(out);
  console.log(`Firestore: wrote ${SECTION_KEYS.length} sections (${SECTION_KEYS.join(", ")}).`);

  // --- 4. read back and check
  const back = (await ref.get()).data() ?? {};
  for (const key of SECTION_KEYS) {
    const clean = sanitizeSection(key, back[key]);
    if (JSON.stringify(clean) !== JSON.stringify(out[key])) throw new Error(`Read-back mismatch in "${key}".`);
  }
  const remote = (back.projects as SiteContent["projects"]).items.flatMap((p) => p.images).filter((i) => i.file.includes("res.cloudinary.com")).length;
  console.log(`Read-back OK: all sections valid, ${remote} project photos served from Cloudinary.`);
}

main().catch((e) => {
  console.error("SEED FAILED:", e instanceof Error ? e.message : e);
  process.exit(1);
});
