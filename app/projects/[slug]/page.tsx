import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand, PageHero } from "@/components/Bits";
import { GalleryGrid } from "@/components/GalleryGrid";
import { getProject, PROJECTS, projectCover } from "@/lib/projects";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: { images: [projectCover(project).file] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = PROJECTS.findIndex((p) => p.slug === project.slug);
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  const items = project.images.map((i, n) => ({
    id: `${project.slug}-${n}`,
    url: i.file,
    width: i.width,
    height: i.height,
    caption: i.stage === "Complete" ? project.title : `${project.title} – ${i.stage.toLowerCase()}`,
    category: i.stage,
  }));

  return (
    <>
      <PageHero eyebrow="Project" title={project.title} intro={project.summary} />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <GalleryGrid items={items} />
        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/projects" className="btn btn-ghost">
            ← All projects
          </Link>
          {next.slug !== project.slug && (
            <Link href={`/projects/${next.slug}`} className="btn btn-ghost">
              Next: {next.title} →
            </Link>
          )}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
