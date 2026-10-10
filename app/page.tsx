import Link from "next/link";
import { CtaBand } from "@/components/Bits";
import { CheckIcon, PhoneIcon, ServiceIcon, ShieldIcon } from "@/components/Icons";
import { PROJECTS, projectCover } from "@/lib/projects";
import { SERVICES, SITE, WHY } from "@/lib/site";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10 bg-ink-soft">
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1fr] lg:py-24">
          <div>
            <p className="eyebrow fade-up mb-5">Plumber · Grantham, Lincolnshire</p>
            <h1 className="heading fade-up text-4xl sm:text-6xl" style={{ animationDelay: "80ms" }}>
              Bathroom fitting and plumbing in Grantham
            </h1>
            <p className="fade-up mt-6 max-w-xl text-lg leading-relaxed text-white/75" style={{ animationDelay: "160ms" }}>
              {SITE.yearsExperience} years of experience. From full bathroom fit-outs to the smaller jobs, you get an
              honest local plumber who turns up on time and does the job properly.
            </p>
            <div className="fade-up mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "240ms" }}>
              <Link href="/projects" className="btn btn-yellow">
                See our bathrooms
              </Link>
              <a href={SITE.phoneHref} className="btn btn-ghost">
                <PhoneIcon className="h-5 w-5" /> Call {SITE.phone}
              </a>
            </div>
          </div>

          <div className="fade-up relative mx-auto w-full max-w-xl" style={{ animationDelay: "200ms" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={projectCover(PROJECTS[2]).file}
              alt={projectCover(PROJECTS[2]).alt}
              width={projectCover(PROJECTS[2]).width}
              height={projectCover(PROJECTS[2]).height}
              className="aspect-[4/3] w-full rounded-2xl border border-white/10 object-cover"
            />
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-b border-white/10 bg-ink">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 text-center sm:px-6 md:grid-cols-4">
          {[
            [`${SITE.yearsExperience}`, "Years experience"],
            ["Local", "Grantham based"],
            ["Free", "No-obligation quotes"],
            ["Tidy", "Clean, careful work"],
          ].map(([big, small]) => (
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
            <p className="eyebrow mb-3">Recent work</p>
            <h2 className="heading max-w-2xl text-3xl sm:text-4xl">Bathrooms we have fitted</h2>
          </div>
          <Link href="/projects" className="btn btn-ghost">
            All projects →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {PROJECTS.slice(0, 4).map((p) => {
            const c = projectCover(p);
            return (
              <Link key={p.slug} href={`/projects/${p.slug}`} className="group block">
                <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-ink-soft">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.file}
                    alt={c.alt}
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
        <p className="eyebrow mb-3">What we do</p>
        <h2 className="heading mb-10 max-w-2xl text-3xl sm:text-4xl">Our services</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => {
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
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={projectCover(PROJECTS[1]).file}
              alt={projectCover(PROJECTS[1]).alt}
              className="relative aspect-[4/3] w-full rounded-3xl object-cover"
            />
          </div>
          <div>
            <p className="eyebrow mb-3">Why choose MB</p>
            <h2 className="heading mb-8 text-3xl sm:text-4xl">The local plumber you can rely on</h2>
            <ul className="space-y-5">
              {WHY.map((w) => (
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

      <CtaBand />
    </>
  );
}
