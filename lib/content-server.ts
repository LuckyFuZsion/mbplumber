import "server-only";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { DEFAULT_CONTENT, SECTION_KEYS, SECTION_LABELS, type SectionKey, type SiteContent } from "./content";
import { diffContent } from "./content-diff";
import { sanitizeSection } from "./content-validate";
import { adminDb, firebaseConfigured } from "./firebase-admin";

const COL = "site";
const DOC = "content";
const HISTORY = "site_history";
const KEEP_VERSIONS = 40;
const TAG = "site-content";

/** Only valid, correctly-shaped sections are ever returned. Anything odd is ignored and the default shows. */
async function readOverrides(): Promise<Partial<SiteContent>> {
  if (!firebaseConfigured()) return {};
  try {
    const snap = await adminDb().collection(COL).doc(DOC).get();
    return pickValid(snap.data() ?? {});
  } catch (err) {
    console.error("Reading site content failed, using defaults", err);
    return {};
  }
}

function pickValid(data: Record<string, unknown>): Partial<SiteContent> {
  const out: Record<string, unknown> = {};
  for (const key of SECTION_KEYS) {
    if (data[key] === undefined) continue;
    const clean = sanitizeSection(key, data[key]);
    if (clean) out[key] = clean;
  }
  return out as Partial<SiteContent>;
}

const cachedOverrides = unstable_cache(readOverrides, ["site-content-v1"], { tags: [TAG], revalidate: 300 });

/** The site went live on this date; used until the owner makes their first edit. */
const LAUNCH_ISO = "2026-10-10T00:00:00.000Z";

async function readUpdated(): Promise<string> {
  if (!firebaseConfigured()) return LAUNCH_ISO;
  try {
    const snap = await adminDb().collection(COL).doc(DOC).get();
    return snap.updateTime?.toDate().toISOString() ?? LAUNCH_ISO;
  } catch {
    return LAUNCH_ISO;
  }
}
const cachedUpdated = unstable_cache(readUpdated, ["site-updated-v1"], { tags: [TAG], revalidate: 300 });

/** When the content was last edited (ISO). Used for sitemap, "last updated" and structured data. */
export const getLastUpdated = () => cachedUpdated();
export { LAUNCH_ISO };

/** Site content for public pages: the original defaults with any owner edits layered on top. */
export async function getContent(): Promise<SiteContent> {
  return { ...DEFAULT_CONTENT, ...(await cachedOverrides()) };
}

/** Uncached, for the admin screen: current content plus which sections have been customised. */
export async function getAdminState() {
  const overrides = firebaseConfigured() ? await readOverrides() : {};
  return {
    content: { ...DEFAULT_CONTENT, ...overrides } as SiteContent,
    customised: SECTION_KEYS.filter((k) => overrides[k] !== undefined),
  };
}

function refresh() {
  revalidateTag(TAG, { expire: 0 });
  revalidatePath("/", "layout");
}

async function snapshot(note: string, by: string) {
  const db = adminDb();
  const snap = await db.collection(COL).doc(DOC).get();
  await db.collection(HISTORY).add({ createdAt: Date.now(), note, by, data: snap.exists ? snap.data() : {} });
  const old = await db.collection(HISTORY).orderBy("createdAt", "desc").offset(KEEP_VERSIONS).get();
  await Promise.all(old.docs.map((d) => d.ref.delete()));
}

export async function saveSection(key: SectionKey, value: unknown, by: string) {
  const clean = sanitizeSection(key, value);
  if (!clean) throw new Error("That content isn't valid.");
  await snapshot(`Saved: ${SECTION_LABELS[key]}`, by);
  await adminDb().collection(COL).doc(DOC).set({ [key]: clean }, { merge: true });
  refresh();
}

/** Back to the original for one section: removes the owner's edits, defaults show again. */
export async function resetSection(key: SectionKey, by: string) {
  await snapshot(`Reverted to original: ${SECTION_LABELS[key]}`, by);
  await adminDb().collection(COL).doc(DOC).set({ [key]: FieldValue.delete() }, { merge: true });
  refresh();
}

export async function resetAll(by: string) {
  await snapshot("Reverted the whole site to original", by);
  await adminDb().collection(COL).doc(DOC).delete();
  refresh();
}

/**
 * Each history entry is a snapshot of the site taken just BEFORE a change. So the change itself is the
 * difference between that snapshot and the next-newer one (or the live content, for the newest entry).
 */
export async function listHistory() {
  const db = adminDb();
  const [current, res] = await Promise.all([
    db.collection(COL).doc(DOC).get(),
    db.collection(HISTORY).orderBy("createdAt", "desc").limit(KEEP_VERSIONS).get(),
  ]);
  const full = (raw: unknown): SiteContent => ({ ...DEFAULT_CONTENT, ...pickValid((raw ?? {}) as Record<string, unknown>) });
  return res.docs.map((d, i) => {
    const before = full(d.get("data"));
    const after = full(i === 0 ? current.data() : res.docs[i - 1].get("data"));
    return {
      id: d.id,
      createdAt: d.get("createdAt") as number,
      note: d.get("note") as string,
      by: d.get("by") as string,
      groups: diffContent(before, after),
    };
  });
}

/** Put the site back to how it was before a given save. The restore itself is also undoable. */
export async function restoreVersion(id: string, by: string) {
  const v = await adminDb().collection(HISTORY).doc(id).get();
  if (!v.exists) throw new Error("That version no longer exists.");
  await snapshot("Before restoring an older version", by);
  await adminDb().collection(COL).doc(DOC).set(pickValid(v.get("data") ?? {}));
  refresh();
}
