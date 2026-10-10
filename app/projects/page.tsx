import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, PageHero } from "@/components/Bits";
import { getContent } from "@/lib/content-server";
import { projectCover } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Completed bathroom and plumbing work by MB Plumber in Grantham.",
};

export default async function ProjectsPage() {
  const { projects } = await getContent();
  return (
    <>
      <PageHero
        eyebrow="Projects"
        title={projects.title}
        intro={projects.intro}
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.items.map((p) => {
            const cover = projectCover(p);
            if (!cover) return null;
            const hasBefore = p.images.some((i) => i.stage === "Before");
            return (
              <Link key={p.slug} href={`/projects/${p.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-ink-soft">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cover.file}
                    alt={cover.alt || `${p.title}, completed bathroom project by MB Plumber`}
                    width={cover.width}
                    height={cover.height}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {hasBefore && (
                    <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
                      Before &amp; after
                    </span>
                  )}
                </div>
                <h2 className="mt-4 text-xl font-bold">{p.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-white/65">{p.summary}</p>
              </Link>
            );
          })}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
