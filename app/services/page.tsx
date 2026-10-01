import type { Metadata } from "next";
import { CtaBand, PageHero } from "@/components/Bits";
import { CheckIcon, ServiceIcon } from "@/components/Icons";
import { SERVICES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Plumbing Services",
  description:
    "General plumbing, taps, sinks, bathroom installations and some boiler work in Grantham and surrounding villages.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Everything plumbing, under one roof"
        intro="Whatever the job, you get 20+ years of know-how and a straight answer on cost before we start."
      />
      <section className="mx-auto max-w-7xl space-y-6 px-4 py-16 sm:px-6">
        {SERVICES.map((s, i) => {
          return (
            <article
              id={s.slug}
              key={s.slug}
              className="grid scroll-mt-28 gap-8 rounded-3xl border border-white/10 bg-ink-soft p-8 md:grid-cols-[auto_1.4fr_1fr] md:items-center"
            >
              <div className={`inline-flex h-20 w-20 items-center justify-center rounded-2xl ${i % 2 ? "bg-brand-red text-white" : "bg-brand text-black"}`}>
                <ServiceIcon name={s.icon} className="h-12 w-12" />
              </div>
              <div>
                <h2 className="heading mb-3 text-3xl">{s.title}</h2>
                <p className="font-medium leading-relaxed text-white/70">{s.blurb}</p>
              </div>
              <ul className="space-y-2.5">
                {s.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-sm font-bold">
                    <CheckIcon className="h-4 w-4 shrink-0 text-brand" /> {p}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </section>
      <CtaBand />
    </>
  );
}
