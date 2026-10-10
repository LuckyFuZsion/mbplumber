import Link from "next/link";
import { CtaBand } from "@/components/Bits";
import { CheckIcon, PhoneIcon, ServiceIcon, ShieldIcon } from "@/components/Icons";
import { phoneHref } from "@/lib/content";
import { getContent, getLastUpdated } from "@/lib/content-server";
import { SITE } from "@/lib/site";
import { projectCover } from "@/lib/projects";

export default async function Home() {
  const { business, home, services, projects, faq } = await getContent();
  const updated = await getLastUpdated();
  const heroImage = projects.items[0] && projectCover(projects.items[0]);
  const whyImage = (projects.items[1] && projectCover(projects.items[1])) || heroImage;
  const pageLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE.url}/#webpage`,
        url: SITE.url,
        name: `${SITE.name} | ${home.title}`,
        isPartOf: { "@id": `${SITE.url}/#business` },
        about: { "@id": `${SITE.url}/#business` },
        datePublished: "2026-10-10",
        dateModified: updated,
        // Marks the headline and the FAQ answers as the parts suited to being read aloud by voice assistants.
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".faq-answer"] },
      },
      ...(faq.items.length
        ? [
            {
              "@type": "FAQPage",
              mainEntity: faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
            },
          ]
        : []),
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }} />
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10 bg-ink-soft">
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1fr] lg:py-24">
          <div>
            <p className="eyebrow fade-up mb-5">{home.eyebrow}</p>
            <h1 className="heading fade-up text-4xl sm:text-6xl" style={{ animationDelay: "80ms" }}>
              {home.title}
            </h1>
            <p className="fade-up mt-6 max-w-xl text-lg leading-relaxed text-white/75" style={{ animationDelay: "160ms" }}>
              {home.intro}
            </p>
            <div className="fade-up mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "240ms" }}>
              <Link href="/projects" className="btn btn-yellow">
                See our bathrooms
              </Link>
              <a href={phoneHref(business.phone)} className="btn btn-ghost">
                <PhoneIcon className="h-5 w-5" /> Call {business.phone}
              </a>
            </div>
          </div>

          {heroImage && (
            <div className="fade-up relative mx-auto w-full max-w-xl" style={{ animationDelay: "200ms" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImage.file}
                alt={heroImage.alt || "Completed bathroom by MB Plumber"}
                width={heroImage.width}
                height={heroImage.height}
                className="aspect-[4/3] w-full rounded-2xl border border-white/10 object-cover"
              />
            </div>
          )}
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-b border-white/10 bg-ink">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 text-center sm:px-6 md:grid-cols-4">
          {home.stats.map(({ big, small }) => (
            <div key={small}>
              <div className="text-2xl font-bold sm:text-3xl">{big}</div>
              <div className="text-xs font-semibold uppercase tracking-widest text-white/55">{small}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED BATHROOMS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">{home.featuredEyebrow}</p>
            <h2 className="heading max-w-2xl text-3xl sm:text-4xl">{home.featuredHeading}</h2>
          </div>
          <Link href="/projects" className="btn btn-ghost">
            All projects →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {projects.items.slice(0, 4).map((p) => {
            const c = projectCover(p);
            if (!c) return null;
            return (
              <Link key={p.slug} href={`/projects/${p.slug}`} className="group block">
                <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-ink-soft">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.file}
                    alt={c.alt || `${p.title}, completed bathroom project by MB Plumber`}
                    width={c.width}
                    height={c.height}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 font-semibold">{p.title}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <p className="eyebrow mb-3">{home.servicesEyebrow}</p>
        <h2 className="heading mb-10 max-w-2xl text-3xl sm:text-4xl">{home.servicesHeading}</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.items.map((s) => {
            return (
              <Link
                key={s.slug}
                href="/services"
                className="group rounded-2xl border border-white/10 bg-ink-soft p-7 transition-all hover:-translate-y-1 hover:border-brand"
              >
                <div className="mb-5 inline-flex rounded-xl bg-white/10 p-3 text-brand transition-colors group-hover:bg-brand group-hover:text-black">
                  <ServiceIcon name={s.icon} className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{s.title}</h3>
                <p className="text-sm font-medium leading-relaxed text-white/65">{s.blurb}</p>
              </Link>
            );
          })}
          <Link href="/contact" className="flex flex-col justify-center rounded-2xl border border-white/20 p-7 transition-colors hover:border-brand">
            <h3 className="heading text-2xl">Not sure what you need?</h3>
            <p className="mt-2 text-sm font-medium text-white/75">Describe the problem and we&apos;ll tell you straight. →</p>
          </Link>
        </div>
      </section>

      {/* WHY + PHOTO */}
      <section className="bg-ink-soft">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
          {whyImage && (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={whyImage.file} alt={whyImage.alt || "Completed bathroom by MB Plumber"} className="relative aspect-[4/3] w-full rounded-3xl object-cover" />
            </div>
          )}
          <div>
            <p className="eyebrow mb-3">{home.whyEyebrow}</p>
            <h2 className="heading mb-8 text-3xl sm:text-4xl">{home.whyHeading}</h2>
            <ul className="space-y-5">
              {home.why.map((w) => (
                <li key={w.title} className="flex gap-4">
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-black">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-extrabold">{w.title}</h3>
                    <p className="text-sm font-medium text-white/65">{w.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/projects" className="btn btn-yellow">
                See our work
              </Link>
              <Link href="/reviews" className="btn btn-ghost">
                <ShieldIcon className="h-5 w-5" /> Customer reviews
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faq.items.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
          <h2 className="heading mb-10 text-3xl sm:text-4xl">{faq.heading}</h2>
          <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-ink-soft">
            {faq.items.map((f) => (
              <div key={f.q} className="p-6 sm:p-7">
                <h3 className="text-lg font-bold">{f.q}</h3>
                <p className="faq-answer mt-2 leading-relaxed text-white/70">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
