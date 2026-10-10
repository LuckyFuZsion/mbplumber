/** Unit checks for the change descriptions, plus a dry-run against the real saved history (read-only). */
import assert from "node:assert";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { DEFAULT_CONTENT, type SiteContent } from "../lib/content";
import { diffContent } from "../lib/content-diff";
import { sanitizeSection } from "../lib/content-validate";

const clone = () => structuredClone(DEFAULT_CONTENT);
const flat = (a: SiteContent, b: SiteContent) => diffContent(a, b).flatMap((g) => g.lines.map((l) => `${g.label} | ${l}`));

// no change -> nothing
assert.deepStrictEqual(diffContent(clone(), clone()), []);

// text edits
let b = clone();
b.business.phone = "07999 123456";
b.home.title = "A new headline";
b.cta.heading = "";
let lines = flat(DEFAULT_CONTENT, b);
console.log(lines.join("\n"), "\n");
assert.ok(lines.some((l) => l.includes("Phone number: “07830 001306” → “07999 123456”")));
assert.ok(lines.some((l) => l.includes("Headline:") && l.includes("A new headline")));
assert.ok(lines.some((l) => l.includes("Heading: “Planning a new bathroom?” → (empty)")));

// list edits: services, reviews, projects, photos
b = clone();
b.services.items.splice(1, 1);
b.services.items[0].blurb = "New words";
b.services.items[0].points.push("Brand new bullet");
b.reviews.items.unshift({ name: "Sam T.", text: "Great job", date: "2026-10-01" });
b.projects.items[0].title = "Renamed project";
b.projects.items[0].images.pop();
b.projects.items[1].images[0].alt = "Better description";
b.projects.items[1].images[2].stage = "Complete";
b.projects.items.push({ slug: "new-one", title: "Brand new project", summary: "", cover: 0, images: [] });
const moved = b.projects.items.splice(2, 1)[0];
b.projects.items.unshift(moved);
lines = flat(DEFAULT_CONTENT, b);
console.log(lines.join("\n"), "\n");
for (const needle of [
  "Removed service “General Plumbing”".replace("General Plumbing", DEFAULT_CONTENT.services.items[1].title),
  "Added bullet “Brand new bullet”",
  "Added review “Sam T. (2026-10-01)”",
  "Name: “Bathroom 4” → “Renamed project”",
  "Removed photo",
  "Photo description:",
  "Label: “After” → “Complete”",
  "Added project “Brand new project”",
  "Changed the order of the projects",
]) assert.ok(lines.some((l) => l.includes(needle)), `missing: ${needle}`);

// photo-heavy changes get capped
b = clone();
b.projects.items[0].images = Array.from({ length: 80 }, (_, i) => ({ file: `/work/x/${i}.webp`, width: 1, height: 1, stage: "Complete" as const, alt: `p${i}` }));
const capped = diffContent(DEFAULT_CONTENT, b)[0].lines;
assert.ok(capped.length <= 61 && capped[capped.length - 1].startsWith("…and"));
console.log("unit checks passed\n");

// dry run on real history
async function real() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) return;
  const json = JSON.parse(raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8"));
  initializeApp({ credential: cert({ ...json, private_key: String(json.private_key).replace(/\\n/g, "\n") }) });
  const db = getFirestore();
  const pick = (d: Record<string, unknown>): SiteContent => {
    const out = { ...DEFAULT_CONTENT } as Record<string, unknown>;
    for (const k of Object.keys(DEFAULT_CONTENT)) {
      const c = d[k] === undefined ? null : sanitizeSection(k as keyof SiteContent, d[k]);
      if (c) out[k] = c;
    }
    return out as SiteContent;
  };
  const cur = (await db.collection("site").doc("content").get()).data() ?? {};
  const hist = await db.collection("site_history").orderBy("createdAt", "desc").limit(10).get();
  hist.docs.forEach((d, i) => {
    const g = diffContent(pick(d.get("data") ?? {}), pick(i === 0 ? cur : hist.docs[i - 1].get("data") ?? {}));
    console.log(`REAL  ${new Date(d.get("createdAt")).toLocaleTimeString("en-GB")}  ${d.get("note")}`);
    g.forEach((x) => (console.log(`   [${x.label}]`), x.lines.slice(0, 6).forEach((l) => console.log(`     • ${l}`)), x.lines.length > 6 && console.log(`     … ${x.lines.length - 6} more`)));
    if (!g.length) console.log("   (no visible change)");
  });
}
real();
