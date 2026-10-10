import type { MetadataRoute } from "next";
import { getContent, getLastUpdated } from "@/lib/content-server";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ projects }, updated] = await Promise.all([getContent(), getLastUpdated()]);
  const lastModified = new Date(updated);
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${SITE.url}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  });
  return [
    page("", 1),
    page("/services", 0.9),
    page("/projects", 0.9),
    ...projects.items.map((p) => page(`/projects/${p.slug}`, 0.7)),
    page("/gallery", 0.6),
    page("/reviews", 0.6),
    page("/contact", 0.8),
  ];
}
