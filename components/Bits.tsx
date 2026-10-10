import Link from "next/link";
import { phoneHref } from "@/lib/content";
import { getContent } from "@/lib/content-server";
import { MailIcon, PhoneIcon } from "./Icons";

export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-ink-soft">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-brand-red/15 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="eyebrow fade-up mb-4">{eyebrow}</p>
        <h1 className="heading fade-up max-w-3xl text-4xl sm:text-6xl" style={{ animationDelay: "80ms" }}>
          {title}
        </h1>
        {intro && (
          <p className="fade-up mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/75" style={{ animationDelay: "160ms" }}>
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}

export async function CtaBand() {
  const { cta, business } = await getContent();
  return (
    <section className="border-t border-white/10 bg-ink-soft">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-12 text-center sm:px-6 md:flex-row md:text-left">
        <div>
          <h2 className="heading text-3xl sm:text-4xl">{cta.heading}</h2>
          <p className="mt-2 font-medium text-white/70">{cta.text} {business.area}.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href={phoneHref(business.phone)} className="btn btn-yellow">
            <PhoneIcon className="h-5 w-5" /> {business.phone}
          </a>
          <Link href="/contact" className="btn btn-ghost">
            <MailIcon className="h-5 w-5" /> Send a message
          </Link>
        </div>
      </div>
    </section>
  );
}
