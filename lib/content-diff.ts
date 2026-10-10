import { SECTION_KEYS, SECTION_LABELS, type SectionKey, type SiteContent } from "./content";
import type { Project } from "./projects";

/** One section's worth of human-readable changes, e.g. `Phone number: “0783…” → “0784…”`. */
export type ChangeGroup = { key: SectionKey; label: string; lines: string[] };

const clip = (s: string, n = 70) => (s.length > n ? `${s.slice(0, n).trimEnd()}…` : s);
const show = (v: unknown) => (v === undefined || v === null || v === "" ? "(empty)" : `“${clip(String(v))}”`);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Lines for plain text fields that differ. */
function scalars<T extends object>(a: T, b: T, labels: Partial<Record<keyof T, string>>): string[] {
  const out: string[] = [];
  for (const k of Object.keys(labels) as (keyof T)[]) {
    if (a[k] !== b[k]) out.push(`${labels[k]}: ${show(a[k])} → ${show(b[k])}`);
  }
  return out;
}

const sameOrder = (a: string[], b: string[]) =>
  a.filter((x) => b.includes(x)).join("\u0000") === b.filter((x) => a.includes(x)).join("\u0000");

/** Compare two lists of things that have a stable key: reports added, removed, edited and reordered. */
function list<T>(
  a: T[],
  b: T[],
  key: (x: T) => string,
  name: (x: T) => string,
  noun: string,
  item: (x: T, y: T) => string[],
): string[] {
  const out: string[] = [];
  const am = new Map(a.map((x) => [key(x), x]));
  const bm = new Map(b.map((x) => [key(x), x]));
  for (const x of a) if (!bm.has(key(x))) out.push(`Removed ${noun} ${show(name(x))}`);
  for (const y of b) if (!am.has(key(y))) out.push(`Added ${noun} ${show(name(y))}`);
  for (const y of b) {
    const x = am.get(key(y));
    if (x) for (const line of item(x, y)) out.push(`${cap(noun)} ${show(name(y))}: ${line}`);
  }
  if (!sameOrder(a.map(key), b.map(key))) out.push(`Changed the order of the ${noun}s`);
  return out;
}

function project(a: Project, b: Project): string[] {
  const out = scalars(a, b, { title: "Name", summary: "Description" });

  // A photo that vanished and reappeared with the same description is the same photo with a new file
  // (e.g. moved to cloud storage), so say that once instead of "removed" + "added".
  const aFiles = new Set(a.images.map((i) => i.file));
  const bFiles = new Set(b.images.map((i) => i.file));
  const gone = a.images.filter((i) => !bFiles.has(i.file));
  const fresh = b.images.filter((i) => !aFiles.has(i.file));
  const replaced = new Set<string>();
  const replacedNew = new Set<string>();
  for (const g of gone) {
    const match = fresh.find((f) => f.alt === g.alt && !replacedNew.has(f.file));
    if (match && g.alt) {
      replaced.add(g.file);
      replacedNew.add(match.file);
      out.push(`Photo ${show(g.alt)}: image file replaced`);
    }
  }

  out.push(
    ...list(
      a.images.filter((i) => !replaced.has(i.file)),
      b.images.filter((i) => !replacedNew.has(i.file)),
      (i) => i.file,
      (i) => i.alt || "no description",
      "photo",
      (x, y) => scalars(x, y, { alt: "Photo description", stage: "Label" }),
    ),
  );
  const ca = a.images[a.cover]?.file;
  const cb = b.images[b.cover]?.file;
  const coverJustReplaced = ca !== undefined && cb !== undefined && replaced.has(ca) && replacedNew.has(cb);
  if (ca !== cb && cb && !coverJustReplaced) out.push(`Cover photo changed to ${show(b.images[b.cover]?.alt || "another photo")}`);
  return out;
}

const SECTIONS: { [K in SectionKey]: (a: SiteContent[K], b: SiteContent[K]) => string[] } = {
  business: (a, b) =>
    scalars(a, b, { phone: "Phone number", email: "Email address", area: "Area covered", tagline: "Tagline", yearsExperience: "Years of experience" }),

  home: (a, b) => [
    ...scalars(a, b, {
      eyebrow: "Small line above headline",
      title: "Headline",
      intro: "Intro paragraph",
      featuredEyebrow: "Recent work small line",
      featuredHeading: "Recent work heading",
      servicesEyebrow: "Services small line",
      servicesHeading: "Services heading",
      whyEyebrow: "Why choose us small line",
      whyHeading: "Why choose us heading",
    }),
    ...list(a.stats, b.stats, (s) => s.small, (s) => `${s.big} – ${s.small}`, "highlight", (x, y) => scalars(x, y, { big: "Big word" })),
    ...list(a.why, b.why, (w) => w.title, (w) => w.title, "point", (x, y) => scalars(x, y, { text: "Text" })),
  ],

  services: (a, b) => [
    ...scalars(a, b, { title: "Page heading", intro: "Page intro" }),
    ...list(
      a.items,
      b.items,
      (s) => s.slug,
      (s) => s.title,
      "service",
      (x, y) => {
        const out = scalars(x, y, { title: "Name", blurb: "Description", icon: "Icon" });
        for (const p of x.points) if (!y.points.includes(p)) out.push(`Removed bullet ${show(p)}`);
        for (const p of y.points) if (!x.points.includes(p)) out.push(`Added bullet ${show(p)}`);
        return out;
      },
    ),
  ],

  reviews: (a, b) => [
    ...scalars(a, b, { title: "Page heading", intro: "Page intro", link: "Review link" }),
    ...list(
      a.items,
      b.items,
      (r) => `${r.name}|${r.date}`,
      (r) => `${r.name} (${r.date})`,
      "review",
      (x, y) =>
        scalars({ ...x, rating: String(x.rating ?? "") , source: x.source ?? "" }, { ...y, rating: String(y.rating ?? ""), source: y.source ?? "" }, {
          text: "Text",
          source: "Where from",
          rating: "Stars",
        }),
    ),
  ],

  projects: (a, b) => [
    ...scalars(a, b, { title: "Projects page heading", intro: "Projects page intro" }),
    ...list(a.items, b.items, (p) => p.slug, (p) => p.title, "project", project),
  ],

  contact: (a, b) => scalars(a, b, { title: "Heading", intro: "Intro" }),
  cta: (a, b) => scalars(a, b, { heading: "Heading", text: "Text" }),

  faq: (a, b) => [
    ...scalars(a, b, { heading: "Section heading" }),
    ...list(a.items, b.items, (f) => f.q, (f) => f.q, "question", (x, y) => scalars(x, y, { a: "Answer" })),
  ],
};

const MAX_LINES = 60;

/** Everything that differs between two versions of the site content, grouped by section. */
export function diffContent(before: SiteContent, after: SiteContent): ChangeGroup[] {
  const groups: ChangeGroup[] = [];
  for (const key of SECTION_KEYS) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lines = (SECTIONS[key] as (a: any, b: any) => string[])(before[key], after[key]);
    if (!lines.length) continue;
    const shown = lines.length > MAX_LINES ? [...lines.slice(0, MAX_LINES), `…and ${lines.length - MAX_LINES} more changes`] : lines;
    groups.push({ key, label: SECTION_LABELS[key], lines: shown });
  }
  return groups;
}
