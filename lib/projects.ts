import type { GridItem } from "@/components/GalleryGrid";

export type ProjectImage = { file: string; width: number; height: number; stage: "Before" | "After" | "Complete"; alt: string };

export type Project = {
  slug: string;
  title: string;
  summary: string;
  cover: number; // index into images
  images: ProjectImage[];
};

// All photos are WebP, each under 100KB, stored in public/work/<slug>/.
// Titles and summaries are placeholders taken from the photos: replace with the real job details
// (location, what was fitted, how long it took) as Mick supplies them.
const img = (slug: string, n: number, width: number, height: number, stage: ProjectImage["stage"], alt: string): ProjectImage => ({
  file: `/work/${slug}/${String(n).padStart(2, "0")}.webp`,
  width,
  height,
  stage,
  alt,
});

const ALL_PROJECTS: Project[] = [
  {
    slug: "bathroom-1",
    title: "Bathroom 1",
    summary: "A dated bathroom with a painted teal finish replaced with a walk-in shower, new toilet and a painted vanity unit.",
    cover: 3,
    images: [
      img("bathroom-1", 1, 1600, 1200, "Before", "Bathroom before the refit, with teal walls and an old basin and toilet"),
      img("bathroom-1", 2, 1600, 1200, "Before", "Old bath with a folding shower screen before the refit"),
      img("bathroom-1", 3, 900, 1600, "After", "Finished bathroom with a grey vanity unit and toilet"),
      img("bathroom-1", 4, 1600, 1527, "After", "Finished bathroom with a glass shower enclosure, toilet and vanity unit"),
      img("bathroom-1", 5, 900, 1600, "After", "New thermostatic shower with a rainfall head"),
    ],
  },
  {
    slug: "bathroom-2",
    title: "Bathroom 2",
    summary: "Stripped back to the walls and rebuilt with marble-effect panels, a sliding shower door and a fitted vanity with illuminated mirrors.",
    cover: 3,
    images: [
      img("bathroom-2", 1, 1600, 1200, "Before", "Bathroom stripped out ready for the refit"),
      img("bathroom-2", 2, 1200, 1600, "Before", "Old shower enclosure and toilet before the refit"),
      img("bathroom-2", 3, 1600, 1200, "After", "Finished bathroom with marble-effect panels and a sliding shower door"),
      img("bathroom-2", 4, 1600, 1200, "After", "Fitted vanity unit with illuminated mirror cabinets"),
    ],
  },
  {
    slug: "bathroom-3",
    title: "Bathroom 3",
    summary: "A slate-effect tiled walk-in shower with brass fittings, a glass screen and a double vanity.",
    cover: 2,
    images: [
      img("bathroom-3", 1, 1600, 1200, "Complete", "Bathroom with grey panelling and two heated towel rails"),
      img("bathroom-3", 2, 1200, 1600, "Complete", "Dark tiled shower with a recessed shower valve"),
      img("bathroom-3", 3, 1600, 1200, "Complete", "Slate-effect walk-in shower with a double vanity and brass taps"),
      img("bathroom-3", 4, 1200, 1600, "Complete", "Slate-effect walk-in shower with a brass shower head"),
    ],
  },
  {
    slug: "bathroom-4",
    title: "Bathroom 4",
    summary: "An older bathroom suite replaced with a modern walk-in shower, a fitted vanity and a wood-effect floor.",
    cover: 2,
    images: [
      img("bathroom-4", 1, 1600, 900, "Complete", "Old bathroom suite before the refit"),
      img("bathroom-4", 2, 1600, 900, "Complete", "Old basin and tiled walls before the refit"),
      img("bathroom-4", 3, 900, 1600, "Complete", "Finished bathroom with a walk-in shower and wood-effect floor"),
      img("bathroom-4", 4, 900, 1600, "Complete", "Shower with a recessed shelf and brass shower head"),
    ],
  },
  {
    slug: "bathroom-5",
    title: "Bathroom 5",
    summary: "A quadrant shower enclosure, a heated towel rail and shutters, finished in tile-effect wall panels.",
    cover: 0,
    images: [
      img("bathroom-5", 1, 1200, 1600, "Complete", "Quadrant shower enclosure with dark tile-effect panels"),
      img("bathroom-5", 2, 1200, 1600, "Complete", "Bathroom with a heated towel rail and a curved shower enclosure"),
      img("bathroom-5", 3, 1200, 1600, "Complete", "Quadrant shower with a blue panelled wall and shutters"),
      img("bathroom-5", 4, 1200, 1600, "Complete", "Bathroom with a brass towel rail and shuttered window"),
    ],
  },
];

// Display order: strongest work first, as most visitors only look at the first few.
const ORDER = ["bathroom-4", "bathroom-2", "bathroom-3", "bathroom-1", "bathroom-5"];
export const PROJECTS: Project[] = ORDER.map((slug) => ALL_PROJECTS.find((p) => p.slug === slug)!);

export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);

export const projectCover = (p: Project) => p.images[p.cover];

/** Every project photo as a gallery item (used until photos are uploaded through the admin panel). */
export function allProjectGridItems(): GridItem[] {
  return PROJECTS.flatMap((p) =>
    p.images.map((i, n) => ({
      id: `${p.slug}-${n}`,
      url: i.file,
      width: i.width,
      height: i.height,
      caption: `${p.title}${i.stage === "Complete" ? "" : ` – ${i.stage.toLowerCase()}`}`,
      category: "Bathrooms",
    })),
  );
}
