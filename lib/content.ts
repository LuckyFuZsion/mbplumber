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
  faq: { heading: string; items: { q: string; a: string }[] };
};

export type SectionKey = keyof SiteContent;
export const SECTION_KEYS: SectionKey[] = ["business", "home", "services", "reviews", "projects", "contact", "cta", "faq"];

export const SECTION_LABELS: Record<SectionKey, string> = {
  business: "Business details",
  home: "Home page",
  services: "Services",
  reviews: "Reviews",
  projects: "Projects",
  contact: "Contact page",
  cta: "Bottom banner",
  faq: "FAQs",
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
  // Plain-English answers (40-80 words each suits search "answer boxes"). Only facts already on the site.
  faq: {
    heading: "Frequently asked questions",
    items: [
      {
        q: "What areas do you cover?",
        a: "MB Plumber is based in Grantham and covers the surrounding villages. If you are not sure whether we can reach you, just give us a call or send a message through the contact page and we will let you know. We are always happy to talk through your job over the phone before arranging anything.",
      },
      {
        q: "What bathroom work do you do?",
        a: "Bathroom fitting is our main service, from complete bathroom installations to smaller updates such as a new shower, toilet, basin or heated towel rail. Every job is completed with care and attention to detail, from the first visit to the finishing touches. You can see examples of finished bathrooms, including before and after photos, on our completed work page.",
      },
      {
        q: "Can you work on my boiler?",
        a: "We carry out radiators, heating pipework and the water side of your heating system. We do not carry out work on the gas boiler itself, which must be done by a Gas Safe registered engineer. You can check any engineer's registration on the Gas Safe Register website before they start, so you know exactly who is working in your home.",
      },
      {
        q: "How do I get a quote?",
        a: "We offer free, no-obligation quotes. Call us or send a message through the contact page, tell us what you need, and we will talk you through it. You will know the cost before we start, so there are no surprises when the job is finished. Photos of the room can help if you have them.",
      },
      {
        q: "How do you protect my home during a job?",
        a: "We take care to protect your home and leave it clean when we go. Being respectful of your property is part of every job, whether it is a small repair or a full bathroom installation. If you have any particular concerns about access, pets or children, mention them when you get in touch and we will take them into account.",
      },
    ],
  },
};

/** `07830 001306` -> `tel:+447830001306` */
export function phoneHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return `tel:${digits}`;
  if (digits.startsWith("0")) return `tel:+44${digits.slice(1)}`;
  return `tel:${digits}`;
}
