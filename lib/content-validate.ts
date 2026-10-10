import { SERVICE_ICONS, type SectionKey, type SiteContent } from "./content";
import type { Project, ProjectImage } from "./projects";

/**
 * Rebuilds whatever the admin sends into exactly the shape the site expects: unknown keys are dropped,
 * strings are trimmed and length-capped, lists are size-capped. Returns null if the value is unusable.
 * This is what stops a bad edit from ever breaking a public page.
 */
const str = (v: unknown, max = 500, fallback = ""): string =>
  typeof v === "string" ? v.trim().slice(0, max) : fallback;
const list = <T>(v: unknown, max: number, each: (x: unknown) => T | null): T[] =>
  (Array.isArray(v) ? v : []).slice(0, max).map(each).filter((x): x is T => x !== null);
const num = (v: unknown, fallback: number) => (typeof v === "number" && Number.isFinite(v) && v > 0 ? Math.round(v) : fallback);
const obj = (v: unknown): Record<string, unknown> | null => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null);

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

/** Images must come from our own site or our Cloudinary account. */
function safeImageUrl(v: unknown): string | null {
  const u = str(v, 600);
  if (u.startsWith("/work/")) return u;
  try {
    const url = new URL(u);
    const cloud = process.env.CLOUDINARY_CLOUD_NAME;
    if (url.protocol === "https:" && url.hostname === "res.cloudinary.com" && (!cloud || url.pathname.startsWith(`/${cloud}/`))) return u;
  } catch {}
  return null;
}

function image(v: unknown): ProjectImage | null {
  const o = obj(v);
  const file = o && safeImageUrl(o.file);
  if (!o || !file) return null;
  const stage = o.stage === "Before" || o.stage === "After" ? o.stage : "Complete";
  return { file, width: num(o.width, 1200), height: num(o.height, 1600), stage, alt: str(o.alt, 300) };
}

function project(v: unknown, seen: Set<string>): Project | null {
  const o = obj(v);
  if (!o) return null;
  const title = str(o.title, 120);
  if (!title) return null;
  let slug = slugify(str(o.slug, 80) || title) || "project";
  const base = slug;
  for (let n = 2; seen.has(slug); n++) slug = `${base}-${n}`;
  seen.add(slug);
  const images = list(o.images, 60, image);
  const cover = typeof o.cover === "number" && o.cover >= 0 && o.cover < images.length ? Math.floor(o.cover) : 0;
  return { slug, title, summary: str(o.summary, 600), cover, images };
}

export function sanitizeSection<K extends SectionKey>(key: K, value: unknown): SiteContent[K] | null {
  const o = obj(value);
  if (!o) return null;
  switch (key) {
    case "business": {
      const phone = str(o.phone, 40);
      if (!phone) return null;
      return {
        phone,
        email: str(o.email, 120),
        area: str(o.area, 160),
        tagline: str(o.tagline, 200),
        yearsExperience: str(o.yearsExperience, 20),
      } as SiteContent[K];
    }
    case "home":
      return {
        eyebrow: str(o.eyebrow, 120),
        title: str(o.title, 200),
        intro: str(o.intro, 900),
        stats: list(o.stats, 6, (x) => {
          const s = obj(x);
          return s ? { big: str(s.big, 30), small: str(s.small, 80) } : null;
        }),
        featuredEyebrow: str(o.featuredEyebrow, 80),
        featuredHeading: str(o.featuredHeading, 120),
        servicesEyebrow: str(o.servicesEyebrow, 80),
        servicesHeading: str(o.servicesHeading, 120),
        whyEyebrow: str(o.whyEyebrow, 80),
        whyHeading: str(o.whyHeading, 160),
        why: list(o.why, 8, (x) => {
          const w = obj(x);
          return w && str(w.title, 100) ? { title: str(w.title, 100), text: str(w.text, 300) } : null;
        }),
      } as SiteContent[K];
    case "services": {
      const seen = new Set<string>();
      const items = list(o.items, 20, (x) => {
        const s = obj(x);
        const title = s && str(s.title, 100);
        if (!s || !title) return null;
        let slug = slugify(str(s.slug, 80) || title) || "service";
        const base = slug;
        for (let n = 2; seen.has(slug); n++) slug = `${base}-${n}`;
        seen.add(slug);
        const icon = (SERVICE_ICONS as readonly string[]).includes(str(s.icon)) ? str(s.icon) : "general-plumbing";
        return { slug, icon, title, blurb: str(s.blurb, 600), points: list(s.points, 10, (p) => str(p, 100) || null) };
      });
      return { title: str(o.title, 160), intro: str(o.intro, 400), items } as SiteContent[K];
    }
    case "reviews":
      return {
        title: str(o.title, 160),
        intro: str(o.intro, 300),
        link: str(o.link, 300),
        items: list(o.items, 50, (x) => {
          const r = obj(x);
          if (!r || !str(r.name, 80) || !str(r.text, 1500)) return null;
          const date = /^\d{4}-\d{2}-\d{2}$/.test(str(r.date, 10)) ? str(r.date, 10) : new Date().toISOString().slice(0, 10);
          const rating = typeof r.rating === "number" && r.rating >= 1 && r.rating <= 5 ? Math.round(r.rating) : undefined;
          return { name: str(r.name, 80), text: str(r.text, 1500), date, ...(str(r.source, 40) && { source: str(r.source, 40) }), ...(rating && { rating }) };
        }),
      } as SiteContent[K];
    case "projects": {
      const seen = new Set<string>();
      return {
        title: str(o.title, 160),
        intro: str(o.intro, 400),
        items: list(o.items, 60, (x) => project(x, seen)),
      } as SiteContent[K];
    }
    case "contact":
      return { title: str(o.title, 160), intro: str(o.intro, 400) } as SiteContent[K];
    case "cta":
      return { heading: str(o.heading, 160), text: str(o.text, 300) } as SiteContent[K];
    case "faq":
      return {
        heading: str(o.heading, 160),
        items: list(o.items, 15, (x) => {
          const f = obj(x);
          return f && str(f.q, 200) && str(f.a, 900) ? { q: str(f.q, 200), a: str(f.a, 900) } : null;
        }),
      } as SiteContent[K];
    default:
      return null;
  }
}
