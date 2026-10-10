import { REVIEWS, REVIEW_LINK, SERVICES, SITE, WHY } from "./site";
import { DEFAULT_PROJECTS, type Project } from "./projects";

/**
 * Everything on the site that the owner can edit from /admin.
 *
 * The DEFAULT_CONTENT below is the site "as originally delivered". It lives in code, so nothing the
 * owner does in the admin can change it. Edits are stored separately (Firestore) as per-section overrides;
 * "Revert to original" simply deletes the override and the defaults show again.
 */
export type Service = { slug: string; icon: string; title: string; blurb: string; points: string[] };
export type ReviewItem = { name: string; text: string; date: string; source?: string; rating?: number };

export type SiteContent = {
  business: { phone: string; email: string; area: string; tagline: string; yearsExperience: string };
  home: {
    eyebrow: string;
    title: string;
    intro: string;
    stats: { big: string; small: string }[];
    featuredEyebrow: string;
    featuredHeading: string;
    servicesEyebrow: string;
    servicesHeading: string;
    whyEyebrow: string;
    whyHeading: string;
    why: { title: string; text: string }[];
  };
  services: { title: string; intro: string; items: Service[] };
  reviews: { title: string; intro: string; link: string; items: ReviewItem[] };
  projects: { title: string; intro: string; items: Project[] };
  contact: { title: string; intro: string };
  cta: { heading: string; text: string };
};

export type SectionKey = keyof SiteContent;
export const SECTION_KEYS: SectionKey[] = ["business", "home", "services", "reviews", "projects", "contact", "cta"];

export const SECTION_LABELS: Record<SectionKey, string> = {
  business: "Business details",
  home: "Home page",
  services: "Services",
  reviews: "Reviews",
  projects: "Projects",
  contact: "Contact page",
  cta: "Bottom banner",
};

export const SERVICE_ICONS = ["bathrooms", "general-plumbing", "taps", "sinks", "heating"] as const;

export const DEFAULT_CONTENT: SiteContent = {
  business: {
    phone: SITE.phone,
    email: SITE.email,
    area: SITE.area,
    tagline: SITE.tagline,
    yearsExperience: SITE.yearsExperience,
  },
  home: {
    eyebrow: "Plumber · Grantham, Lincolnshire",
    title: "Bathroom fitting and plumbing in Grantham",
    intro:
      "With over 20 years of experience, we take care of everything from complete bathroom installations to smaller plumbing repairs. Every job is completed with care and attention to detail, from the first visit to the finishing touches.",
    stats: [
      { big: "20+", small: "Years experience" },
      { big: "Local", small: "Grantham based" },
      { big: "Free", small: "No-obligation quotes" },
      { big: "Respectful", small: "We take care to protect your home" },
    ],
    featuredEyebrow: "Recent work",
    featuredHeading: "Completed work",
    servicesEyebrow: "What we do",
    servicesHeading: "Our services",
    whyEyebrow: "Why choose MB",
    whyHeading: "The local plumber you can rely on",
    why: WHY.map((w) => ({ ...w })),
  },
  services: {
    title: "Everything plumbing, under one roof",
    intro: "Whatever the job, you get 20+ years of know-how and a straight answer on cost before we start.",
    items: SERVICES.map((s) => ({ ...s, points: [...s.points] })),
  },
  reviews: {
    title: "What our customers say",
    intro: "Honest feedback from people we've worked for around Grantham.",
    link: REVIEW_LINK,
    items: REVIEWS.map((r) => ({ ...r })),
  },
  projects: {
    title: "Completed work",
    intro: "A selection of recent jobs around Grantham. Open any one to see the full set of photos.",
    items: DEFAULT_PROJECTS,
  },
  contact: {
    title: "Let's get it sorted",
    intro: "Call, email or send a message below. Free quotes, and we'll get back to you quickly.",
  },
  cta: {
    heading: "Planning a new bathroom?",
    text: "Call for a free, no-obligation quote.",
  },
};

/** `07830 001306` -> `tel:+447830001306` */
export function phoneHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return `tel:${digits}`;
  if (digits.startsWith("0")) return `tel:+44${digits.slice(1)}`;
  return `tel:${digits}`;
}
