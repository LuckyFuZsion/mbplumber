/** Read-only: shows what is saved in Firestore and the recent history. Run: npx tsx --env-file=.env.local scripts/inspect-content.ts */
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const raw = process.env.FIREBASE_SERVICE_ACCOUNT!;
const json = JSON.parse(raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8"));
initializeApp({ credential: cert({ ...json, private_key: String(json.private_key).replace(/\\n/g, "\n") }) });
const db = getFirestore();

async function main() {
  const doc = (await db.collection("site").doc("content").get()).data() ?? {};
  console.log("sections saved:", Object.keys(doc).join(", ") || "(none)");
  const items = (doc.projects?.items ?? []) as { slug: string; title: string; images: unknown[] }[];
  console.log(`projects (${items.length}):`);
  items.forEach((p, i) => console.log(`  ${i + 1}. "${p.title}"  slug=${p.slug}  photos=${p.images.length}`));
  const hist = await db.collection("site_history").orderBy("createdAt", "desc").limit(8).get();
  console.log("recent history:");
  hist.docs.forEach((d) => console.log(`  ${new Date(d.get("createdAt")).toLocaleTimeString("en-GB")}  ${d.get("note")}  (${d.get("by")})`));
}
main();
