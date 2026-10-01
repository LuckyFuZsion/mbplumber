export const SITE = {
  name: "MB Plumber",
  tagline: "Grantham Born. Grantham Trained. Grantham Trusted.",
  phone: "07830 001306",
  phoneHref: "tel:+447830001306",
  email: "info@mbplumber.co.uk",
  yearsExperience: "20+",
  area: "Grantham & surrounding villages",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mbplumber.co.uk",
};

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/reviews", label: "Reviews" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export const SERVICES = [
  {
    slug: "general-plumbing",
    icon: "general-plumbing",
    title: "General Plumbing",
    blurb:
      "Leaks, blockages, burst pipes, new pipework and everyday repairs. Small jobs or big, done properly the first time.",
    points: ["Leak finding & repair", "Pipework & fittings", "Toilet & cistern repairs", "Appliance connections"],
  },
  {
    slug: "taps",
    icon: "taps",
    title: "Taps",
    blurb:
      "Dripping, stiff or just dated. Repairs, replacements and fitting of your own choice of tap, from classic to modern brassware.",
    points: ["Tap repairs & washers", "Kitchen & bathroom taps", "Mixer & monobloc fitting", "Outside taps"],
  },
  {
    slug: "sinks",
    icon: "sinks",
    title: "Sinks",
    blurb:
      "Supply and fit, or fit only. Kitchen sinks, basins and vanity units installed neatly with clean pipework and no drips.",
    points: ["Kitchen sink fitting", "Basins & vanity units", "Waste & trap replacement", "Unblocking"],
  },
  {
    slug: "bathrooms",
    icon: "bathrooms",
    title: "Bathrooms",
    blurb:
      "Full bathroom fit-outs and refreshes: showers, toilets, basins, baths and walk-in wet rooms, finished to a high standard.",
    points: ["Complete bathroom installs", "Showers & wet rooms", "Toilets, baths & basins", "Heated towel rails"],
  },
  {
    slug: "boilers",
    icon: "heating",
    title: "Heating & Boiler-Related Work",
    blurb:
      "Radiators, heating pipework and the water side of your heating system. Any work on the gas boiler itself is handled by a Gas Safe registered engineer, and we will tell you straight which is which.",
    points: ["Radiators: fit, swap & bleed", "Heating pipework", "Radiator valves & TRVs", "Honest advice on your system"],
  },
];

export const WHY = [
  { title: "20+ years experience", text: "Two decades on the tools, so we have seen it all and fixed it." },
  { title: "Local to Grantham", text: "Trained here, working here. Your neighbour, not a call centre." },
  { title: "Clear, honest pricing", text: "You know the cost before we start. No nasty surprises." },
  { title: "Tidy, careful work", text: "We protect your home and leave it clean when we go." },
];

// Add real customer reviews here (Google, Facebook, MyBuilder, etc.).
// Only paste reviews that customers have genuinely left.
// `rating` is only for real star ratings (Google etc.). Facebook recommendations have none, so leave it out.
export type Review = { name: string; text: string; date: string; source?: string; rating?: number };
export const REVIEWS: Review[] = [
  {
    name: "Emma P.",
    date: "2026-03-10",
    source: "Facebook",
    text: "I recently had some work carried out at my property and couldn't be happier with the service. Three radiators were replaced and all the valves and pipework were checked and sorted where needed, along with the heating control system. Everything was done to a really high standard and the whole job was completed quickly and efficiently.",
  },
  {
    name: "Sharon D.",
    date: "2026-02-15",
    source: "Facebook",
    text: "Just had our shower room done. Mick has done a lovely job and I cannot fault anything: communication, work rate, tidiness, honest and trustworthy. We left the key with him when we got home from work and he discussed how the day had gone and what he had to do. I would recommend him to anybody thinking of having a bathroom or plumbing done.",
  },
  {
    name: "Zoe E.",
    date: "2025-09-03",
    source: "Facebook",
    text: "Recently had a new bathroom fitted by Mick. Absolutely over the moon with the result. He was very reliable, trustworthy and efficient! I can't recommend Mick high enough! We will definitely be using him for all plumbing jobs going forward. Thank you Mick!",
  },
];

// Where customers can leave reviews.
export const REVIEW_LINK = "https://www.facebook.com/MBPlumber/reviews/";

// Only fill this in with REAL figures taken from a review platform that shows star ratings
// (e.g. Google Business Profile). Leave null otherwise: it is added to the site's search markup.
export const AGGREGATE_RATING: { ratingValue: number; reviewCount: number } | null = null;

export const GALLERY_CATEGORIES = ["Bathrooms", "Taps & Sinks", "Boilers & Heating", "General Plumbing"] as const;
