import type { Metadata } from "next";
import { CtaBand, PageHero } from "@/components/Bits";
import { GalleryGrid, type GridItem } from "@/components/GalleryGrid";
import { getGalleryItems } from "@/lib/cloudinary";
import { allProjectGridItems } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Recent bathrooms, taps, sinks and plumbing work completed by MB Plumber in Grantham.",
};

export const revalidate = 60;

// Shown only until the first photo is uploaded to Cloudinary (or if Cloudinary isn't configured yet).
const FALLBACK: GridItem[] = allProjectGridItems();

export default async function GalleryPage() {
  const live = await getGalleryItems();
  const items: GridItem[] = live.length ? live : FALLBACK;

  return (
    <>
      <PageHero
        eyebrow="Our work"
        title="Recent jobs, done right"
        intro="A look at some of the bathrooms, taps, sinks and plumbing jobs we have completed around Grantham."
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <GalleryGrid items={items} />
      </section>
      <CtaBand />
    </>
  );
}
