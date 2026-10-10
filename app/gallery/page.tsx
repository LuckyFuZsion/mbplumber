import type { Metadata } from "next";
import { CtaBand, PageHero } from "@/components/Bits";
import { GalleryGrid, type GridItem } from "@/components/GalleryGrid";
import { getGalleryItems } from "@/lib/cloudinary";
import { getContent } from "@/lib/content-server";
import { allProjectGridItems } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Recent bathrooms, taps, sinks and plumbing work completed by MB Plumber in Grantham.",
};

export const revalidate = 60;

// Until photos are uploaded to the Cloudinary gallery, show the project photos.
export default async function GalleryPage() {
  const live = await getGalleryItems();
  const { projects } = await getContent();
  const items: GridItem[] = live.length ? live : allProjectGridItems(projects.items);

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
