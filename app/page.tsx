import Link from "next/link";
import { CtaBand } from "@/components/Bits";
import { CheckIcon, PhoneIcon, ServiceIcon, ShieldIcon } from "@/components/Icons";
import { SERVICES, SITE, WHY } from "@/lib/site";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Optional hero photo: drop public/hero.jpg in and it appears behind the text. */}
        <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: "url(/hero.jpg)" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,235,0,0.18),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(232,32,42,0.2),transparent_55%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:py-28">
          <div>
            <p className="eyebrow fade-up mb-5">Plumber · Grantham, Lincolnshire</p>
            <h1 className="heading fade-up text-5xl sm:text-7xl" style={{ animationDelay: "80ms" }}>
              Grantham <span className="text-brand">born.</span>
              <br />
              Grantham <span className="text-brand">trained.</span>
              <br />
              Grantham <span className="text-brand-red">trusted.</span>
            </h1>
            <p className="fade-up mt-7 max-w-xl text-lg font-medium leading-relaxed text-white/75" style={{ animationDelay: "160ms" }}>
              Over {SITE.yearsExperience} years keeping Grantham&apos;s homes flowing. From dripping taps to full bathroom
              fit-outs, you get an honest local plumber who turns up on time and does the job properly.
            </p>
            <div className="fade-up mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "240ms" }}>
              <a href={SITE.phoneHref} className="btn btn-red text-lg">
                <PhoneIcon className="h-5 w-5" /> Call {SITE.phone}
              </a>
              <Link href="/contact" className="btn btn-ghost text-lg">
                Get a free quote
              </Link>
            </div>
          </div>

          <div className="fade-up relative mx-auto w-full max-w-md [perspective:1200px]" style={{ animationDelay: "200ms" }}>
            <div className="absolute -inset-4 rounded-full bg-brand/20 blur-2xl" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="MB Plumber" width={600} height={600} className="logo-spin relative w-full rounded-full shadow-2xl ring-4 ring-brand/40" />
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-y border-white/10 bg-brand text-black">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 text-center sm:px-6 md:grid-cols-4">
          {[
            [`${SITE.yearsExperience}`, "Years experience"],
            ["Local", "Grantham based"],
            ["Free", "No-obligation quotes"],
            ["Tidy", "Clean, careful work"],
          ].map(([big, small]) => (
            <div key={small}>
              <div className="text-3xl font-black sm:text-4xl">{big}</div>
              <div className="text-xs font-extrabold uppercase tracking-widest text-black/70">{small}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <p className="eyebrow mb-3">What we do</p>
        <h2 className="heading mb-12 max-w-2xl text-4xl sm:text-5xl">Plumbing, sorted</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => {
            return (
              <Link
                key={s.slug}
                href="/services"
                className="group rounded-2xl border border-white/10 bg-ink-soft p-7 transition-all hover:-translate-y-1 hover:border-brand"
              >
                <div className="mb-5 inline-flex rounded-xl bg-brand p-3 text-black transition-colors group-hover:bg-brand-red group-hover:text-white">
                  <ServiceIcon name={s.icon} className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-extrabold">{s.title}</h3>
                <p className="text-sm font-medium leading-relaxed text-white/65">{s.blurb}</p>
              </Link>
            );
          })}
          <Link href="/contact" className="flex flex-col justify-center rounded-2xl bg-brand-red p-7 transition-transform hover:-translate-y-1">
            <h3 className="heading text-2xl">Not sure what you need?</h3>
            <p className="mt-2 text-sm font-semibold text-white/90">Describe the problem and we&apos;ll tell you straight. →</p>
          </Link>
        </div>
      </section>

      {/* WHY + PHOTO */}
      <section className="bg-ink-soft">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div className="relative">
            <div className="absolute -bottom-4 -right-4 h-full w-full rounded-3xl bg-brand" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/sample-bathroom.webp"
              alt="Finished bathroom with walk-in shower and double vanity fitted by MB Plumber"
              className="relative aspect-[4/3] w-full rounded-3xl object-cover"
            />
          </div>
          <div>
            <p className="eyebrow mb-3">Why choose MB</p>
            <h2 className="heading mb-8 text-4xl sm:text-5xl">The local plumber you can rely on</h2>
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
              <Link href="/gallery" className="btn btn-yellow">
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
