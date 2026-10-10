import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, PageHero } from "@/components/Bits";
import { PROJECTS, projectCover } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Completed bathroom and plumbing work by MB Plumber in Grantham.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="Completed work"
        intro="A selection of recent jobs around Grantham. Open any one to see the full set of photos."
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p) => {
            const cover = projectCover(p);
            const hasBefore = p.images.some((i) => i.stage === "Before");
            return (
              <Link key={p.slug} href={`/projects/${p.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-ink-soft">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cover.file}
                    alt={cover.alt}
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
